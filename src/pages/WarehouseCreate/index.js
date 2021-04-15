import React from 'react';
import WarehouseSideBar from 'components/WarehouseSidebar';
import WarehouseForm from 'components/WarehouseForm';
import Breadcrumbs from 'components/Breadcrumbs';
import { uploadWarehouseFilesById, createWarehouse } from 'actions/index';
import history from 'config/history';
import { connect, useDispatch } from 'react-redux';
import _ from 'lodash';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function WarehouseCreate(props) {
  const [created, setCreated] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({});
  const dispatch = useDispatch();
  const routes = [
    {
      label: 'Warehouse List',
      path: '/warehouse-list'
    },
    {
      label: 'Creating Warehouse',
      path: '/warehouse-create'
    }
  ];
  const [status, setStatus] = React.useState({
    images: false,
    docs: false,
    warehouse: false
  });

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
    
    createWarehouse(warehouse)
      .then(response => {
        const warehouseId = response.data;
        if (response.statusText === 'Created') setStatus(prevState => { return {...prevState, warehouse: true }});

        if (data.images.length) {
          uploadWarehouseFilesById(warehouseId, data.images[data.images.length - 1])
            .then(res => {
              if (res.statusText === 'Created') {
                setStatus(prevState => { return {...prevState, images: true }});
              }
            })
        } 
        if (data.docs.length)  {
          uploadWarehouseFilesById(warehouseId, data.docs[data.docs.length - 1])
            .then(res => {
              if (res.statusText === 'Created') {
                setStatus(prevState => { return {...prevState, docs: true }});
              };
            })
        }

        if (!data.images.length && !data.docs.length) {
          setStatus(prevState => { return {...prevState, images: true, docs: true }});
        }
      })
      .catch(error => {
        if (error.response.data.type === '23505') {
          setAlertConfig({ severity: 'error', message: 'Warehouse name already exists' });
        } else {
          dispatchError(dispatch, THROW_ERROR, error);
        }
      });
  }

  const handleDialogCancel = () => {
    setOpen(true);
  }

  React.useEffect(() => {
    if (!Object.values(status).includes(false)) {
      setCreated(true);
    }
  }, [status]);

  React.useEffect(() => {
    if (!_.isEmpty(props.error)) {
      if (props.error.status === 401) {
        setAlertConfig({ severity: 'error', message: 'Session Expired, please login again..' });
      } else {
        setAlertConfig({ severity: 'error', message: props.error.data.type +': '+ props.error.data.message });
      }
    }
  }, [props.error]);

  const renderDialogCancel = () => {
    return (
      <Dialog
        open={open}
        fullWidth
        keepMounted
        m={2}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Changes won't be save, continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined">
            No
          </Button>
          <Button onClick={() => history.push('/warehouse-list')} variant="contained" color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

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
            <WarehouseForm handleDialogCancel={handleDialogCancel} onSubmit={handleSubmit} onError={handleError} />
          </Paper>
        </Grid>
        <Snackbar open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
        {renderDialogCancel()}
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