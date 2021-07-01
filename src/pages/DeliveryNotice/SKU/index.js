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
import { fetchWarehouses, fetchDeliveryNotices, fetchAllWarehouse, fetchDeliveryNoticeByName, fetchAllDeliveryNotice, fetchAllWarehouseSKUs } from 'actions';
import WarehouseSideBar from 'components/WarehouseDeliveryNotice/SideBar';
import { Controller, useForm } from 'react-hook-form';
import FormControlLabel from "@material-ui/core/FormControlLabel";


import Table from './table';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
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
  const [deliveryNoticeCount, setDeliveryNoticeCount] = useState(0);
  const [deliveryNoticeData, setDeliveryNoticeData] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedSKU, setSelectedSKU] = React.useState([]);
  const [isChecked, setIsChecked] = React.useState([]);

  React.useEffect(() => {
    // if (item) {
    //   console.log(item)
      // if (!isChecked.includes(item.item_id)) {
      //   setSelectedSKU(oldArray => [...oldArray, item]);
      // }
      // if (isChecked.includes(item.id)) {
      //   const filtered = selectedSKU.filter(sku => sku.item_id !== item.item_id)
      //   setSelectedSKU(filtered);
      // }
    // }
  }, [isChecked])

  
  console.log(isChecked);
  console.log(selectedSKU);

  const toggleCheckboxValue = (item, bool) => {
    console.log(bool)
    if (!isChecked.includes(item.item_id)) {
      setIsChecked(oldArray => [...oldArray, item.item_id]);
      // setSelectedSKU(oldArray => [...oldArray, item]);
    } 
    // else {
    //   setIsChecked(isChecked.filter(check => check !== item.item_id));
    // }
    // if (!isChecked.includes(item.item_id)) {
    //   setSelectedSKU(oldArray => [...oldArray, item]);
    // }
    

    if (isChecked.includes(item.item_id)) {
      // console.log(isChecked.filter(check => check !== item.item_id))
      setIsChecked(isChecked.filter(check => check !== item.item_id));
      // const filtered = newArray.filter(sku => sku.item_id !== item.item_id)
      // setSelectedSKU(filtered);
    }



    if (bool) {
      const filtered = selectedSKU.filter(sku => sku.item_id !== item.item_id)
      setSelectedSKU(filtered);
    } else {
      
      setSelectedSKU(oldArray => [...oldArray, item]);
    }
    // let newSKUArray = [];
    // selectedSKU.forEach(sku => {
    //   if (sku.item_id === item.item_id) {
    //     newSKUArray.push(item)
    //   }
    // })
    // if (isChecked.includes(item.id)) {
    //   const filtered = selectedSKU.filter(sku => sku.item_id !== item.item_id)
    //   setSelectedSKU(filtered);
    // }
  }
  
  // console.log(selectedSKU);
  // console.log(isChecked)

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
      { label: 'SKU Code', key: 'item_code' },
      { label: 'External Material Coding', key: 'external_code' },
      { label: 'External Material Description', key: 'external_reference_number' },
      { label: 'UOM', key: 'warehouse_client' },
      { label: 'Expected Quantity'},
      { label: 'Notes' },
    ]
  }

  // Function for getting page and row count on table
  const handleRowCount = (page, rowsPerPage) => {
    setRowCount(rowsPerPage);
    setPage(page);
  };

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
    props.fetchDeliveryNoticeByName({
      filter: query,
      count: rowCount,
      after: page * rowCount
    })
  }, 510), [query]);

  // Redirect to create warehouse page
  const handleCreateDeliveryNotice = () => {
    history.push('/delivery-notice/create');
  }

  // Function for CSV Download  
  const handleDownloadCSV = async () => {
    await fetchAllDeliveryNotice().then(response => {
      const newData = response.data.map(notice => {
        return {
          warehouse_name: notice.warehouse_name,
          warehouse_client: notice.warehouse_client,
          transaction_type: notice.transaction_type,
          unique_code: notice.unique_code,
          booking_datetime: notice.booking_datetime.toJSON().substring(0,10),
          appointment_datetime: notice.appointment_datetime.toJSON().substring(0,10),
          delivery_mode: notice.delivery_mode,
          asset_type: notice.asset_type,
          qty_of_trucks: notice.qty_of_trucks,
          external_reference_number: notice.external_reference_number,
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
    { label: "Unique Code", key: "unique_code" },
    { label: "External Reference No.", key: "external_reference_number" },
    { label: "Warehouse Client", key: "warehouse_client" },
    { label: "Warehouse", key: "warehouse_name" },
    { label: "Transaction Type", key: "transaction_type" },
    { label: "Booking Date", key: "booking_datetime" },
    { label: "Appointed Date", key: "appointment_datetime" },
    { label: "Delivery Mode", key: "delivery_mode" },
    { label: "Type of Trucks", key: "asset_type" },
    { label: "Quantity of truck", key: "qty_of_trucks" }
  ];

  // Call delayedQuery function when user search and set new warehouse data
  React.useEffect(() => {
    if (query) {
      delayedQuery(page, rowCount);
    } else if (!query) {
      setDeliveryNoticeData(props.notice.data);
      setDeliveryNoticeCount(props.notice.count);
      setSearchLoading(false);
    }
    return delayedQuery.cancel;
  }, [query, delayedQuery, page, rowCount, props.notice.count, props.notice.data]);

  /**
   * Set delivery notice data
   */
  React.useEffect(() => {
    if (props.notice.data) {
      setDeliveryNoticeData(props.notice.data);
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
      setDeliveryNoticeCount(props.searched.count);
    }
  }, [props.searched]);

  // Set warehouse count and remove spinner when data fetch is done
  React.useEffect(() => {
    if (props.notice.count) {
      setDeliveryNoticeCount(props.notice.count)
      setOpenBackdrop(false);
    }
  }, [props.notice.count]);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    if (searched) {
      setSearchLoading(false);
      setDeliveryNoticeData(searched);
    }
  }, [searched]);

  React.useEffect(() => {
    if (props.warehouse && !SKU.length) {
      fetchAllWarehouseSKUs({ warehouse_name: props.warehouse.warehouse_name })
        .then(response => { 
          setSKU(response.data)
        })
        .catch(error => {
          dispatchError(dispatch, THROW_ERROR, error);
        });
    } 
  }, [props.warehouse]);

  React.useEffect(() => {
    if (props.warehouse) fetchAllWarehouseSKUs({ warehouse_name: props.warehouse.warehouse_name }).then(response => {})
  }, [props.warehouse]);

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
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper style={{width: 400, marginRight: 270}}>
                <TextField
                  className="sku-search-items"
                  variant="outlined"
                  type="text"
                  required
                  fullWidth
                />
                  <MenuList
                    autoFocusItem={openAddItems}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                    style={{maxHeight: '400px'}}
                  > 
                    {SKU.map((item) => (
                      <MenuItem key={item.item_id} value={item.product_name} selected={item.item_id === item.item_id} onClick={() => toggleCheckboxValue(item, isChecked.includes(item.item_id))} >
                        <Checkbox checked={isChecked.includes(item.item_id)} />
                        <ListItemText primary={item.product_name} />
                      </MenuItem>
                    ))}
                  </MenuList>
                  <hr />
                  <Button variant="contained" className="btn btn--emerald" disableElevation >Done</Button>
                </Paper>
              </Grow>
            )}
          </Popper>
          <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginLeft: 10 }} onClick={handleDownloadCSV}>Download CSV</Button>
        </div>
      </div>
      <Grid container spacing={2}
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
        <Grid item xs={12} md={3}>
          <WarehouseSideBar id={props.match.params.id} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Table 
            config={config}
            data={selectedSKU}
            total={0}
            handleRowCount={handleRowCount}
            onPaginate={handlePagination}
            query={query}
            searchLoading={searchLoading}
            onInputChange={onInputChange}
          />
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return { 
    error: state.error,
    notice: state.notice,
    searched: state.notice.search,
    warehouse: state.notice.data[ownProps.match.params.id]
  }
};

export default connect(mapStateToProps, { fetchDeliveryNotices, fetchDeliveryNoticeByName })(DeliveryNoticeSKU);