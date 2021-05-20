import React from 'react';
// import WarehouseMasterDataSKUForm from 'components/WarehouseMasterData/SKU/Form';
import { connect } from 'react-redux';
import history from 'config/history';
import { fetchWarehouseSKUs } from 'actions';
import WarehouseMasterDataSidebar from 'components/WarehouseMasterData/Sidebar';
import Table from 'components/Table';
import Breadcrumbs from 'components/Breadcrumbs';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';

function WarehouseMasterDataSKU (props) {

  const routes = [
    {
      label: 'Warehouse Master Data',
      path: '/warehouse-master-data'
    }
  ];

  const config = {
    rowsPerPage: 10,
    headers: [
      { label: 'ID', key: 'item_id' },
      { label: 'Preview', key: 'item_id' },
      { label: 'Product Name', key: 'product_name' },
      { label: 'UOM', key: 'uom_description' },
      { label: 'Code', key: 'item_code' },
      { label: 'External Code', key: 'external_code' },
      { label: 'Min Quantity', key: 'min_qty' },
      { label: 'Max Quantity', key: 'max_qty' }
    ]
  }

  const [query, setQuery] = React.useState('');
  const [rowCount, setRowCount] = React.useState(0);
  const [page, setPage]= React.useState(10);
  const [SKUData, setSKUData] = React.useState(null);
  const [SKUCount, setSKUCount] = React.useState(0);

  const handleRowCount = (page, rowsPerPage) => {
    setRowCount(rowsPerPage);
    setPage(page);
  };

  const handlePagination = (page, rowsPerPage) => {
    // if (query) {
    //   delayedQuery(page, rowsPerPage);
    // } else {
      props.fetchWarehouseSKUs({
        count: rowsPerPage,
        after: page * rowsPerPage
      });
    // }
  };

  // Redirect to selected warehouse
  const handleRowClick = (row) => {
    history.push(`/warehouse-master-data/${props.match.params.id}/sku/${row.item_id}`);
  }
  
  React.useEffect(() => {
    // setLoading(true);
    props.fetchWarehouseSKUs({
      count: page || 10,
      after: page * rowCount
    });
    setSKUData(props.sku.data);
    setSKUCount(props.sku.count);
  }, [props.sku]);

  return (
    <div className="container">
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
            <Typography variant="subtitle1" className="paper__heading">SKU</Typography>
            <div className="paper__divider"></div>
            <Table 
              filterSize={1}
              config={config}
              data={SKUData}
              total={SKUCount}
              handleRowCount={handleRowCount}
              onPaginate={handlePagination}
              onRowClick={handleRowClick}
            />
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

const mapStateToProps = state => {
  return {
    sku: state.sku
  }
}

export default connect(mapStateToProps, { fetchWarehouseSKUs })(WarehouseMasterDataSKU);