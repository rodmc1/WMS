import React from 'react';
import WarehouseSideBar from 'components/WarehouseSidebar';
import WarehouseForm from 'components/WarehouseForm';
import Breadcrumbs from 'components/Breadcrumbs';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

function WarehouseCreate(props) {

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
    console.log(data);

    const sampleCreatedData = {
      name: data.warehouseName,
      warehouse_type: data.warehouseType,
      building_type: data.buildingType,
      gps_coordinate: "string",
      address: data.address.description,
      country: data.address.terms[data.address.terms.length - 1].value,
      year_top: 0,
      min_lease_terms: 0,
      psf: 0,
      floor_area: data.floorArea,
      covered_area: data.coveredArea,
      mezzanine_area: data.mezzanineArea,
      open_area: data.openArea,
      office_area: data.officeArea,
      battery_charging_area: data.batteryChargingArea,
      loading_unloading_bays: data.loadingUnloadingBays,
      remarks: data.remarks,
      facilities_amenities: data.facilities.map(f => f.availability ? f.description : null).filter(Boolean),
      nearby_station: data.nearbyStation,
      warehouse_status: data.warehouseStatus,
      users_details: [
        {
          last_name: data.companyBrokerLastName,
          first_name: data.companyBrokerFirstName,
          middle_name: data.companyBrokerMiddleName,
          mobile_number: data.companyBrokerMobileNumber,
          email_address: data.companyBrokerEmailAddress,
          role: 'Company Broker'
        },
        {
          last_name: data.contactPersonLastName,
          first_name: data.contactPersonFirstName,
          middle_name: data.contactPersonMiddleName,
          mobile_number: data.contactPersonMobileNumber,
          email_address: data.contactPersonEmailAddress,
          role: 'Contact Person'
        }
      ]
    }

    const sampleFiles = {
      images: data.images[data.images.length - 1],
      files: data.files[data.files.length - 1],
    }

    console.log(sampleFiles)
    console.log(sampleCreatedData);
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
          <WarehouseSideBar id={props.match.params.id} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className="paper" elevation={0} variant="outlined">
            <Typography variant="subtitle1" className="paper__heading">Creating Warehouse</Typography>
            <div className="paper__divider"></div>
            <WarehouseForm onSubmit={handleSubmit} onError={handleError} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default WarehouseCreate;