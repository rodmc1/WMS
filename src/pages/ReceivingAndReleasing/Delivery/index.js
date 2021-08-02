/* eslint-disable react/prop-types */
import './style.scss';
import _ from 'lodash';
import React, {  useState, useRef } from 'react';
import { CSVLink } from "react-csv";
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { createDeliveryNoticeSKU, fetchAllReceivingAndReleasingByCode, fetchAllReceivingAndReleasingById, searchDeliveryNoticeSKU, fetchAllWarehouseSKUs, searchWarehouseSKUByName } from 'actions';
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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function DeliveryList(props) {
  const csvLink = useRef();
  const [SKU, setSKU] = useState([]);
  const [tableData, setTableData] = useState([]);
  const anchorRef = React.useRef(null);
  const classes = useStyles();
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
  const [alertConfig, setAlertConfig] = React.useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);

  const routes = [
    {
      label: 'Receiving & Releasing',
      path: '/receiving-and-releasing'
    },
    {
      label: props.match.params.id,
      path: `/d/receiving-and-releasing/${props.match.params.id}`
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
      { label: 'No. of SKU', key: 'item_code' },
      { label: 'Container Van No.', key: 'external_code' },
      { label: 'Serial No.', key: 'external_reference_number' },
      { label: 'Trucker', key: 'trucker' },
      { label: 'Plate Number', key: 'plate_number'},
      { label: 'Driver', key: 'driver_name' },
      { label: 'Date & Time Start', key: 'date_in' },
      { label: 'Date & Time End', key: 'date_out' },
      { label: 'Notes', key: 'notes' },
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
    }
  };

  // Fetch new data if search values was erased
  React.useEffect(() => {
    if (!query) {
      setSearchLoading(true);
      props.fetchAllReceivingAndReleasingById({
        count: page || 10,
        after: page * rowCount,
        filter: props.match.params.id
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
    await fetchAllReceivingAndReleasingByCode(props.match.params.id).then(response => {
      const newData = response.data.map(data => {
        return {
          recieved_id: data.recieved_id,
          unique_code: data.unique_code,
          trucker: data.trucker,
          driver_name: data.driver_name,
          transaction_type: data.transaction_type,
          status: data.status,
          plate_number: data.plate_number,
          date_in: data.date_in,
          date_out: data.date_out,
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

  // Set searched values and warehouse count after search
  React.useEffect(() => {
    if (props.searched) {
      setSearched(props.searched.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.searched]);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    if (searched) {
      setSearchLoading(false);
      // setTableData(searched);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [searched]);

  React.useEffect(() => {
    if (props.receivingAndReleasing) setTableData(props.receivingAndReleasing.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.receivingAndReleasing]);

  React.useEffect(() => {
    if (!Array.isArray(tableData)) setOpenBackdrop(false);
  }, [tableData]);

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
          <CSVLink data={csvData} filename="receiving-and-releasing.csv" headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
          <Button ref={anchorRef} aria-haspopup="true" onClick={handleToggle} variant="contained" className="btn btn--emerald" disableElevation>Add Delivery</Button>
          <Button variant="contained" className="btn btn--emerald btn-csv" disableElevation onClick={handleDownloadCSV}>Download CSV</Button>
        </div>
      </div>
      <Table 
        config={config}
        data={selectedSKU}
        defaultData={tableData}
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
      <Spinner className={classes.backdrop} open={openBackdrop} >
        <CircularProgress color="inherit" />
      </Spinner>
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
    searched: state.receiving_releasing.search,
    notice: state.notice.data[ownProps.match.params.id],
    sku: state.notice.sku,
    receivingAndReleasing: state.receiving_releasing
  }
};

export default connect(mapStateToProps, { fetchAllReceivingAndReleasingById, searchDeliveryNoticeSKU })(DeliveryList);