import _ from 'lodash';
// import './style.scss';
import history from 'config/history';
import React, { useEffect } from 'react';
import WarehouseDialog from 'components/WarehouseDialog';
import ClientManagementForm from 'components/ClientManagement/Form';
import WarehouseSideBar from 'components/ClientManagement/Sidebar';

import { THROW_ERROR } from 'actions/types';
import { createWarehouseClient } from 'actions';
import { dispatchError } from 'helper/error';
import { uploadSKUFilesById } from 'actions';
import { connect, useDispatch } from 'react-redux';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Breadcrumbs from 'components/Breadcrumbs';
import Typography from '@mui/material/Typography';

// Alerts
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ClientManagementCreate (props) {
  const dispatch = useDispatch();
  const [created, setCreated] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({severity: 'info', message: 'Loading...'});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState({ open: false });
  const [status, setStatus] = React.useState({ images: false, sku: false });

  const routes = [
    { label: 'Client Management', path: '/client-management' },
    { label: 'Create Client', path: `/client-management/create` }
  ];

  // Form submit handler
  const onSubmit = data => {
    // setAlertConfig({ severity: 'info', message: 'Creating Client...' });
    // setOpenSnackBar(true);

    const clientData = {
      name: data.companyName,
      address: data.address,
      country: data.country,
      client_status: 'OTHERS',
      warehouse_client: 'Warehouse Client'
    }

    if (data.owner || data.contactPerson) {
      clientData.users_details = [];

      if (data.owner) {
        clientData.users_details.push(
          {
            last_name: null,
            first_name: data.ownerName,
            middle_name: null,
            mobile_number: data.ownerMobileNumber,
            password: "default",
            email_address: data.ownerEmail,
            role: "Owner",
            username: data.ownerEmail
          }
        )
      }

      if (data.contactPerson) {
        clientData.users_details.push(
          {
            last_name: null,
            first_name: data.contactPersonName,
            middle_name: null,
            mobile_number: data.contactPersonMobileNumber,
            password: "default",
            email_address: data.contactPersonEmail,
            role: "Contact Person",
            username: data.contactPersonEmail
          }
        )
      }
    }
    
    createWarehouseClient(clientData)
      .then(res => {
        if (res.status === 201) setStatus(prevState => { return {...prevState, sku: true }});
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }

  // Function for image upload
  const handleImageUpload = (warehouseId, data) => {
    uploadSKUFilesById(warehouseId, null, data.images[data.images.length - 1])
      .then(res => {
        if (res.status === 201) {
          setStatus(prevState => { return {...prevState, images: true }});
        };
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }

  // Set created status to true if all api response is success
  useEffect(() => {
    if (!Object.values(status).includes(false)) {
      setCreated(true);
    }
  }, [status]);

  // Set created status to true if all api response is success
  useEffect(() => {
    if (!_.isEmpty(props.error)) {
      if (props.error.status === 401) {
        setAlertConfig({ severity: 'error', message: 'Session Expired, please login again..' });
      } else if (props.error.status === 500) {
        setAlertConfig({ severity: 'error', message: 'Internal Server Error' });
      } else if (props.error === 'Network Error') {
        setAlertConfig({ severity: 'error', message: 'Network Error...' });
      } else {
        setAlertConfig({ severity: 'error', message: props.error.data.type +': '+ props.error.data.message });
      }
    }
  }, [props.error]);

  // Redirect to warehouse list with success message
  useEffect(() => {
    if (created) {
      history.push({
        pathname: `/client-management`,
        success: 'Successfuly saved'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [created])

  const handleError = error => {
    console.log(error)
  }

  // Show dialog confirmation if user click cancel in warehouse form
  const handleDialog = () => {
    setOpenDialog(state => ({...state, open: true}));
  }

  return (
    <div className="container sku">
      <Breadcrumbs routes={routes} />
      <Grid container spacing={2}
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
        <Grid item xs={12} md={3}>
          <WarehouseSideBar id={props.match.params.id} createMode />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className="paper create-sku" elevation={0} variant="outlined">
            <Typography variant="subtitle1" className="paper__heading form_title">Client Information</Typography>
            <div className="paper__divider" />
            <ClientManagementForm handleDialog={handleDialog} onSubmit={onSubmit} onError={handleError} />
          </Paper>
        </Grid>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
        <WarehouseDialog
          openDialog={openDialog.open}
          diaglogText="Changes won't be save, continue?"
          dialogTitle="Confirmation"
          buttonConfirmText="Yes"
          buttonCancelText="No"
          dialogAction={() => history.push(`/client-management`)}
        />
      </Grid>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return { 
    error: state.error
  }
}

export default connect(mapStateToProps)(ClientManagementCreate);