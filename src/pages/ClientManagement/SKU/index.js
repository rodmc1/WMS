/* eslint-disable react/prop-types */
import './style.scss';
import _ from 'lodash';
import React, {  useState, useRef } from 'react';
import { CSVLink } from "react-csv";
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { removeTaggedSKU, createDeliveryNoticeSKU, tagSKU, fetchWarehouseClient, fetchDeliveryNoticeById, fetchDeliveryNoticeByName, searchDeliveryNoticeSKU, searchWarehouseSKUByName, fetchClientSKU, fetchAllWarehouseSKUs } from 'actions';
import ClientSideBar from 'components/ClientManagement/Sidebar';
import Breadcrumbs from 'components/Breadcrumbs';

import Table from './table';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';

import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import Spinner from '@mui/material/Backdrop';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from "@mui/material/MenuList";
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import Badge from '@mui/material/Badge';
import Collapse from '@mui/material/Collapse';
import { DropzoneArea } from 'material-ui-dropzone';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Search from '@mui/icons-material/Search';
import { csv } from 'd3';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function DeliveryNoticeSKU(props) {
  const csvLink = useRef();
  const [SKU, setSKU] = useState([]);
  const [deliveryNoticeSKU, setDeliveryNoticeSKU] = useState([]);
  const anchorRef = React.useRef(null);
  const dispatch = useDispatch();
  const [openAddItems, setOpenAddItems] = React.useState(false);
  const [page, setPage]= useState(10);
  const [query, setQuery] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [searched, setSearched] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [skuCount, setSKUCount] = useState(0);
  const [deliveryNoticeData, setDeliveryNoticeData] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [itemQuery, setItemQuery] = useState('');
  const [searchedItem, setSearchedItem] = useState(null);
  const [selectedSKU, setSelectedSKU] = React.useState([]);
  const [isChecked, setIsChecked] = React.useState([]);
  const [items, setItems] = useState([]);
  const [clientSKUs, setClientSKUs] = useState([]);
  const [alertConfig, setAlertConfig] = React.useState({ severity: 'info', message: 'loading...' });
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const isAllSelected = items.length > 0 && items.length === SKU.length;
  const [openSKUTag, setOpenSKUTag] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [initialSKUs, setInitialSKUs] = useState([]);
  const [removedSKUs, setRemovedSKUs] = useState([]);

  const routes = [
    {
      label: 'Client Management',
      path: '/client-management'
    },
    {
      label: props.match.params.id,
      path: `/client-management/${props.match.params.id}/overview`
    },
    {
      label: `SKU`,
      path: `/client-management/${props.match.params.id}/sku`
    }
  ];

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenAddItems(false);
    }
  }

  const toggleCheckboxValue = (item, bool) => {
    if (!isChecked.includes(item.item_id)) {
      setIsChecked(oldArray => [...oldArray, item.item_id]);
    } else {
      setIsChecked(isChecked.filter(check => check !== item.item_id));
    }

    // if (bool) {
    //   setItems(items.filter(sku => sku.item_id !== item.item_id));
    // } else {
    //   setItems(oldArray => [...oldArray, item]);
    // }
  }

  React.useEffect(() => {
    if (isChecked) {
      let removedItems = [];
      let addedItems = [];
      isChecked.forEach(id => {
        if (!initialSKUs.includes(id)) {
          addedItems.push(id)
        }
      });

      initialSKUs.forEach(id => {
        if (!isChecked.includes(id)) {
          removedItems.push(id)
        }
      });
      setRemovedSKUs(removedItems);
      setItems(addedItems);
    }

  },[isChecked])

  const checkAll = () => {
    if (isAllSelected) {
      setItems([]);
      setIsChecked([]);
    } else {
      setIsChecked(SKU.map(sku => sku.item_id));
    }
  }

  // Function for cancel action
  const handleCancel = (data, allData) => {
    const filteredCheck = isChecked.filter(check => check !== data.item_id);
    const filteredItem = items.filter(sku => sku.item_id !== data.item_id);
    setIsChecked(filteredCheck);
    setSelectedSKU(filteredItem);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const handleSearchItems = React.useCallback(_.debounce(() => {
    searchWarehouseSKUByName({
      product: itemQuery,
    }).then(response => {
      setSearchedItem(response.data);
    })
  }, 510), [itemQuery]);
  
  // Call delayedQuery function when user search and set new warehouse data
  React.useEffect(() => {
    if (itemQuery) {
      handleSearchItems()
    } else if (!itemQuery) {
      setSearchedItem(clientSKUs)
    }
    return handleSearchItems.cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [itemQuery]);

  // Set new warehouse data with searched items
  // React.useEffect(() => {
  //   if (searchedItem) {
  //     setSKU(searchedItem);
  //   }
  // }, [searchedItem]);

  const handleAddItems = () => {
    setOpenAddItems(false);
    setSelectedSKU(items);
  }

  const prevOpen = React.useRef(openAddItems);

  React.useEffect(() => {
    if (prevOpen.current === true && openAddItems === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = openAddItems;
  }, [openAddItems]);

  // Table config
  const config = {
    rowsPerPage: 10,
    headers: [
      { label: 'ID', key: 'warehouse_id' },
      { label: 'Preview' },
      { label: 'Product Name', key: 'item_code' },
      { label: 'UOM', key: 'uom' },
      { label: 'Code', key: 'item_code' },
      { label: 'External Code', key: 'external_code' },
      { label: ' ' },
    ]
  }

  // Function for getting page and row count on table
  const handleRowCount = (page, rowsPerPage) => {
    setRowCount(rowsPerPage);
    setPage(page);
  };

  // Set query state on input change
  const handleItemSearch = (e) => {
    setSearchedItem(null);
    setItemQuery(e.target.value);
  }

  // Set query state on input change
  const onInputChange = (e) => {
    setSearched(null);
    setQuery(e.target.value);
  }

  // Function for pagination and search
  const handlePagination = (page, rowsPerPage) => {
    if (query) {
      delayedQuery(page, rowsPerPage);
    } else {
      if (deliveryNoticeData) {
        // let params = {
        //   delivery_notice_id: deliveryNoticeData.delivery_notice_id,
        //   count: rowsPerPage,
        //   after: page * rowsPerPage
        // }
        // if (!params.after) params = { delivery_notice_id: deliveryNoticeData.delivery_notice_id }
        // props.fetchDeliveryNoticeSKU(params);
      }
    }
  };

  // Fetch new data if search values was erased
  React.useEffect(() => {
    if (!query) {
      setSearchLoading(true);
      props.fetchClientSKU({client: props.match.params.id})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [query]);

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const delayedQuery = React.useCallback(_.debounce((page, rowCount) => {
    setSearchLoading(true);
    searchActiveSKU(query)
  }, 800), [query]);

  const searchActiveSKU = (query) => {
    let searchedItems = [];
    tableData.forEach(data => {
      if (data.product_name.includes(query)) {
        searchedItems.push(data);
      }
    });
    if (searchedItems) {
      setSearched(searchedItems);
    }
  }

    // Set new warehouse data with searched items
    // React.useEffect(() => {
    //   if (searched) {
    //     setSearchLoading(false);
    //     setClientData(searched);
    //   }
    // }, [searched]);
  /**
   * Function for CSV Download
   */ 
  const handleDownloadCSV = () => {
    const newData = tableData.map(skuData => {
      return {
        product_name: skuData.product_name,
        uom: skuData.uom_description,
        code: skuData.item_code,
        external_code: skuData.external_code,
        storage_type: skuData.storage_type,
      }
    });
    
    setCsvData(newData);

    setTimeout(function() {
      csvLink.current.link.click();
    }, 500);
  }

  // CSV Headers
  const csvHeaders = [  
    { label: "Product Name", key: "product_name" },
    { label: "UOM", key: "uom" },
    { label: "Code", key: "code" },
    { label: "External Code", key: "external_code" },
    { label: "Storage Type", key: "storage_type" }
  ];

  const handleTagSKU = () => {
    setOpenSnackBar(false);
    setAlertConfig({ severity: 'info', message: 'Saving changes...' });
    setOpenSnackBar(true);

    tagSKU(clientData.id, items, removedSKUs);
    var delayInMilliseconds = 1200;

    setTimeout(function() {
      props.fetchClientSKU({client: props.match.params.id})
      setAlertConfig({ severity: 'success', message: 'Successfuly saved' });
      setOpenSKUTag(false);
    }, delayInMilliseconds);
  }

  const handleRemoveSKU = (data) => {
    const removeId = data.item_id;
    const delayInMilliseconds = 500;
    setOpenSnackBar(false);
    setAlertConfig({ severity: 'info', message: 'Removing SKU...' });
    setOpenSnackBar(true);

    removeTaggedSKU(clientData.id, removeId)
      .then(response => {
        if (response.status === 201) {
          props.fetchClientSKU({client: props.match.params.id});
          setTimeout(function() {
            setAlertConfig({ severity: 'success', message: 'Successfuly saved' });
          }, delayInMilliseconds);
        }
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }
  
  const handleClose = () => {
    setOpenSKUTag(false);
  }

  const tagSKUDialog = () => {
    return (
      <Dialog
        open={openSKUTag}
        fullWidth
        keepMounted
        m={2}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        className="tag-sku-dialog"
      >
        <DialogTitle>
          <div className="flex justify-space-between align-center receiving-title">
            <Typography sx={{paddingLeft: 0.5}}>Tag SKU to {clientData.client_name}</Typography>
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
          <MenuList autoFocusItem={openAddItems} id="menu-list-grow" onKeyDown={handleListKeyDown}>
            {SKU.length ?
              <MenuItem value="all" onClick={checkAll}>
                <Checkbox 
                  checked={isAllSelected}
                />
                <ListItemText primary="Select All"/>
              </MenuItem> : null
            }
            {SKU.map((item) => (
              <MenuItem key={item.item_id} value={item.product_name} onClick={() => toggleCheckboxValue(item, isChecked.includes(item.item_id))} >
                <Checkbox checked={isChecked.includes(item.item_id)} />
                <ListItemText primary={item.product_name} />
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

  /**
   * Submit function for creating delivery notice
   * 
   * @param {object} data Set of new delivery notice data
   */
  const handleSubmit = data => {
    setOpenSnackBar(false);
    setAlertConfig({ severity: 'info', message: 'Adding SKU...' });
    setOpenSnackBar(true);

    const SKUData = {
      delivery_notice_id: Number(deliveryNoticeData.delivery_notice_id),
      code: data.code,
      expected_qty: Number(data.expectedQty),
      external_material_coding: data.externalCode,
      external_material_description: data.productName,
      notes: data.notes,
      item_id: data.id
    }
    
    //Invoke action for adding delivery notice SKU
    createDeliveryNoticeSKU(SKUData)
      .then(response => {
        if (response.status === 201) {
          setAlertConfig({ severity: 'success', message: 'Successfuly saved' });
          setIsChecked(isChecked.filter(check => check !== data.id));
          setSelectedSKU(items.filter(sku => sku.item_id !== data.id));
        }
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }

  /**
   * Invoke alert with error message
   */
  const handleErrors = () => {
    setOpenSnackBar(true);
    setAlertConfig({ severity: 'error', message: 'Invalid SKU Value' });
  }

  /**
   * Call delayedQuery function when user search and set new sku data
   */
  React.useEffect(() => {
    if (query) {
      delayedQuery(page, rowCount);
    } else if (!query) {
      setDeliveryNoticeData(props.notice);
      setSearchLoading(false);
    }
    return delayedQuery.cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [query, delayedQuery, page, rowCount]);

  /**
   * Set delivery notice data
   */
  React.useEffect(() => {
    if (props.notice) {
      setDeliveryNoticeData(props.notice);
    } else {
      props.fetchDeliveryNoticeById(props.match.params.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.notice]);

  React.useEffect(() => { 
    if (JSON.stringify(deliveryNoticeData) === '{}') {
      setOpenBackdrop(false);
    }
  }, [deliveryNoticeData]);

  // Set searched values and warehouse count after search
  React.useEffect(() => {
    if (props.searched) {
      setSearched(props.searched.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.searched]);

  // Set delivery notice count and remove spinner when data fetch is done
  React.useEffect(() => {
    if (props.notice) {
      setOpenBackdrop(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.notice]);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    if (searched) {
      setSearchLoading(false);
      setTableData(searched);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [searched]);

  React.useEffect(() => {
    if (props.client && !SKU.length) {
      if (!itemQuery) {
        props.fetchClientSKU({client: props.match.params.id})
        fetchAllWarehouseSKUs()
        .then(response => {
          setSKU(response.data);
        })
        .catch(error => {
          dispatchError(dispatch, THROW_ERROR, error);
        });
      }
    }
    if (props.client_sku) setSKUCount(initialSKUs.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.client, props.client_sku]);

  React.useEffect(() => {
    if (deliveryNoticeData) {
      setOpenBackdrop(true)
      props.fetchDeliveryNoticeSKU({delivery_notice_id: deliveryNoticeData.delivery_notice_id});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [deliveryNoticeData]);

  React.useEffect(() => {
    if (selectedSKU.length) setDeliveryNoticeSKU([]);
    if (!selectedSKU.length && deliveryNoticeData) {
      // props.fetchDeliveryNoticeSKU({delivery_notice_id: deliveryNoticeData.delivery_notice_id});
      setOpenBackdrop(true)
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [selectedSKU]);

  React.useEffect(() => {
    if (props.sku) {
      setDeliveryNoticeSKU(props.sku.data);
      setOpenBackdrop(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.sku]);
  

  React.useEffect(() => {
    if (props.client_sku) {
      setClientSKUs(props.client_sku);
    }
    if (!props.client) {
      props.fetchClientSKU({client: props.match.params.id})
    }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.client_sku]);

  React.useEffect(() => {
    props.fetchClientSKU({client: props.match.params.id})
    fetchAllWarehouseSKUs()
      .then(response => {
        setSKU(response.data);
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const getTaggedSKU = () => {
    let checked = [];
    let clientSKU = [];

    clientSKUs.forEach(sku => {
      if (sku.isactive) {
        checked.push(sku.item_id)
      }
    });

    SKU.forEach(sku => {
      if (checked.includes(sku.item_id)) {
        clientSKU.push(sku)
      }
    });
    
    setSKUCount(clientSKU.length)
    setTableData(clientSKU);
    setIsChecked(checked);
    setInitialSKUs(checked);
  }

  React.useEffect(() => {
    if (SKU.length) {
      setSelectedSKU(SKU.filter(sku => sku.isadded === true));
      setOpenSnackBar(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [SKU]);

  React.useEffect(() => {
    if (clientSKUs.length) {
      getTaggedSKU();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [clientSKUs]);

  // Fetch warehouse by selected warehouse id and set warehouse data
  React.useEffect(() => {
    const id = props.match.params.id;
    if (!props.client) {
      props.fetchWarehouseClient({filter: id});
    } else {
      setClientData(props.client);
    }
  }, [props.client]);

  // Fetch warehouse by selected warehouse id and set warehouse data
  React.useEffect(() => {
    const id = props.match.params.id;
    props.fetchWarehouseClient({filter: id});
  }, []);

  /**
   * Handler api errors
   */
   const handleError = () => {
    if (props.error.status === 401) {
      setAlertConfig({ severity: 'error', message: 'Session Expired, please login again...' });
    } else if (props.error.status === 500) {
      setAlertConfig({ severity: 'error', message: 'Internal Server Error' });
    } else {
      setAlertConfig({ severity: 'error', message: props.error.data.type +': '+ props.error.data.message });
    }
  }

  /**
   * Handle errors
   */
   React.useEffect(() => {
    if (!_.isEmpty(props.error)) {
      setOpenSnackBar(true);
      // if (props.error === 'Network Error') {
      //   setAlertConfig({ severity: 'error', message: 'Network Error, please try again...' });
      // } else {
      //   handleError();
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.error]);

  return (
    <div className="container delivery-notice-container dn-sku">
      <div className="flex justify-space-between align-center">
        <Breadcrumbs routes={routes} />
        <div className="button-group">
          <CSVLink data={csvData} filename="client-sku.csv" headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
          <Button ref={anchorRef} aria-haspopup="true" variant="contained" onClick={() => setOpenSKUTag(true)} className="btn btn--emerald" disableElevation>Tag SKU</Button>
          <Button variant="contained" className="btn btn--emerald btn-csv" disableElevation onClick={handleDownloadCSV}>Download CSV</Button>
        </div>
      </div>
      <Grid container spacing={2} direction="row" justify="space-evenly" alignItems="stretch">
        <Grid item xs={12} md={3}>
          <ClientSideBar id={props.match.params.id} deleteId={deliveryNoticeData && deliveryNoticeData.delivery_notice_id} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Table 
            config={config}
            data={tableData}
            defaultData={deliveryNoticeSKU}
            handleRowCount={handleRowCount}
            onPaginate={handlePagination}
            query={query}
            searchLoading={searchLoading}
            onInputChange={onInputChange}
            handleCancel={handleCancel}
            onSubmit={handleSubmit}
            onError={handleErrors}
            total={skuCount || 0}
            handleRemoveSKU={handleRemoveSKU}
          />
          <Spinner sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop}>
            <CircularProgress color="inherit" />
          </Spinner>
          <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={openSnackBar} autoHideDuration={3000} onClose={() => setOpenSnackBar(false)}>
            <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
          </Snackbar>
        </Grid>
      </Grid>
      {tagSKUDialog()}
    </div>
  )
}

/**
 * Redux states to component props
 */
const mapStateToProps = (state, ownProps) => {
  return { 
    error: state.error,
    searched: state.notice.searchedSKU,
    notice: state.notice.data[ownProps.match.params.id],
    sku: state.notice.sku,
    client_sku: state.client.sku,
    client: state.client.data[ownProps.match.params.id]
  }
};

export default connect(mapStateToProps, {fetchDeliveryNoticeByName, searchDeliveryNoticeSKU, fetchDeliveryNoticeById, fetchClientSKU, fetchWarehouseClient })(DeliveryNoticeSKU);