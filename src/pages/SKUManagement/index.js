import './style.scss';
import _ from 'lodash';
import { CSVLink } from "react-csv";
import history from 'config/history';
import React, { useEffect, useState } from 'react';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { fetchSKUByName, fetchAllWarehouseSKUs, fetchWarehouseSKUs, tagSKU, fetchWarehouseClients, fetchClientSKU } from 'actions';

import Table from 'components/Table';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Spinner from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import Breadcrumbs from 'components/Breadcrumbs';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import MenuList from "@mui/material/MenuList";
import TextField from '@mui/material/TextField';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function WarehouseMasterDataSKU (props) {
  const dispatch = useDispatch();
  const csvLink = React.useRef();
  const [page, setPage]= React.useState(10);
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [csvData, setCsvData] = React.useState([]);
  const [rowCount, setRowCount] = React.useState(0);
  const [SKUCount, setSKUCount] = React.useState(0);
  const [SKUData, setSKUData] = React.useState(null);
  const [searched, setSearched] = React.useState(null);
  const [openBackdrop, setOpenBackdrop] = React.useState(true);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchedItem, setSearchedItem] = useState(null);
  const [isChecked, setIsChecked] = React.useState([]);
  const [hideDuration, setHideDuration] = useState(5000);
  const [openClientTagging, setOpenClientTagging] = React.useState(false);
  const [taggedSKU, setTaggedSKU] = React.useState(null);
  const [clients, setClients] = useState([]);
  const [itemQuery, setItemQuery] = useState('');
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [items, setItems] = useState([]);
  const [initialSKUs, setInitialSKUs] = useState([]);
  const [initialSKUClients, setInitialSKUClients] = useState([]);
  const [removedClients, setRemovedClients] = useState([]);
  const [alertConfig, setAlertConfig] = React.useState({ severity: 'info', message: 'loading...' });
  const isAllSelected = isChecked.length > 0 && isChecked.length === clients.length;

  // Routes for breadcrumbs
  const routes = [
    {
      label: 'SKU Management',
      path: '/sku-management'
    }
  ];

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
      { label: '', key: 'item_id' },
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
      setOpenBackdrop(true);
      props.fetchWarehouseSKUs({
        count: rowsPerPage,
        after: page * rowsPerPage
      });
      setTimeout(function() {
        props.fetchWarehouseClients();
        setOpenBackdrop(false);
      }, 300);
    }
  };

  // Redirect to selected warehouse
  const handleRowClick = row => {
    history.push({
      pathname: `/sku-management/${row.item_id}`,
      data: row
    });
  }

  // Redirect to sku create
  const handleCreateSKU = () => {
    history.push(`/sku-management/create`);
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
          productName: sku.product_name,
          UOMDescription: sku.uom_description,
          itemCode: sku.item_code,
          externalCode: sku.external_code,
          valuePerUnit: sku.value_per_unit,
          length: sku.length,
          width: sku.width,
          height: sku.height,
          weight: sku.weight,
          storageType: sku.storage_type,
          batchManagement: sku.batch_management ? 'Available' : 'Not Available',
          expiryManagement: sku.expiry_management ? 'Available' : 'Not Available',
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
    { label: "Product Name", key: "productName" },
    { label: "UOM", key: "UOMDescription" },
    { label: "Code", key: "itemCode" },
    { label: "External Code", key: "externalCode" },
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

  // Call delayedQuery function when user search and set new sku data
  useEffect(() => {
    if (query) {
      delayedQuery(page, rowCount);
    } else if (!query) {
      setSKUData(initialSKUs);
      if (props.sku.count !== undefined) setSKUCount(props.sku.count);
      setSearchLoading(false);
    }
    return delayedQuery.cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [query, delayedQuery]);

  // Set searched values and sku count after search
  useEffect(() => {
    if (props.searched) {
      setSearched(props.searched.data);
      if (props.searched.count !== undefined) setSKUCount(props.searched.count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.searched]);

  // Set new warehouse data with searched items
  useEffect(() => {
    if (searched) {
      setSearchLoading(false);
      setSKUData(searched);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [searched]);

  // Set data for sku and count on mount
  useEffect(() => {
    if (props.sku.count) {
      setSKUData(props.sku.data);
      setInitialSKUs(props.sku.data);
      if (props.sku.count !== undefined) setSKUCount(props.sku.count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.sku.count, props.sku.data]);

  // Close spinner if api request for SKU is complete
  useEffect(() => { 
    if (JSON.stringify(SKUData) === '{}') setOpenBackdrop(false);
    if (typeof SKUData === "object") setOpenBackdrop(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [SKUData]);
  
  // Show snackbar alert when new warehouse is created
  useEffect(() => {
    if (props.location.success) {
      setOpenSnackBar(true);
      setAlertConfig({ severity: 'success', message: 'Successfuly saved' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.location.success]);

  // Show snackbar alert when new warehouse is created
  useEffect(() => {
    if (props.clients) {
      if (!clients.length) {
        setClients(Object.values(props.clients.data));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.clients]);

  // Fetch warehouse sku on component mount
  useEffect(() => {
    props.fetchWarehouseSKUs({
      count: page || 10,
      after: page * rowCount
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  // Set query state on input change
  const handleItemSearch = (e) => {
    setSearchedItem(null);
    setItemQuery(e.target.value);
  }

  const checkAll = () => {
    if (isAllSelected) {
      setItems([]);
      setIsChecked([]);
    } else {
      setIsChecked(clients.map(client => client.id));
    }
  }

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenClientTagging(false);
    }
  }

  const toggleCheckboxValue = (item, bool) => {
    if (!isChecked.includes(item.id)) {
      setIsChecked(oldArray => [...oldArray, item.id]);
    } else {
      setIsChecked(isChecked.filter(check => check !== item.id));
    }

    if (bool) {
      setItems(items.filter(sku => sku.id !== item.id));
    } else {
      setItems(oldArray => [...oldArray, item]);
    }
  }

  React.useEffect(() => {
    if (isChecked) {
      let removedItems = [];
      initialSKUClients.forEach(id => {
        if (!isChecked.includes(id)) {
          removedItems.push(id)
        }
      });

      setRemovedClients(removedItems)
    }
  }, [isChecked]);

  const handleTagSKU = () => {
    setOpenSnackBar(false);
    setAlertConfig({ severity: 'info', message: 'Saving changes...' });
    setOpenSnackBar(true);
    setOpenBackdrop(true);
    
    tagSKU(isChecked, [taggedSKU.item_id], [], removedClients).then(res => {
      let delayInMilliseconds = 800;
      setTimeout(function() {
        props.fetchClientSKU();
        setOpenClientTagging(false);
        setOpenSnackBar(true);
        setAlertConfig({ severity: 'success', message: 'Successfuly saved' });
        setOpenBackdrop(false);
      }, delayInMilliseconds);
    });
  }

  useEffect(() => {
    if (props.skuClients) {
      getSKUClients();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.skuClients]);

  const getSKUClients = () => {
    let checked = [];

    props.skuClients.forEach(client => {
      if (client.isactive) {
        checked.push(client.client_id)
      }
    });
    if (!initialSKUClients.length) setInitialSKUClients(checked)
    setIsChecked(checked);
  }

  const handleTagClient = (data) => {
    setTaggedSKU(SKUData[data]);
    props.fetchClientSKU({sku_id: data});
  }

  const handleOpenClientTagging = (bool) => {
    setOpenClientTagging(bool)
  }

  const handleClose = () => {
    setIsChecked([]);
    setInitialSKUClients([]);
    setOpenClientTagging(false);
  }

  // Render empty sku container
  const renderEmptySKU = () => {
    setTimeout(() => { setReady(true) }, 10);
    
    return !ready ? <React.Fragment><div style={{height: '67vh'}} /></React.Fragment> :
      <React.Fragment>
        <div className="sku-empty-container">
          <img src="../../assets/images/sku-empty.svg" style={{height: 150}} alt="" />
          <Typography variant="subtitle2">There's no SKU's listed here.</Typography>
          <Typography variant="subtitle2">Please click the create button to get started.</Typography>
          <Button variant="contained" className="btn btn--emerald" onClick={handleCreateSKU} disableElevation>Create SKU</Button>
        </div>
      </React.Fragment>
  }

  const tagSKUDialog = () => {
    return (
      <Dialog
        open={openClientTagging}
        fullWidth
        keepMounted
        m={2}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        className="tag-sku-dialog tag-client-dialog"
      >
        <DialogTitle>
          <div className="flex justify-space-between align-center receiving-title">
            <Typography sx={{paddingLeft: 0.5}}>Tag SKU to {'test'}</Typography>
          </div>
        </DialogTitle>
        <TextField
          className="sku-search-items tag-sku"
          variant="outlined"
          type="text" 
          value={itemQuery}
          required
          fullWidth
          placeholder="Search"
          onChange={handleItemSearch}
        />
        <DialogContent>
          <MenuList id="menu-list-grow" onKeyDown={handleListKeyDown}>
            {clients.length ?
              <MenuItem value="all" onClick={checkAll}>
                <Checkbox checked={isAllSelected}/>
                <ListItemText primary="Select All"/>
              </MenuItem> : null
            }
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.client_name} onClick={() => toggleCheckboxValue(client, isChecked.includes(client.id))} >
                <Checkbox checked={isChecked.includes(client.id)} />
                <ListItemText primary={client.client_name} />
              </MenuItem>
            ))}
          </MenuList>
        </DialogContent>
        <hr />
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={handleTagSKU}>Save</Button>
        </DialogActions>
      </Dialog>
    )
  }

  const renderTable = () => {
    return !ready ? <React.Fragment><div style={{height: '67vh'}} /></React.Fragment> :
      <React.Fragment>
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
          handleTagClient={handleTagClient}
          handleOpenClientTagging={handleOpenClientTagging}
          handleClose={handleClose}
        />
      </React.Fragment>
  }

  return (
    <div className="container sku">
      <div className="flex justify-space-between align-center">
        <Breadcrumbs routes={routes} />
        <div className="button-group">
          <Button variant="contained" className="btn btn--emerald" onClick={handleCreateSKU} disableElevation>Create SKU</Button>
          <CSVLink data={csvData} filename={`wms-sku.csv`} headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
          <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginLeft: 10 }} onClick={handleDownloadCSV}>Download CSV</Button>
        </div>
      </div>
      <Grid container spacing={2}
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
        <Grid item xs={12} md={12}>
          { _.isEmpty(SKUData) && !props.searched ? renderEmptySKU() : renderTable() }
        </Grid>
        <Spinner sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }} open={openBackdrop} >
          <CircularProgress color="inherit" />
        </Spinner>
        <Snackbar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1000 }} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={openSnackBar} autoHideDuration={hideDuration} onClose={() => setOpenSnackBar(false)}>
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
      </Grid>
      {tagSKUDialog()}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    sku: state.sku,
    searched: state.sku.search,
    clients: state.client,
    skuClients: state.client.sku
  }
}

export default connect(mapStateToProps, { fetchWarehouseSKUs, fetchSKUByName, fetchWarehouseClients, fetchClientSKU })(WarehouseMasterDataSKU);