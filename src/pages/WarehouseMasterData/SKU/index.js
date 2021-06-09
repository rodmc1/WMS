import React, { useEffect } from 'react';
import './style.scss';
import _ from 'lodash';
import { fetchSKUByName, fetchWarehouseByName, fetchAllWarehouseSKUs, fetchWarehouseSKUs } from 'actions';
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
import { CSVLink } from "react-csv";
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function WarehouseMasterDataSKU (props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const [rowCount, setRowCount] = React.useState(0);
  const [page, setPage]= React.useState(10);
  const [SKUData, setSKUData] = React.useState(null);
  const [SKUCount, setSKUCount] = React.useState(0);
  const [searched, setSearched] = React.useState(null);
  const dispatch = useDispatch();
  const [csvData, setCsvData] = React.useState([]);
  const csvLink = React.useRef();

  // Routes for breadcrumbs
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

  console.log(SKUData)

  // Config for table
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

  // Set new Row and Page count
  const handleRowCount = (page, rowsPerPage) => {
    setRowCount(rowsPerPage);
    setPage(page);
  };


  // Function for pagination
  const handlePagination = (page, rowsPerPage) => {
    if (query) {
      delayedQuery(page, rowsPerPage);
    } else {
      props.fetchWarehouseSKUs({
        warehouse_name: props.match.params.id,
        count: rowsPerPage,
        after: page * rowsPerPage
      });
    }
  };

  // Redirect to selected warehouse
  const handleRowClick = row => {
    history.push({
      pathname: `/warehouse-master-data/${props.match.params.id}/sku/${row.item_id}`,
      data: row
    });
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
      warehouse_name: props.match.params.id,
      filter: query,
      count: rowCount,
      after: page * rowCount
    })
  }, 510), [query]);

  // Function for CSV Download  
  const handleDownloadCSV = async () => {
    await fetchAllWarehouseSKUs({ warehouse_name: props.match.params.id }).then(response => {
      const newData = response.data.map(sku => {
        return {
          warehouseName: sku.warehouse_name,
          UOMDescription: sku.uom_description,
          itemCode: sku.item_code,
          externalCode: sku.external_code,
          minQty: sku.min_qty,
          maxQty: sku.max_qty,
          valuePerUnit: sku.value_per_unit,
          length: sku.length,
          width: sku.width,
          height: sku.height,
          weight: sku.weight,
          width: sku.item_code,
          storageType: sku.storage_type,
          batchManagement: sku.batch_management,
          expiryManagement: sku.expiry_management,
          remarks: sku.remarks,
        }
      });
      setCsvData(newData);
    }).catch((error) => {
      dispatchError(dispatch, THROW_ERROR, error);
    });

    csvLink.current.link.click();
  }

  // CSV Headers
  const csvHeaders = [  
    { label: "Warehouse Name", key: "warehouseName" },
    { label: "UOM", key: "UOMDescription" },
    { label: "Code", key: "itemCode" },
    { label: "External Code", key: "externalCode" },
    { label: "Min Quantity", key: "minQty" },
    { label: "Max Quantity", key: "maxQty" },
    { label: "Value Per Unit", key: "valuePerUnit" },
    { label: "Length", key: "length" },
    { label: "Width", key: "width" },
    { label: "Height", key: "height" },
    { label: "Weight", key: "weight" },
    { label: "Storage Type", key: "storageType" },
    { label: "Batch Management ", key: "batchManagement" },
    { label: "Expiry Management", key: "expiryManagement" },
    { label: "Remarks", key: "remarks" },
  ];

  // Call delayedQuery function when user search and set new warehouse data
  useEffect(() => {
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
  useEffect(() => {
    if (props.searched) {
      setSearched(props.searched.data);
      setSKUCount(props.searched.count);
    }
  }, [props.searched]);


  // Set new warehouse data with searched items
  useEffect(() => {
    if (searched) {
      setSearchLoading(false);
      setSKUData(searched);
    }
  }, [searched]);

  useEffect(() => {
    if (props.sku.count) {
      setSKUData(props.sku.data);
      setSKUCount(props.sku.count);
    }
    if (props.sku.data) {
      setOpenBackdrop(false);
    }
  }, [props.sku]);

  useEffect(() => {
    if (Array.isArray(SKUData)) setOpenBackdrop(false);
  }, [SKUData]);

  // if (Array.isArray(SKUData)) setOpenBackdrop(false);

  // Show snackbar alert when new warehouse is created
  useEffect(() => {
    if (props.location.success) {
      setOpen(true);
    }
  }, [props.location.success]);
  

  return (
    <div className="container sku">
      <div className="flex justify-space-between align-center">
        <Breadcrumbs routes={routes} />
        { 
          // !_.isEmpty(SKUData) && 
          <div className="button-group">
            <Button variant="contained" className="btn btn--emerald" onClick={handleCreateSKU} disableElevation>Create SKU</Button>
            <CSVLink data={csvData} filename={`${props.match.params.id}-sku.csv`} headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
            <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginLeft: 10 }} onClick={handleDownloadCSV}>Download CSV</Button>
          </div>
        }
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
            {/* { !_.isEmpty(SKUData) &&  */}
              <React.Fragment>
                <Typography variant="subtitle1" className="paper__heading">SKU's</Typography>
                <div className="paper__divider" />
                <Table 
                  filterSize={1}
                  config={config}
                  data={SKUData}
                  total={SKUCount || 0}
                  handleRowCount={handleRowCount}
                  onPaginate={handlePagination}
                  onRowClick={handleRowClick}
                  onInputChange={onInputChange}
                  query={query}
                  searchLoading={searchLoading}
                />
              </React.Fragment>
            {/* } */}
          </Paper>
        </Grid>
        <Spinner className={classes.backdrop} open={openBackdrop} >
          <CircularProgress color="inherit" />
        </Spinner>
        <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
          <Alert severity="success">{props.location.success}</Alert>
        </Snackbar>
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