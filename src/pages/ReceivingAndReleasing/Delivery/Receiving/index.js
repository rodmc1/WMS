/* eslint-disable react/prop-types */
import './style.scss';
import _ from 'lodash';
import React, {  useState, useRef } from 'react';
import { CSVLink } from "react-csv";
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { createReceivingAndReleasingItem, fetchDeliveryNotices, fetchAllDeliveryNoticeSKU, fetchDeliveryNoticeByName, fetchDeliveryNoticeSKU, searchDeliveryNoticeSKU, fetchAllWarehouseSKUs, searchWarehouseSKUByName } from 'actions';
import WarehouseSideBar from 'components/WarehouseDeliveryNotice/SideBar';
import Table from './table';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Breadcrumbs from 'components/Breadcrumbs';
import Snackbar from '@material-ui/core/Snackbar';
import Spinner from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { Typography } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Receiving(props) {
  const [SKU, setSKU] = useState([]);
  const [deliveryNoticeSKU, setDeliveryNoticeSKU] = useState([]);
  const [receivingItem, setReceivingItem] = useState([])
  const anchorRef = React.useRef(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [openAddItems, setOpenAddItems] = React.useState(false);
  const [page, setPage]= useState(10);
  const [query, setQuery] = useState('');
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
  const [alertConfig, setAlertConfig] = React.useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [submittedId, setSubmittedId] = React.useState(null)

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
  }, [itemQuery, handleSearchItems, SKU]);

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
   * Submit function for creating delivery notice
   * 
   * @param {object} data Set of new delivery notice data
   */
  const handleSubmit = (data, item_id) => {
    setOpenSnackBar(false);
    setAlertConfig({ severity: 'info', message: 'Adding Item...' });
    setOpenSnackBar(true);
    
    //Invoke action for adding delivery notice SKU
    createReceivingAndReleasingItem(data)
      .then(response => {
        if (response.status === 201) {
          setAlertConfig({ severity: 'success', message: 'Successfuly saved' });
          setSubmittedId(item_id)
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
    setAlertConfig({ severity: 'error', message: 'All fields are required' });
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

  React.useEffect(() => {
    if (props.receivingData) setReceivingItem(props.receivingData)
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.receivingData]);

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
    <div className="container delivery-notice-receiving-items-container sku">
      <div className="flex justify-space-between align-center receiving-title">
        <Typography>{receivingItem.transaction_type === 'Inbound' ? 'Receiving' : 'Releasing' } items from <b>{receivingItem.plate_number}</b></Typography>
        <Tooltip title="Close">
          <IconButton aria-label="close" component="span" onClick={props.onClose} >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </div>
      <Table
        config={config}
        data={selectedSKU}
        defaultData={deliveryNoticeSKU}
        handleRowCount={handleRowCount}
        onPaginate={handlePagination}
        query={query}
        searchLoading={searchLoading}
        handleCancel={handleCancel}
        onSubmit={handleSubmit}
        onError={handleErrors}
        total={skuCount || 0}
        deliveryNoticeId={props.receivingData.delivery_noticeid}
        receivingData={receivingItem}
        submittedId={submittedId}
      />
      <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={() => setOpenSnackBar(false)}>
        <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
      </Snackbar>
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
    sku: state.notice.sku
  }
};

export default connect(mapStateToProps, { fetchDeliveryNotices, fetchDeliveryNoticeByName, fetchDeliveryNoticeSKU, searchDeliveryNoticeSKU })(Receiving);