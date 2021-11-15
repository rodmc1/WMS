/* eslint-disable react/prop-types */
import './style.scss';
import _ from 'lodash';
import React, {  useState, useRef } from 'react';
import { CSVLink } from "react-csv";
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { createDeliveryNoticeSKU, fetchDeliveryNotices, fetchAllDeliveryNoticeSKU, fetchDeliveryNoticeByName, fetchDeliveryNoticeSKU, searchDeliveryNoticeSKU, fetchAllWarehouseSKUs, searchWarehouseSKUByName } from 'actions';
import WarehouseSideBar from 'components/WarehouseDeliveryNotice/SideBar';
import Breadcrumbs from 'components/Breadcrumbs';

import Table from './table';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';

import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import Spinner from '@mui/material/Backdrop';
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

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
  const [warehouseSKUs, setwarehouseSKUs] = useState([]);
  const [alertConfig, setAlertConfig] = React.useState({ severity: 'info', message: 'loading...' });
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const isAllSelected = items.length > 0 && items.length === SKU.length;

  const routes = [
    {
      label: 'Delivery Notice',
      path: '/delivery-notice'
    },
    {
      label: props.match.params.id,
      path: `/delivery-notice/${props.match.params.id}/overview`
    },
    {
      label: `SKU`,
      path: `/delivery-notice/${props.match.params.id}/sku`
    }
  ];

  const handleToggle = () => {
    setOpenAddItems((prevOpen) => !prevOpen);
  };

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

    if (bool) {
      setItems(items.filter(sku => sku.item_id !== item.item_id));
    } else {
      setItems(oldArray => [...oldArray, item]);
    }
  }
  
  const checkAll = () => {
    if (isAllSelected) {
      setItems([]);
      setIsChecked([]);
    } else {
      setIsChecked(SKU.map(sku => sku.item_id));
      setItems(SKU.map(sku => sku));
    }
  }

  // Function for cancel action
  const handleCancel = (data, allData) => {
    const filteredCheck = isChecked.filter(check => check !== data.item_id);
    const filteredItem = items.filter(sku => sku.item_id !== data.item_id);
    setIsChecked(filteredCheck);
    setSelectedSKU(filteredItem);
    setItems(filteredItem);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const handleSearchItems = React.useCallback(_.debounce(() => {
    searchWarehouseSKUByName({
      warehouse_name: deliveryNoticeData.warehouse_name,
      filter: itemQuery,
    }).then(response => {
      setSearchedItem(response.data);
    })
  }, 510), [itemQuery]);
  
  // Call delayedQuery function when user search and set new warehouse data
  React.useEffect(() => {
    if (itemQuery) {
      handleSearchItems()
    } else if (!itemQuery) {
      setSearchedItem(warehouseSKUs)
    }
    return handleSearchItems.cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [itemQuery]);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    if (searchedItem) {
      setSKU(searchedItem);
    }
  }, [searchedItem]);

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
      { label: 'SKU Code', key: 'item_code' },
      { label: 'External Material Coding', key: 'external_code' },
      { label: 'External Material Description', key: 'external_reference_number' },
      { label: 'UOM', key: 'warehouse_client' },
      { label: 'Expected Quantity'},
      { label: 'Notes' },
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
        let params = {
          delivery_notice_id: deliveryNoticeData.delivery_notice_id,
          count: rowsPerPage,
          after: page * rowsPerPage
        }
        if (!params.after) params = { delivery_notice_id: deliveryNoticeData.delivery_notice_id }
        props.fetchDeliveryNoticeSKU(params);
      }
    }
  };

  // Fetch new data if search values was erased
  React.useEffect(() => {
    if (!query) {
      setSearchLoading(true);
      props.fetchDeliveryNotices({
        count: page || 10,
        after: page * rowCount
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [query]);

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const delayedQuery = React.useCallback(_.debounce((page, rowCount) => {
    setSearchLoading(true);
    props.searchDeliveryNoticeSKU({
      delivery_notice_id: deliveryNoticeData.delivery_notice_id,
      filter: query,
      count: rowCount,
      after: page * rowCount
    })
  }, 510), [query]);
  
  /**
   * Function for CSV Download
   */ 
  const handleDownloadCSV = async () => {
    await fetchAllDeliveryNoticeSKU(deliveryNoticeData.delivery_notice_id).then(response => {
      const newData = response.data.map(data => {
        return {
          item_code: data.item_code,
          external_material_coding: data.external_material_coding,
          external_material_description: data.external_material_description,
          uom: data.uom,
          expected_qty: data.expected_qty,
          notes: data.notes,
        }
      });

      setCsvData(newData);
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });

    csvLink.current.link.click();
  }

  // CSV Headers
  const csvHeaders = [  
    { label: "SKU Code", key: "item_code" },
    { label: "External Material Coding", key: "external_material_coding" },
    { label: "External Material Description", key: "external_material_description" },
    { label: "UOM", key: "uom" },
    { label: "Expected Quantity", key: "expected_qty" },
    { label: "Notes", key: "notes" }
  ];

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
      notes: data.notes
    }
    
    //Invoke action for adding delivery notice SKU
    createDeliveryNoticeSKU(SKUData)
      .then(response => {
        if (response.status === 201) {
          setAlertConfig({ severity: 'success', message: 'Successfuly saved' });
          setIsChecked(isChecked.filter(check => check !== data.id));
          setSelectedSKU(items.filter(sku => sku.item_id !== data.id));
          setItems(items.filter(sku => sku.item_id !== data.id));
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
      setDeliveryNoticeSKU(searched);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [searched]);

  React.useEffect(() => {
    if (props.notice && !SKU.length) {
      if (!itemQuery) {
        fetchAllWarehouseSKUs({ warehouse_name: props.notice.warehouse_name })
        .then(response => {
          setSKU(response.data);
          setwarehouseSKUs(response.data);
        })
        .catch(error => {
          dispatchError(dispatch, THROW_ERROR, error);
        });
      }
    }
    if (props.sku) setSKUCount(props.sku.count);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.sku]);

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
      props.fetchDeliveryNoticeSKU({delivery_notice_id: deliveryNoticeData.delivery_notice_id});
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
    if (props.warehouse) fetchAllWarehouseSKUs({ warehouse_name: props.warehouse.warehouse_name })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.warehouse]);

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
      if (props.error === 'Network Error') {
        setAlertConfig({ severity: 'error', message: 'Network Error, please try again...' });
      } else {
        handleError();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.error]);

  return (
    <div className="container delivery-notice-container sku">
      <div className="flex justify-space-between align-center">
        <Breadcrumbs routes={routes} />
        <div className="button-group">
          <CSVLink data={csvData} filename="delivery_notice.csv" headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
          <Button ref={anchorRef} aria-haspopup="true" onClick={handleToggle} variant="contained" className="btn btn--emerald" disableElevation endIcon={<ArrowDropDownIcon />}>Add Items</Button>
          <Popper
            className="items-popover"
            open={openAddItems}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            placement='bottom-end'
            modifiers={{ offset: { enabled: true, offset: '40, 0' }}}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps} style={{ transformOrigin: "center top" }}>
                <Paper>
                  <TextField
                    className="sku-search-items"
                    variant="outlined"
                    type="text" 
                    value={itemQuery}
                    required
                    fullWidth
                    placeholder="Search"
                    onChange={handleItemSearch}
                    endAdornment={
                      <InputAdornment position="end">
                        <CircularProgress />
                      </InputAdornment>
                    }
                  />
                  <MenuList autoFocusItem={openAddItems} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    {SKU.length ?
                      <MenuItem value="all" onClick={checkAll}>
                        <Checkbox checked={isAllSelected}/>
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
                  <hr />
                  <Button variant="contained" className="btn btn--emerald" onClick={handleAddItems} disableElevation>Done</Button>
                </Paper>
              </Grow>
            )}
          </Popper>
          <Button variant="contained" className="btn btn--emerald btn-csv" disableElevation onClick={handleDownloadCSV}>Download CSV</Button>
        </div>
      </div>
      <Grid container spacing={2} direction="row" justify="space-evenly" alignItems="stretch">
        <Grid item xs={12} md={3}>
          <WarehouseSideBar id={props.match.params.id} deleteId={deliveryNoticeData && deliveryNoticeData.delivery_notice_id} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Table 
            config={config}
            data={selectedSKU}
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
          />
          <Spinner sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop}>
            <CircularProgress color="inherit" />
          </Spinner>
          <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={openSnackBar} autoHideDuration={3000} onClose={() => setOpenSnackBar(false)}>
            <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
          </Snackbar>
        </Grid>
      </Grid>
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
    sku: state.notice.sku
  }
};

export default connect(mapStateToProps, { fetchDeliveryNotices, fetchDeliveryNoticeByName, fetchDeliveryNoticeSKU, searchDeliveryNoticeSKU })(DeliveryNoticeSKU);