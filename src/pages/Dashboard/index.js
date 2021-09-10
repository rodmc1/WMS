import './style.scss';
import React, { useState, useEffect } from 'react';
import history from 'config/history';
import moment from 'moment';
import _ from 'lodash';
import { DateRangePicker } from "react-dates";
import { connect, useDispatch } from 'react-redux';
import { fetchDashboard, fetchDashboardDeliveryNotice, fetchDashboardPhysicalItem } from 'actions';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { CSVLink } from "react-csv";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { spacing } from '@material-ui/system';
import Grid from '@material-ui/core/Grid';
import { Doughnut } from 'react-chartjs-2';


import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Spinner from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Breadcrumbs from 'components/Breadcrumbs';
import Table from 'components/Table';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ListIcon from '@material-ui/icons/List';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const doughnutData = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      data: [25, 75],
      backgroundColor: [
        "#009688",
        "#A8DCD3",
      ],
      hoverBackgroundColor: [
        "#E9E9E9",
      ],
  }]
};


function WarehouseList(props) {
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [warehouseData, setWarehouseData] = React.useState(null)
  const [open, setOpen] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [csvData, setCsvData] = React.useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const csvLink = React.useRef();
  const [searched, setSearched] = React.useState(null);
  const [rowCount, setRowCount] = React.useState(0);
  const [page, setPage]= React.useState(10);
  const [warehouseCount, setWarehouseCount] = React.useState(0);
  const [items, setItems] = React.useState([]);
  const [deliveryNotice, setDeliveryNotice] = React.useState([]);
  const [analytics, setAnalytics] = React.useState([]);
  const [receivedAndRelease, setReceivedAndRelease] = React.useState([]);
  const [warehouseType, setWarehouseType] = React.useState([]);
  const [numberOfItems, setNumberOfItems] = React.useState([]);
  const [noticeCount, setNoticeCount] = React.useState([]);
  const [inboundCount, setInboundCount] = React.useState(0);
  const [outboundCount, setOutboundCount] = React.useState(0);

  // Analytics
  const [totalItemsReceived, setTotalItemsReceived] = React.useState(0);
  const [totalItemsReleased, setTotalItemsReleased] = React.useState(0);
  const [totalInventory, setTotalInventory] = React.useState(0);

  // Dates
  const [dateRange, setDateRange] = useState('');
  const [activeButton, setActiveButton] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [endDate, setEndDate] = useState(moment().endOf('today'));
  const [startDate, setStartDate] = useState(moment().startOf('year'));

  const routes = [
    {
      label: 'Dashboard',
      path: '/'
    }
  ];

  // Handler for Row and Page Count
  const handleRowCount = (page, rowsPerPage) => {
    setRowCount(rowsPerPage);
    setPage(page);
  };

  const config = {
    rowsPerPage: 10,
    headers: [
      { label: 'ID', key: 'warehouse_id' },
      { label: 'Warehouse', key: 'warehouse_client' },
      { label: 'Street Address', key: 'address' },
      { label: 'Country', key: 'country' },
      { label: 'GPS Coordinates', key: 'gps_coordinate' },
      { label: 'Nearby Stations', key: 'nearby_station' },
      { label: 'Type', key: 'building_type' },
      { label: 'Min Lease Term', key: 'min_lease_terms', align: 'right' },
      { label: 'Floor Area', key: 'office_area', align: 'right' }
    ]
  }

  // CSV Headers
  const csvHeaders = [  
    { label: "Warehouse Name", key: "warehouseName" },
    { label: "Address", key: "address" },
    { label: "GPS Coordinates", key: "gpsCoordinate" },
    { label: "Country", key: "country" },
    { label: "Warehouse Type", key: "warehouseType" },
    { label: "Building Type", key: "buildingType" },
    { label: "Warehouse Status", key: "warehouseStatus" },
    { label: "Nearby Station", key: "nearbyStation" },
    { label: "Year of TOP", key: "yearTop" },
    { label: "Min lease terms (months)", key: "minLeaseTerms" },
    { label: "PSF", key: "psf" },
    { label: "Floor Area (sqm)", key: "floorArea" },
    { label: "Covered Area (sqm)", key: "coveredArea" },
    { label: "Mezzanine Area (sqm)", key: "mezzanineArea" },
    { label: "Open Area (sqm)", key: "openArea" },
    { label: "Office Area (sqm)", key: "officeArea" },
    { label: "Battery Charging Area (sqm)", key: "batteryChargingArea" },
    { label: "Loading and Unloading Bays", key: "loadingAndUnloadingBays" },
    { label: "Facilities and amenities", key: "facilitiesAndAmenities" },
    { label: "Remarks", key: "remarks" }
  ];

  // Redirect to create warehouse page
  const handleCreateWarehouse = () => {
    history.push('/warehouse-list/warehouse-create');
  }

  // Set query state on input change
  const onInputChange = (e) => {
    setSearched(null);
    setQuery(e.target.value);
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const delayedQuery = React.useCallback(_.debounce((page, rowCount) => {
    setSearchLoading(true);
    // props.fetchWarehouseByName({
    //   filter: query,
    //   count: rowCount,
    //   after: page * rowCount
    // })
  }, 510), [query]);

  // Call delayedQuery function when user search and set new warehouse data
  // React.useEffect(() => {
  //   if (query) {
  //     delayedQuery(page, rowCount);
  //   } else if (!query) {
  //     setWarehouseData(props.warehouses.data);
  //     setWarehouseCount(props.warehouses.count);
  //     setSearchLoading(false);
  //   }
  //   return delayedQuery.cancel;
  // }, [query, delayedQuery, page, rowCount, props.warehouses.count, props.warehouses.data]);

  // Fetch new data if search values was erased
  React.useEffect(() => {
    if (!query) {
      setSearchLoading(true);
      // props.fetchWarehouses({
      //   count: page || 10,
      //   after: page * rowCount
      // });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [query]);


  React.useEffect(() => { 
    if (JSON.stringify(warehouseData) === '{}') {
      setOpenBackdrop(false);
    }
  }, [warehouseData]);

  // Set searched values and warehouse count after search
  React.useEffect(() => {
    if (props.searched) {
      setSearched(props.searched.data);
      setWarehouseCount(props.searched.count);
    }
  }, [props.searched]);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    if (searched) {
      setSearchLoading(false);
      setWarehouseData(searched);
    }
  }, [searched]);

  // Set warehouses data
  React.useEffect(() => {
    if (props.warehouses.data) {
      setWarehouseData(props.warehouses.data);
    }
  }, [props.warehouses]);

  /*
   * Function for pagination when searching
   * @args Page num, rowsPerPage num
   */
  const handlePagination = (page, rowsPerPage) => {
    if (query) {
      delayedQuery(page, rowsPerPage);
    } else {
      // props.fetchWarehouses({
      //   count: rowsPerPage,
      //   after: page * rowsPerPage
      // });
    }
  };

  // Redirect to selected warehouse
  const handleRowClick = (row) => {
    history.push(`/warehouse-list/${row.warehouse_client}/overview`);
  }

  // Handler for react-dates picker
  const handleDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  // Function for CSV Download  
  const handleDownloadCSV = async () => {
    return;
    // await fetchAllWarehouse().then(response => {
    //   const newData = response.data.map(warehouse => {
    //     return {
    //       warehouseName: warehouse.warehouse_client,
    //       address: warehouse.address,
    //       gpsCoordinate: warehouse.gps_coordinate,
    //       country: warehouse.country,
    //       warehouseType: warehouse.warehouse_type,
    //       buildingType: warehouse.building_type,
    //       warehouseStatus: warehouse.warehouse_status,
    //       nearbyStation: warehouse.nearby_station,
    //       yearTop: warehouse.year_top,
    //       minLeaseTerms: warehouse.min_lease_terms,
    //       psf: warehouse.psf,
    //       floorArea: warehouse.floor_area,
    //       coveredArea: warehouse.covered_area,
    //       mezzanineArea: warehouse.mezzanine_area,
    //       openArea: warehouse.open_area,
    //       officeArea: warehouse.office_area,
    //       batteryChargingArea: warehouse.battery_charging_area,
    //       loadingAndUnloadingBays: warehouse.loading_unloading_bays,
    //       remarks: warehouse.remarks,
    //       facilitiesAndAmenities: warehouse.facilities_amenities
    //     }
    //   });
    //   setCsvData(newData);
    // }).catch((error) => {
    //   dispatchError(dispatch, THROW_ERROR, error);
    // });

    // csvLink.current.link.click();
  }

  // Set warehouse count and remove spinner when data fetch is done
  React.useEffect(() => {
    if (props.warehouses) {
      setWarehouseCount(props.warehouses.length)
      setOpenBackdrop(false);
    }
  }, [props.warehouses]);

  // Show snackbar alert when new warehouse is created
  React.useEffect(() => {
    if (props.location.success) {
      setOpen(true);
    }
  }, [props.location.success]);

  // Show snackbar alert when new warehouse is created
  React.useEffect(() => {
    props.fetchDashboard({
      from_date: startDate.format("MM/DD/YYYY"),
      to_date: endDate.format("MM/DD/YYYY")
    });

    props.fetchDashboardDeliveryNotice({
      from_date: startDate.format("MM/DD/YYYY"),
      to_date: endDate.format("MM/DD/YYYY")
    });

    props.fetchDashboardPhysicalItem({
      from_date: startDate.format("MM/DD/YYYY"),
      to_date: endDate.format("MM/DD/YYYY")
    });
  }, [startDate, endDate]);

  // Set Dashboard data
  React.useEffect(() => {
    if (props.warehouses) {
      setAnalytics(props.dashboard.analytics);
      setReceivedAndRelease(props.dashboard.total_received_and_released);
      setWarehouseType(props.dashboard.warehouse_type);
      setNumberOfItems(props.dashboard.number_of_items);
      setNoticeCount(props.dashboard.deliverynotice_count);
      setDeliveryNotice(props.notice);
      setItems(props.warehouses);
      setWarehouseData(props.warehouses);
    }
  }, [props.dashboard, props.notice, props.warehouses]);

  // Set Inbount and Outbound counts
  React.useEffect(() => {
    if (deliveryNotice) {
      let inbound = 0;
      let outbound = 0;

      deliveryNotice.forEach(notice => {
        if (notice.transaction_type === 'Inbound') inbound++;
        if (notice.transaction_type === 'Outbound') outbound++
      })

      setInboundCount(inbound);
      setOutboundCount(outbound);
    }
  }, [deliveryNotice]);

    // Set Analytics data
    React.useEffect(() => {
      if (analytics) {
        let received = 0;
        let released = 0;
        let inventory = 0;
  
        analytics.forEach(item => {
          if (item.description === 'Inbound') received = item.value;
          if (item.description === 'Outbound') released = item.value;
          if (item.description === 'Inventory') inventory = item.value;
        });

        setTotalItemsReceived(received);
        setTotalItemsReleased(released);
        setTotalInventory(inventory);

      }
    }, [analytics]);

  const renderStatus = data => {
    let jsx = <Chip label="Inbound" className="status-chip emerald" />
    if (data === 'Outbound') jsx = <Chip label="Outbound" className="status-chip tangerine" />;
    return jsx
  }


  const plugins = [{
    beforeDraw: function(chart) {
     var width = chart.width,
         height = chart.height,
         ctx = chart.ctx;
         ctx.restore();
         var fontSize = (height / 160).toFixed(2);
         ctx.font = fontSize + "em sans-serif";
         ctx.textBaseline = "middle";
         var text = "75%",
         textX = Math.round((width - ctx.measureText(text).width) / 2),
         textY = height / 2;
         ctx.fillText(text, textX, textY);
         ctx.save();
    } 
  }];

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      labels: {
        display: false
      },
    },
    cutout: () => {
      let val = 90;
      const collapsed = document.querySelector('.drawer:not(.drawer--collapsed) + main');

      if (collapsed && analytics) {
        val = 75;
      }
      
      return val;
    }
  }


  if (document.querySelector('.drawer:not(.drawer--collapsed) + main')) {
    console.log('collapsed')
  }

  return (
    <div className="container dashboard">
      <div className="flex justify-space-between align-center">
        <Breadcrumbs routes={routes} />
        <div className="button-group">
          <DateRangePicker
            startDate={startDate}
            startDateId="startDate"
            endDate={endDate}
            endDateId="endDate"
            onDatesChange={handleDatesChange}
            focusedInput={focusedInput}
            onFocusChange={focusedInput => setFocusedInput(focusedInput)}
            isOutsideRange={() => false}
          />
          <CSVLink data={csvData} filename="warehouses.csv" headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
          <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginRight: 10 }} onClick={handleDownloadCSV}>Download CSV</Button>
        </div>
      </div>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={9}>
            <Paper elevation={1}>
              <Typography>Analytics</Typography>
              <Grid container item xs={12} spacing={3} className='analytics'>
                <Grid item xs={4} className="total-items-received">
                  <Paper elevation={1}>
                    <Typography>{totalItemsReceived}</Typography>
                    <Typography variant="body2">Total Items Received</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper elevation={1}>
                    <Typography>{totalItemsReleased}</Typography>
                    <Typography variant="body2">Total Items Released</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper elevation={1}>
                    <Typography>{totalInventory}</Typography>
                    <Typography variant="body2">Total Inventory</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={8} className="warehouse-type">
                  <Paper elevation={1}>
                    <Typography>Warehouse Type</Typography>
                    <div className="flex justify-space-between align-center">
                      <Typography variant="body2">Bubble group</Typography>
                      <div className="button-group">
                        <AssessmentIcon />
                        <ListIcon />
                      </div>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={4} className="inventory">
                  <Paper elevation={1}>
                    <Typography>Inventory</Typography>
                    <Typography variant="body2">Percentage</Typography>
                    {analytics && 
                      <Doughnut
                      data={doughnutData}
                      options={options}
                      plugins={plugins}
                     />
                    }
                  </Paper>
                </Grid>
              </Grid>
              <Table
                config={config}
                data={warehouseData}
                total={warehouseCount}
                onInputChange={onInputChange}
                onPaginate={handlePagination}
                onRowClick={handleRowClick}
                handleRowCount={handleRowCount}
                query={query}
                searchLoading={searchLoading}
              />
              <Grid container item xs={12} spacing={3} className='analytics'>
                <Grid item xs={8} className="warehouse-type">
                  <Paper elevation={1}>
                    <Typography>Total items Received and Released</Typography>
                    <div className="flex justify-space-between align-center">
                      <Typography variant="body2">Difference</Typography>
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={4} className="inventory">
                  <Paper elevation={1}>
                    <Typography>Number of Items</Typography>
                    <Typography variant="body2">Descending</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={3} className="delivery-notice">
            <Paper elevation={1}>
              <Typography>Delivery Notice</Typography>
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={6} className="inbound">
                  <Paper elevation={1}>
                    <Typography>{inboundCount}</Typography>
                    <Typography variant="body2">Inbound</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} className="outbound">
                  <Paper elevation={1}>
                    <Typography>{outboundCount}</Typography>
                    <Typography variant="body2">Outbound</Typography>
                  </Paper>
                </Grid>
              </Grid>
              <TableContainer component={Paper}>
                <MuiTable aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Unique Code</TableCell>
                      <TableCell>Transaction Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deliveryNotice.map((notice) => (
                      <TableRow key={notice.unique_code}>
                        <TableCell>{notice.unique_code}</TableCell>
                        <TableCell>{renderStatus(notice.transaction_type)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </MuiTable>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Spinner className={classes.backdrop} open={openBackdrop} >
        <CircularProgress color="inherit" />
      </Spinner>
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity="success">{props.location.success}</Alert>
      </Snackbar>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    warehouses: state.dashboard.item,
    searched: state.warehouses.search,
    notice: state.dashboard.notice,
    dashboard: state.dashboard.data
  }
}

export default connect(mapStateToProps, { fetchDashboard, fetchDashboardDeliveryNotice, fetchDashboardPhysicalItem })(WarehouseList);