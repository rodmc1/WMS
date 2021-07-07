/* eslint-disable react/prop-types */
import './style.scss';
import _ from 'lodash';
import history from 'config/history';
import React, { useEffect, useState, useRef } from 'react';
import { CSVLink } from "react-csv";
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { createDeliveryNoticeSKU, fetchDeliveryNotices, fetchAllDeliveryNoticeSKU, fetchDeliveryNoticeByName, fetchDeliveryNoticeSKU, searchDeliveryNoticeSKU, fetchAllWarehouseSKUs, searchWarehouseSKUByName } from 'actions';
import WarehouseSideBar from 'components/WarehouseDeliveryNotice/SideBar';
import { Controller, useForm } from 'react-hook-form';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import Table from './table';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Breadcrumbs from 'components/Breadcrumbs';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import WarehouseDialog from 'components/WarehouseDialog';
import Spinner from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import SKU from 'pages/WarehouseMasterData/SKU';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function DeliveryNoticeSKU(props) {
  const csvLink = useRef();
  const [SKU, setSKU] = useState([]);
  const [deliveryNoticeSKU, setDeliveryNoticeSKU] = useState([]);
  const anchorRef = React.useRef(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openAddItems, setOpenAddItems] = React.useState(false);
  const [page, setPage]= useState(10);
  const [query, setQuery] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [searched, setSearched] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [skuCount, seSKUCount] = useState(0);
  const [deliveryNoticeData, setDeliveryNoticeData] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchItemsLoading, setSearchItemsLoading] = useState(false);
  const [itemQuery, setItemQuery] = useState('');
  const [searchedItem, setSearchedItem] = useState(null);
  const [selectedSKU, setSelectedSKU] = React.useState([]);
  const [isChecked, setIsChecked] = React.useState([]);
  const [items, setItems] = useState([]);
  const [warehouseSKUs, setwarehouseSKUs] = useState([]);
  const [alertConfig, setAlertConfig] = React.useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [status, setStatus] = React.useState({ sku: false });

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

  // Function for cancel action
  const handleCancel = (data) => {
    setIsChecked(isChecked.filter(check => check !== data.item_id));
    setSelectedSKU(items.filter(sku => sku.item_id !== data.item_id));
    setItems(items.filter(sku => sku.item_id !== data.item_id));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const handleSearchItems = React.useCallback(_.debounce(() => {
    setSearchItemsLoading(true);
    searchWarehouseSKUByName({
      warehouse_name: deliveryNoticeData.warehouse_name,
      filter: itemQuery,
    }).then(response => {
      setSearchedItem(response.data);
    })
  }, 510), [itemQuery]);

  // Set searched values and warehouse count after search
  // React.useEffect(() => {
  //   if (searchedItem) {
  //     setSearched(searchedItem);
  //   }
  // }, [searchedItem]);

  // Call delayedQuery function when user search and set new warehouse data
  React.useEffect(() => {
    if (itemQuery) {
      handleSearchItems()
    } else if (!itemQuery) {
      setSearchedItem(warehouseSKUs)
      setSearchItemsLoading(false);
    }
    return handleSearchItems.cancel;
  }, [itemQuery, handleSearchItems, SKU]);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    if (searchedItem) {
      setSearchItemsLoading(false);
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
      { label: 'UOM', key: 'warehouse_client' },
      { label: 'External Material Coding', key: 'external_code' },
      { label: 'External Material Description', key: 'external_reference_number' },
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
      props.fetchDeliveryNotices({
        count: rowsPerPage,
        after: page * rowsPerPage
      });
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
  

  // Function for CSV Download  
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

  // Call delayedQuery function when user search and set new sku data
  React.useEffect(() => {
    if (query) {
      delayedQuery(page, rowCount);
    } else if (!query) {
      setDeliveryNoticeData(props.notice);
      seSKUCount(props.notice);
      setSearchLoading(false);
    }
    return delayedQuery.cancel;
  }, [query, delayedQuery, page, rowCount]);

  /**
   * Set delivery notice data
   */
  React.useEffect(() => {
    if (props.notice) {
      setDeliveryNoticeData(props.notice);
    }
  }, [props.notice]);

  // Show snackbar alert when new warehouse is created
  React.useEffect(() => {
    if (props.location.success) {
      setOpen(true);
    }
  }, [props.location.success]);

  React.useEffect(() => { 
    if (JSON.stringify(deliveryNoticeData) === '{}') {
      setOpenBackdrop(false);
    }
  }, [deliveryNoticeData]);

  // Set searched values and warehouse count after search
  React.useEffect(() => {
    if (props.searched) {
      setSearched(props.searched.data);
      seSKUCount(props.searched.count);
    }
  }, [props.searched]);

  // Set delivery notice count and remove spinner when data fetch is done
  React.useEffect(() => {
    if (props.notice) {
      seSKUCount(props.notice)
      setOpenBackdrop(false);
    }
  }, [props.notice]);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    if (searched) {
      setSearchLoading(false);
      setDeliveryNoticeSKU(searched);
    }
  }, [searched]);

  React.useEffect(() => {
    if (props.notice && !SKU.length) {
      if (!itemQuery) {
        setSearchItemsLoading(true)
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
  }, [props.sku]);

  React.useEffect(() => {
    if (deliveryNoticeData) {
      setOpenBackdrop(true)
      props.fetchDeliveryNoticeSKU(deliveryNoticeData.delivery_notice_id);
    }
  }, [deliveryNoticeData]);

  React.useEffect(() => {
    if (selectedSKU.length) setDeliveryNoticeSKU([]);
    if (!selectedSKU.length && deliveryNoticeData) {
      props.fetchDeliveryNoticeSKU(deliveryNoticeData.delivery_notice_id);
      setOpenBackdrop(true)
    } 
  }, [selectedSKU]);

  React.useEffect(() => {
    if (props.sku) {
      setDeliveryNoticeSKU(props.sku.data);
      setOpenBackdrop(false);
    }
  }, [props.sku]);

  React.useEffect(() => {
    if (props.warehouse) fetchAllWarehouseSKUs({ warehouse_name: props.warehouse.warehouse_name }).then(response => {})
  }, [props.warehouse]);

  console.log(searched)

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
                    {SKU.map((item) => (
                      <MenuItem key={item.item_id} value={item.product_name} selected={item.item_id === item.item_id} onClick={() => toggleCheckboxValue(item, isChecked.includes(item.item_id))} >
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
          <WarehouseSideBar id={props.match.params.id} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Table 
            config={config}
            data={selectedSKU}
            defaultData={deliveryNoticeSKU}
            total={0}
            handleRowCount={handleRowCount}
            onPaginate={handlePagination}
            query={query}
            searchLoading={searchLoading}
            onInputChange={onInputChange}
            handleCancel={handleCancel}
            onSubmit={handleSubmit}
          />
          <Spinner className={classes.backdrop} open={openBackdrop} >
            <CircularProgress color="inherit" />
          </Spinner>
          <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={() => setOpenSnackBar(false)}>
            <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return { 
    error: state.error,
    searched: state.notice.searchedSKU,
    notice: state.notice.data[ownProps.match.params.id],
    sku: state.notice.sku
  }
};

export default connect(mapStateToProps, { fetchDeliveryNotices, fetchDeliveryNoticeByName, fetchDeliveryNoticeSKU, searchDeliveryNoticeSKU })(DeliveryNoticeSKU);