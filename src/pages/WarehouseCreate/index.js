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
import { identity } from 'lodash';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function WarehouseCreate(props) {
  const [created, setCreated] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [error, setError] = React.useState([]);
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
    
    createWarehouse(warehouse).then(response => {
      const warehouseId = response.data;
      if (data.images[data.images.length - 1].length) {
        uploadWarehouseFilesById(warehouseId, data.images[data.images.length - 1])
          .then(res => {
            if (res.statusText === 'Created') setCreated(true);
          })
      } 
      if (data.docs[data.docs.length - 1].length)  {
        uploadWarehouseFilesById(warehouseId, data.docs[data.docs.length - 1])
          .then(res => {
            if (res.statusText === 'Created') setCreated(true);
          })
      }
    }).catch(err => {
      if (err.response === 401) {
        setError('Session Expired');
      } else {
        setError(err.response.data.message);
      }
    });
    
  }

  React.useEffect(() => {
    if (created) {
      history.push({
        pathname: '/warehouse-list',
        success: 'Successfuly saved'
      });
    } 
  }, [created]);

  React.useEffect(() => {
    if (error.length) {
      setOpenSnackBar(true);
    } 
  }, [error])

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
            <WarehouseForm onSubmit={handleSubmit} onError={handleError} />
          </Paper>
        </Grid>
        <Snackbar open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
          <Alert severity="error">{error[error.length]}</Alert>
        </Snackbar>
      </Grid>
    </div>
  )
}

export default WarehouseCreate;