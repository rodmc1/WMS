import React from 'react';
import './style.scss';
import WarehouseMasterDataSKUForm from 'components/WarehouseMasterData/SKU/Form';
import WarehouseMasterDataSidebar from 'components/WarehouseMasterData/Sidebar';
import Breadcrumbs from 'components/Breadcrumbs';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { connect } from 'react-redux';
import { createWarehouseSKU } from 'actions';

function WarehouseMasterDataSKUCreate (props) {
  const [warehouse, setWarehouse] = React.useState([]);
  const routes = [
    {
      label: 'Warehouse Master Data',
      path: '/warehouse-master-data'
    },
    {
      label: props.match.params.id,
      path: `/warehouse-master-data/${props.match.params.id}/overview`
    },
    {
      label: 'Creating SKU',
      path: `/warehouse-master-data/${props.match.params.id}/sku/create`
    }
  ];

  const onSubmit = (data) => {
    console.log(data)
    const SKUData = {
      warehouse: props.match.params.id,
      product_name: data.productName,
      uom: data.uom,
      external_code: data.externalCode,
      code: data.code,
      min_quantity: Number(data.minQuantity),
      max_quantity: Number(data.maxQuantity),
      value_per_unit: Number(data.valuePerUnit),
      length: Number(data.length),
      width: Number(data.width),
      height: Number(data.height),
      weight: Number(data.weight),
      storage_type: data.storageType,
      batch_management: data.batchManagement,
      expiry_management: data.expiryManagement,
      remarks: data.remarks,
      company_id: "2fb2aca3-79c6-45db-8301-6403edb16288"
    }
    createWarehouseSKU(SKUData);
  }

  return (
    <div className="container sku">
      <Breadcrumbs routes={routes} />
      <Grid container spacing={2}
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
        <Grid item xs={12} md={3}>
          <WarehouseMasterDataSidebar id={props.match.params.id} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className="paper" elevation={0} variant="outlined">
            <Typography variant="subtitle1" className="paper__heading">Creating SKU</Typography>
            <div className="paper__divider"></div>
            {/* <WarehouseMasterDataForm handleDialogCancel={handleDialogCancel} onSubmit={handleSubmit} onError={handleError} /> */}
            <WarehouseMasterDataSKUForm onSubmit={onSubmit} />
          </Paper>
        </Grid>
        {/* <Snackbar open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
        {renderDialogCancel()} */}
      </Grid>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return state;
}

export default connect(mapStateToProps)(WarehouseMasterDataSKUCreate);