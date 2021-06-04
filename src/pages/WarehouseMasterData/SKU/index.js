import React from 'react';
import './style.scss';
import _ from 'lodash';
import { fetchSKUByName, fetchWarehouseByName, fetchAllWarehouse, fetchWarehouseSKUs } from 'actions';
import { connect, useDispatch } from 'react-redux';
import history from 'config/history';
import WarehouseMasterDataSidebar from 'components/WarehouseMasterData/Sidebar';
import Table from 'components/Table';
import Breadcrumbs from 'components/Breadcrumbs';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Spinner from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function WarehouseMasterDataSKU (props) {
  const classes = useStyles();
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const [rowCount, setRowCount] = React.useState(0);
  const [page, setPage]= React.useState(10);
  const [SKUData, setSKUData] = React.useState(null);
  const [SKUCount, setSKUCount] = React.useState(0);
  const [searched, setSearched] = React.useState(null);
  const dispatch = useDispatch();

  const routes = [
    {
      label: 'Warehouse Master Data',
      path: '/warehouse-master-data'
    },
    {
      label: props.match.params.id,
      path: `/warehouse-master-data/${props.match.params.id}/overview`
    }
  ];

  const config = {
    rowsPerPage: 10,
    headers: [
      { label: 'ID', key: 'item_id' },
      { label: 'Preview', key: 'item_document_file_type' },
      { label: 'Product Name', key: 'product_name' },
      { label: 'UOM', key: 'uom_description' },
      { label: 'Code', key: 'item_code' },
      { label: 'External Code', key: 'external_code' },
      { label: 'Min Quantity', key: 'min_qty' },
      { label: 'Max Quantity', key: 'max_qty' }
    ]
  }

  const handleRowCount = (page, rowsPerPage) => {
    setRowCount(rowsPerPage);
    setPage(page);
  };

  const handlePagination = (page, rowsPerPage) => {
    if (query) {
      delayedQuery(page, rowsPerPage);
    } else {
      props.fetchWarehouseSKUs({
        count: rowsPerPage,
        after: page * rowsPerPage
      });
    }
  };

  // Redirect to selected warehouse
  const handleRowClick = (row) => {
    history.push(`/warehouse-master-data/${props.match.params.id}/sku/${row.item_id}`);
  }

  // Redirect to sku create
  const handleCreateSKU = () => {
    history.push(`/warehouse-master-data/${props.match.params.id}/sku/create`);
  }

  // Set query state on input change
  const onInputChange = (e) => {
    setSearched(null);
    setQuery(e.target.value);
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const delayedQuery = React.useCallback(_.debounce((page, rowCount) => {
    setSearchLoading(true);
    props.fetchSKUByName({
      filter: query,
      count: rowCount,
      after: page * rowCount
    })
  }, 510), [query]);

  // Call delayedQuery function when user search and set new warehouse data
  React.useEffect(() => {
    if (query) {
      delayedQuery(page, rowCount);
    } else if (!query) {
      setSKUData(props.sku.data);
      setSKUCount(props.sku.count);
      setSearchLoading(false);
    }
    return delayedQuery.cancel;
  }, [query, delayedQuery]);

  // Set searched values and warehouse count after search
  React.useEffect(() => {
    if (props.searched) {
      setSearched(props.searched.data);
      setSKUCount(props.searched.count);
    }
  }, [props.searched]);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    if (searched) {
      setSearchLoading(false);
      setSKUData(searched);
    }
  }, [searched]);
  
  React.useEffect(() => {
    props.fetchWarehouseSKUs({
      count: page || 10,
      after: page * rowCount
    });
  }, []);

  React.useEffect(() => {
    if (props.sku.count) {
      setSKUData(props.sku.data);
      setSKUCount(props.sku.count);
      setOpenBackdrop(false);
    }
  }, [props.sku])

  return (
    <div className="container sku">
      <div className="flex justify-space-between align-center">
        <Breadcrumbs routes={routes} />
        <div className="button-group">
          <Button variant="contained" className="btn btn--emerald" onClick={handleCreateSKU} disableElevation>Create SKU</Button>
          <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginLeft: 10 }} onClick={() => {}}>Download CSV</Button>
        </div>
      </div>
      <Grid container spacing={2}
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
        <Grid item xs={12} md={3}>
          <WarehouseMasterDataSidebar id={props.match.params.id} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className="paper" elevation={0} variant="outlined">
            <Typography variant="subtitle1" className="paper__heading">SKU's</Typography>
            <div className="paper__divider"></div>
            {/* IF THERE IS EXISTING SKU */}
            <Table 
              filterSize={1}
              config={config}
              data={SKUData}
              total={SKUCount}
              handleRowCount={handleRowCount}
              onPaginate={handlePagination}
              onRowClick={handleRowClick}
              onInputChange={onInputChange}
              query={query}
              searchLoading={searchLoading}
            />
            {/* ELSE SHOW CREATE SKU IMAGE */}
            
          </Paper>
        </Grid>
        <Spinner className={classes.backdrop} open={openBackdrop} >
          <CircularProgress color="inherit" />
        </Spinner>
        {/* {renderDialogCancel()} */}
      </Grid>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    sku: state.sku,
    searched: state.sku.search
  }
}

export default connect(mapStateToProps, { fetchWarehouseSKUs, fetchSKUByName })(WarehouseMasterDataSKU);