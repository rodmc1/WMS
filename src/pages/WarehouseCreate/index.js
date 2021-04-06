import React from 'react';
import WarehouseSideBar from 'components/WarehouseSidebar';
import WarehouseForm from 'components/WarehouseForm';
import Breadcrumbs from 'components/Breadcrumbs';
import { uploadWarehouseFilesById, createWarehouse } from 'actions/index';
import history from 'config/history';

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
        if (data.images.length) {
          uploadWarehouseFilesById(warehouseId, data.images[data.images.length - 1])
            .then(res => {
              if (res.statusText === 'Created') setCreated(true);
            })
        } 
        if (data.docs.length)  {
          uploadWarehouseFilesById(warehouseId, data.docs[data.docs.length - 1])
            .then(res => {
              if (res.statusText === 'Created') setCreated(true);
            })
        }

        if (!data.images.length && !data.docs.length) setCreated(true);
      })
      .catch(error => {
        if (error.response.data.code === 401) {
          setAlertConfig({ severity: 'error', message: 'Session Expired' });
        } else {
          setAlertConfig({ severity: 'error', message: error.response.data.type +': '+ error.response.data.message });
        }
      });
  }

  const handleDialogCancel = () => {
    setOpen(true);
  }

  const renderDialogCancel = () => {
    return (
      <Dialog
        open={open}
        fullWidth="sm"
        maxWidth="sm"
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
          <Button onClick={() => window.location.reload()} variant="contained" color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  React.useEffect(() => {
    if (created) {
      history.push({
        pathname: '/warehouse-list',
        success: 'Successfuly saved'
      });
    } 
  }, [created]);

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
        <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={() => setOpenSnackBar(false)}>
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
        {renderDialogCancel()}
      </Grid>
    </div>
  )
}

export default WarehouseCreate;