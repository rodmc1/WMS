import _ from 'lodash';
import React from 'react';
import history from 'config/history';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';

import Breadcrumbs from 'components/Breadcrumbs';
import WarehouseDialog from 'components/WarehouseDialog';
import WarehouseForm from 'components/WarehouseList/WarehouseForm';
import WarehouseSideBar from 'components/WarehouseList/WarehouseSidebar';
import { uploadWarehouseFilesById, createWarehouse } from 'actions/index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

// Alerts
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// Functional component for creation warehouse
function WarehouseCreate(props) {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = React.useState({ open: false });
  const [created, setCreated] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [status, setStatus] = React.useState({ images: false, docs: false, warehouse: false });

  // Breadcrumbs routes
  const routes = [
    { label: 'Warehouse List', path: '/warehouse-list' },
    { label: 'Creating Warehouse', path: '/warehouse-list/warehouse-create' }
  ];

  /*
   * Submit function for creating warehouse
   * @args warehouse data
   */
  const handleSubmit = data => {
    setAlertConfig({ severity: 'info', message: 'Creating warehouse...' });
    setOpenSnackBar(true);

    const warehouse = {
      name: data.warehouseName,
      warehouse_type: data.warehouseType,
      building_type: data.buildingType,
      gps_coordinate: data.gpsCoordinates,
      address: data.address,
      country: data.country,
      year_top: Number(data.yearOfTop),
      min_lease_terms: Number(data.minLeaseTerms),
      psf: Number(data.psf),
      floor_area: Number(data.floorArea),
      covered_area: Number(data.coveredArea),
      mezzanine_area: Number(data.mezzanineArea),
      open_area: Number(data.openArea),
      office_area: Number(data.officeArea),
      battery_charging_area: Number(data.batteryChargingArea),
      loading_unloading_bays: Number(data.loadingUnloadingBays),
      remarks: data.remarks,
      facilities_amenities: data.selectedAmenities,
      nearby_station: data.nearbyStation,
      warehouse_status: data.warehouseStatus,
      users_details: [
        {
          last_name: data.companyBrokerLastName,
          first_name: data.companyBrokerFirstName,
          middle_name: data.companyBrokerMiddleName,
          mobile_number: data.companyBrokerMobileNumber,
          email_address: data.companyBrokerEmailAddress,
          role: 'Broker',
          password: 'default',
          username: data.companyBrokerEmailAddress
        },
        {
          last_name: data.contactPersonLastName,
          first_name: data.contactPersonFirstName,
          middle_name: data.contactPersonMiddleName,
          mobile_number: data.contactPersonMobileNumber,
          email_address: data.contactPersonEmailAddress,
          role: 'Contact Person',
          password: 'default',
          username: data.contactPersonEmailAddress
        }
      ]
    }
    
    // Invoke action for create warehouse 
    createWarehouse(warehouse)
      .then(response => {
        const warehouseId = response.data;
        if (response.status === 201) setStatus(prevState => { return {...prevState, warehouse: true }});
        if (!data.images.length && !data.docs.length) setStatus(prevState => { return {...prevState, images: true, docs: true }});

        if (data.images.length > 1) {
          handleImageUpload(warehouseId, data);
        } else {
          setStatus(prevState => { return {...prevState, images: true }});
        }

        if (data.docs.length > 1)  {
          handleWarehouseFilesUpload(warehouseId, data)
        } else {
          setStatus(prevState => { return {...prevState, docs: true }});
        }
      })
      .catch(error => {
        const regex = new RegExp('P0001:');
        if (error.response.data.type === '23505') {
          setAlertConfig({ severity: 'error', message: `Warehouse name is already in use` });
        } else if (regex.test(error.response.data.message)) {
          setAlertConfig({ severity: 'error', message: error.response.data.message.replace('P0001: ','') });
        } else {
          dispatchError(dispatch, THROW_ERROR, error);
        }
      });
  }
  
  // Show dialog confirmation if user click cancel in warehouse form
  const handleDialog = () => {
    setOpenDialog(state => ({...state, open: true}));
  }

  // Function for image upload
  const handleImageUpload = (warehouseId, data) => {
    uploadWarehouseFilesById(warehouseId, data.images[data.images.length - 1])
      .then(res => {
        if (res.status === 201) {
          setStatus(prevState => { return {...prevState, images: true }});
        };
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }

  // Function for files upload
  const handleWarehouseFilesUpload = (warehouseId, data) => {
    uploadWarehouseFilesById(warehouseId, data.docs[data.docs.length - 1])
      .then(res => {
        if (res.status === 201) {
          setStatus(prevState => { return {...prevState, docs: true }});
        };
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }

  // Set created status to true if all api response is success
  React.useEffect(() => {
    if (!Object.values(status).includes(false)) {
      setCreated(true);
    }
  }, [status]);

  // Set created status to true if all api response is success
  React.useEffect(() => {
    if (!_.isEmpty(props.error)) {
      if (props.error.status === 401) {
        setAlertConfig({ severity: 'error', message: 'Session Expired, please login again..' });
      } else {
        setAlertConfig({ severity: 'error', message: props.error.data.type +': '+ props.error.data.message });
      }
    }
  }, [props.error]);

  // Redirect to warehouse list with success message
  if (created) {
    history.push({
      pathname: '/',
      success: 'Successfuly saved'
    });
  }

  const handleError = error => {
    console.log(error)
  }

  return (
    <div className="container">
      <Breadcrumbs routes={routes} />
      <Grid container spacing={2}
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
        <Grid item xs={12} md={3}>
          <WarehouseSideBar id={props.match.params.id} createMode />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className="paper" elevation={0} variant="outlined">
            <Typography variant="subtitle1" className="paper__heading">Creating Warehouse</Typography>
            <div className="paper__divider"></div>
            <WarehouseForm handleDialog={handleDialog} onSubmit={handleSubmit} onError={handleError} />
          </Paper>
        </Grid>
        <Snackbar open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
        <WarehouseDialog
          openDialog={openDialog.open}
          path="/warehouse-list"
          diaglogText="Changes won't be save, continue?"
          dialogTitle="Confirmation"
          buttonConfirmText="Yes"
          buttonCancelText="No"
          dialogAction={() => history.push('/')}
        />
      </Grid>
    </div>
  )
}

const mapStateToProps = (state => {
  return { 
    error: state.error
  }
});

export default connect(mapStateToProps)(WarehouseCreate);