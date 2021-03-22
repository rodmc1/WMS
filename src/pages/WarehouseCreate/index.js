import React from 'react';
import WarehouseSideBar from 'components/WarehouseSidebar';
import WarehouseForm from 'components/WarehouseForm';
import Breadcrumbs from 'components/Breadcrumbs';
import { uploadWarehouseFiles, createWarehouse } from 'actions/index';

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { identity } from 'lodash';

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
    const warehouse = {
      name: data.warehouseName,
      warehouse_type: data.warehouseType,
      building_type: data.buildingType,
      gps_coordinate: "string",
      address: data.address.description,
      country: data.address.terms[data.address.terms.length - 1].value,
      year_top: parseInt(0),
      min_lease_terms: parseInt(0),
      psf: Number(0),
      floor_area: Number(data.floorArea),
      covered_area: Number(data.coveredArea),
      mezzanine_area: Number(data.mezzanineArea),
      open_area: Number(data.openArea),
      office_area: Number(data.officeArea),
      battery_charging_area: Number(data.batteryChargingArea),
      loading_unloading_bays: Number(data.loadingUnloadingBays),
      remarks: data.remarks,
      facilities_amenities: data.facilities_amenities,
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
      const id = response.data;
      if (data.images.length > 0) uploadWarehouseFiles(id, data.images[data.images.length - 1]);
      if (data.files.length > 0) uploadWarehouseFiles(id, data.files[data.files.length - 1]);
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