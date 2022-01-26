import _ from 'lodash';
import React from 'react';
import history from 'config/history';
import Breadcrumbs from 'components/Breadcrumbs';
import WarehouseDialog from 'components/WarehouseDialog';
import ClientForm from 'components/ClientManagement/Form';
import ClientSideBar from 'components/ClientManagement/Sidebar';

import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { fetchWarehouseById, updateUserById, fetchWarehouseClient, updateClientById } from 'actions/index';

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Functional component for warehouse edit
function WarehouseEdit(props) {
  const dispatch = useDispatch();
  const [edited, setEdited] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(true);
  const [resetWarehouse, setResetWarehouse] = React.useState('');
  const [newWarehouseId, setNewWarehouseId] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState({open: false});
  const [existingWarehouseClient, setExistingWarehouseClient] = React.useState('');
  const [alertConfig, setAlertConfig] = React.useState({severity: 'info', message: 'Loading...'});
  const [routes, setRoutes] = React.useState([{label: 'Client Management', path: '/client-management'}]);

  // State for api responses
  const [status, setStatus] = React.useState({
    client: false
  });

  // Submit function for warehouse changes
  const handleSubmit = data => {
    setAlertConfig({ severity: 'info', message: 'Saving changes...' });
    setOpenSnackBar(true);
    
    const clientData = {
      id: existingWarehouseClient.id,
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

    //Handle client update
    updateClientById(existingWarehouseClient.id, clientData)
      .then(response => {
        if (response.status === 201) {
          setNewWarehouseId(data.companyName);
          setStatus(prevState => { return {...prevState, client: true }});
        }
      })
      .catch(error => {
        const regex = new RegExp('existing');
        if ((error.response.data.code === 500 && regex.test(error.response.data.message)) || error.response.data.type === "23505") {
          setAlertConfig({ severity: 'error', message: `Client name is already in use or deleted` });
        } else {
          dispatchError(dispatch, THROW_ERROR, error);
        }
      });
  }

  const handleError = error => {
    console.log(error)
  }

  // Invoke Alert if error exist
  React.useEffect(() => {
    if (!_.isEmpty(props.error)) {
      switch (props.error.status) {
        case 500:
          return setAlertConfig({ severity: 'error', message: props.error.data.type +': Something went wrong. Try again'});
        case !401:
          return setAlertConfig({ severity: 'error', message: props.error.data.type +': '+ props.error.data.message });
        case 401: 
          return setOpenSnackBar(false);
        default:
          return;
      }
    }
  }, [props.error]);
  
  // Set edit state to true if all api response is success
  React.useEffect(() => {
    if (!Object.values(status).includes(false)) {
      setEdited(true);
    }
  }, [status]);

  // Set new routes and path based on the selected warehouse
  React.useEffect(() => {
    if (edited && newWarehouseId) {
      history.push({
        pathname: `/client-management/${newWarehouseId}/overview`,
        success: 'Changes saved successfully'
      });
    } 
  }, [edited, newWarehouseId]);

  // Set new routes and path based on the selected warehouse
  React.useEffect(() => {
    if (props.client && routes.length === 1) {
      setRoutes(routes => [...routes, 
      {
        label: props.match.params.id,
        path: `/client-management/${props.match.params.id}/overview`
      },
      {
        label: 'edit',
        path: `/client-management/${props.match.params.id}/edit`
      }
    ]);
    }
  }, [props.client, props.match.params.id, routes.length]);

  // Fetch request for selected warehouse
  React.useEffect(() => {
    const id = props.match.params.id;    
    if (id) props.fetchWarehouseClient({filter: id});
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.match.params.id]);

  

  // Set initial warehouse data
  React.useEffect(() => {
    if (props.client) setOpenSnackBar(false);
    if (!existingWarehouseClient && props.client) {
      setExistingWarehouseClient(props.client);
    }
  }, [props.client, existingWarehouseClient]);

  // Show dialog confirmation if user click cancel in warehouse form
  const handleDialog = (hasFilesChange) => {
    setResetWarehouse(() => ({...existingWarehouseClient}));
    if (hasFilesChange) setOpenDialog(state => ({...state, open: true}));
  }

  return (
    <div className="container">
      <Breadcrumbs routes={routes} />
      <Grid container spacing={2}
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
        <Grid item xs={12} md={3}>
          <ClientSideBar id={props.match.params.id} deleteId={existingWarehouseClient.client_id} editMode />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className="paper" elevation={0} variant="outlined" style={{position:'relative'}}>
            <Typography variant="subtitle1" className="paper__heading">Edit Warehouse</Typography>
            <div className="paper__divider"></div>
            <ClientForm handleDialog={handleDialog} onSubmit={handleSubmit} onError={handleError} warehouseClient={existingWarehouseClient} resetWarehouse={resetWarehouse} />
          </Paper>
        </Grid>
        <Snackbar 
          anchorOrigin={{vertical: 'bottom',horizontal: 'center'}}
          open={openSnackBar}
          onClose={() => setOpenSnackBar(false)}
        >
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
        <WarehouseDialog
          openDialog={openDialog.open}
          diaglogText="Changes on images and documents won't be save, continue?"
          dialogTitle="Confirmation"
          buttonConfirmText="Yes"
          buttonCancelText="No"
          dialogAction={() => window.location.reload()}
        />
      </Grid>
    </div>
  )
}
const mapStateToProps = (state, ownProps) => {
  return { 
    warehouse: state.warehouses.data[ownProps.match.params.id],
    client: state.client.data[ownProps.match.params.id],
    error: state.error
  }
}

export default connect(mapStateToProps, { fetchWarehouseById, fetchWarehouseClient })(WarehouseEdit);