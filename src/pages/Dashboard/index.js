import './style.scss';
import React, { useState, useEffect } from 'react';
import history from 'config/history';
import moment from 'moment';
import _ from 'lodash';
import { DateRangePicker } from "react-dates";
import { connect, useDispatch } from 'react-redux';
import { fetchDashboard, fetchDashboardDeliveryNotice, fetchDashboardPhysicalItem, fetchDashboardPhysicalItemByName, fetchDashboardItems, fetchCBMMonitoring, fetchPalletMonitoring } from 'actions';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { CSVLink } from "react-csv";
import "react-dates/lib/css/_datepicker.css";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@material-ui/core/Grid';
import { Doughnut } from 'react-chartjs-2';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Spinner from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from 'components/Breadcrumbs';
import Table from 'components/Table';
import MuiTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ListIcon from '@mui/icons-material/List';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ReceivedAndReleased from './ReceivedAndReleased';
import NumberOfItems from './ItemNumbers';
import Radar from './Radar';
import CBMMonitoring from './CBMMonitoring';
import PalletMonitoring from './PalletMonitoring';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Dashboard(props) {
  const csvLink = React.useRef();
  const dispatch = useDispatch();
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [warehouseData, setWarehouseData] = React.useState(null)
  const [open, setOpen] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [csvData, setCsvData] = React.useState([]);
  const [searched, setSearched] = React.useState(null);
  const [rowCount, setRowCount] = React.useState(0);
  const [page, setPage]= React.useState(10);
  const [warehouseCount, setWarehouseCount] = React.useState(0);
  const [deliveryNotice, setDeliveryNotice] = React.useState([]);
  const [analytics, setAnalytics] = React.useState([]);
  const [receivedAndRelease, setReceivedAndRelease] = React.useState([]);
  const [warehouseType, setWarehouseType] = React.useState([]);
  const [numberOfItems, setNumberOfItems] = React.useState([]);
  const [inboundCount, setInboundCount] = React.useState(0);
  const [outboundCount, setOutboundCount] = React.useState(0);
  const [activeWarehouseType, setActiveWarehouseType] = useState('radar');
  const [activeCbmMonitoring, setActiveCbmMonitoring] = useState('accumulate');
  const [activePalletMonitoring, setActivePalletMonitoring] = useState('accumulate');

  // Analytics
  const [totalItemsReceived, setTotalItemsReceived] = React.useState(0);
  const [totalItemsReleased, setTotalItemsReleased] = React.useState(0);
  const [totalInventory, setTotalInventory] = React.useState(0);
  const [CBM, setCBM] = React.useState([]);
  const [pallet, setPallet] = React.useState([]);

  // Dates
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
      { label: 'Warehouse', key: 'warehouse_name' },
      { label: 'SKU', key: 'product_name' },
      { label: 'Inbound', key: 'inbound', align: 'right' },
      { label: 'Outbound', key: 'outbound', align: 'right' },
      { label: 'Inventory', key: 'physical_count', align: 'right' },
    ]
  }

  // CSV Headers
  const csvHeaders = [  
    { label: "Warehouse Name", key: "warehouseName" },
    { label: "External Code", key: "externalCode" },
    { label: "Product Name", key: "productName" },
    { label: "Item ID", key: "itemId" },
    { label: "Inbound", key: "inbound" },
    { label: "Outbound", key: "outbound" },
    { label: "Physical Count", key: "physical_count" }
  ];

  // Set query state on input change
  const onInputChange = (e) => {
    setSearched(null);
    setQuery(e.target.value);
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const delayedQuery = React.useCallback(_.debounce((page, rowCount) => {
    setSearchLoading(true);
    props.fetchDashboardPhysicalItemByName({
      from_date: startDate.format("MM/DD/YYYY"),
      to_date: endDate.format("MM/DD/YYYY") + ' 23:59:59',
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
      setWarehouseData(props.warehouses.data);
      setWarehouseCount(props.warehouses.count);
      setSearchLoading(false);
    }
    return delayedQuery.cancel;
  }, [query, delayedQuery, page, rowCount, props.warehouses.data]);

  // Fetch new data if search values was erased
  React.useEffect(() => {
    if (!query) {
      setSearchLoading(false);
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
      if (props.searched.data) setWarehouseCount(props.searched.count);
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
      setWarehouseCount(props.warehouses.count)
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
      props.fetchDashboardPhysicalItem({
        from_date: startDate.format("MM/DD/YYYY"),
        to_date: endDate.format("MM/DD/YYYY") + ' 23:59:59',
        count: rowsPerPage,
        after: page * rowsPerPage
      });
    }
  };

  // Redirect to selected warehouse
  const handleRowClick = row => {};

  // Handler for react-dates picker
  const handleDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  // Function for CSV Download  
  const handleDownloadCSV = async () => {
    // return;
    await fetchDashboardItems({
      from_date: startDate.format("MM/DD/YYYY"),
      to_date: endDate.format("MM/DD/YYYY") + ' 23:59:59',
    }).then(response => {
      const newData = response.data.map(warehouse => {
        return {
          warehouseName: warehouse.warehouse_name,
          externalCode: warehouse.external_code,
          productName: warehouse.product_name,
          itemId: warehouse.item_id,
          inbound: warehouse.inbound,
          outbound: warehouse.outbound,
          physical_count: warehouse.physical_count
        }
      });
      setCsvData(newData);
    }).catch((error) => {
      dispatchError(dispatch, THROW_ERROR, error);
    });

    csvLink.current.link.click();
  }

  // Set warehouse count and remove spinner when data fetch is done
  React.useEffect(() => {
    if (props.warehouses) {
      setWarehouseCount(props.warehouses.count)
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
      to_date: endDate.format("MM/DD/YYYY") + ' 23:59:59'
    });

    props.fetchDashboardDeliveryNotice({
      from_date: startDate.format("MM/DD/YYYY"),
      to_date: endDate.format("MM/DD/YYYY") + ' 23:59:59'
    });

    props.fetchDashboardPhysicalItem({
      from_date: startDate.format("MM/DD/YYYY"),
      to_date: endDate.format("MM/DD/YYYY") + ' 23:59:59',
      count: page || 10,
      after: page * rowCount
    });

    props.fetchCBMMonitoring({
      from_date: startDate.format("MM/DD/YYYY"),
      to_date: endDate.format("MM/DD/YYYY") + ' 23:59:59',
    });

    props.fetchPalletMonitoring({
      from_date: startDate.format("MM/DD/YYYY"),
      to_date: endDate.format("MM/DD/YYYY") + ' 23:59:59',
    });
  }, [startDate, endDate]);

  // Set Dashboard data
  React.useEffect(() => {
    if (props.warehouses) {
      setAnalytics(props.dashboard.data.analytics);
      setReceivedAndRelease(props.dashboard.data.total_received_and_release);
      setWarehouseType(props.dashboard.data.warehouse_type);
      setNumberOfItems(props.dashboard.data.number_of_items);
      setDeliveryNotice(props.notice);
      setCBM(props.dashboard.cbm);
      setPallet(props.dashboard.pallet)
      setWarehouseData(props.warehouses.data);
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
         var fontSize = (height / 80).toFixed(2);
         ctx.font = fontSize + "em sans-serif";
         ctx.textBaseline = "middle";
         var text = getInventoryPercentage() + '%',
         textX = Math.round((width - ctx.measureText(text).width) / 2),
         textY = height / 2;
         ctx.fillText(text, textX, textY);
         ctx.save();
    } 
  }];

  const getInventoryPercentage = () => {
    let percentage = 0;
    if (totalItemsReceived && totalInventory)  {
      percentage = totalItemsReleased / (totalItemsReceived + totalItemsReleased) * 100;
    }

    return Math.round(percentage * 10) / 10;
  }

  const options = {
    animation: false,
    plugins: {
      legend: {
        display: false
      },
      labels: {
        display: false
      },
    },
    cutout: () => {
      const collapsed = document.querySelector('.drawer:not(.drawer--collapsed) + main');
      const inventory = document.querySelector('.inventory');
      let val = 105;

      if (collapsed && analytics) {
        val = 80;
      }

      if (inventory.clientWidth > 320) {
        val = 105;
      }

      if (inventory.clientWidth > 340) {
        val = 118;
      }
      
      return val;
    }
  }

  const doughnutData = {
    datasets: [
      {
        data: [getInventoryPercentage(), Math.abs(getInventoryPercentage() - 100)],
        backgroundColor: [
          "#009688",
          "#A8DCD3",
        ],
        hoverBackgroundColor: [
          "#E9E9E9",
        ],
    }]
  };

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
      <Grid container spacing={2} className="analytics-charts">
        <Grid container item xs={12} spacing={2}>
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
                      <Typography variant="body2">{activeWarehouseType === 'list' ? 'List' : 'Radar'}</Typography>
                      <div className="button-group">
                        <AssessmentIcon onClick={() => setActiveWarehouseType('radar')} className={activeWarehouseType === 'radar' ? 'active' : ''} />
                        <ListIcon onClick={() => setActiveWarehouseType('list')} className={activeWarehouseType === 'list' ? 'active' : ''} />
                      </div>
                    </div>
                    {activeWarehouseType === 'radar' ? 
                    <Radar data={warehouseType} /> :
                      <TableContainer>
                        <MuiTable aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Type</TableCell>
                              <TableCell align="right">Total Items Recorded</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {warehouseType.map((warehouse) => (
                              <TableRow className="hover-button">
                                <TableCell>{warehouse.description}</TableCell>
                                <TableCell align="right">{warehouse.value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </MuiTable>
                      </TableContainer>
                    }
                  </Paper>
                </Grid>
                <Grid item xs={4} className="inventory">
                  <Paper elevation={1}>
                    <Typography>Inventory</Typography>
                    <Typography variant="body2" style={{marginBottom: 25}}>Percentage</Typography>
                    {totalInventory &&
                      <Doughnut
                        style={{maxHeight: 300, maxWidth: 300}}
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
                className="dashboard-table"
              />
              <Grid container item xs={12} spacing={2} className='analytics'>
                <Grid item xs={8} className="received-released">
                  <Paper elevation={1} className="chart">
                    <Typography>Total items Received and Released</Typography>
                    <div className="flex justify-space-between align-center">
                      <Typography variant="body2">Difference</Typography>
                    </div>
                     {receivedAndRelease && <ReceivedAndReleased data={receivedAndRelease} />}
                  </Paper>
                </Grid>
                <Grid item xs={4} className="number-of-items">
                  <Paper elevation={1} className="chart">
                    <Typography>Number of Items</Typography>
                    <Typography variant="body2">Descending</Typography>
                    {receivedAndRelease && <NumberOfItems data={numberOfItems} />}
                  </Paper>
                </Grid>
              </Grid>
              <Grid item xs={12} className="monitoring">
                <Paper elevation={1}>
                  <Typography>CBM Monitoring</Typography>
                  <div className="flex justify-space-between align-center">
                    <Typography variant="body2">{activeCbmMonitoring === 'accumulate' ? 'Accumulate' : 'Difference'}</Typography>
                    <div className="button-group chart-icon">
                      <TrendingUpIcon onClick={() => setActiveCbmMonitoring('accumulate')} className={activeCbmMonitoring === 'accumulate' ? 'active' : ''} />
                      <BarChartIcon onClick={() => setActiveCbmMonitoring('difference')} className={activeCbmMonitoring === 'difference' ? 'active' : ''} />
                    </div>
                  </div>
                  <CBMMonitoring data={CBM} type={activeCbmMonitoring} date={{start: startDate.format("MM/DD/YYYY"), end: endDate.format("MM/DD/YYYY")}} />
                </Paper>
              </Grid>
              <Grid item xs={12} className="monitoring">
                <Paper elevation={1}>
                  <Typography>Pallet Monitoring</Typography>
                  <div className="flex justify-space-between align-center">
                    <Typography variant="body2">{activePalletMonitoring}</Typography>
                    <div className="button-group chart-icon">
                      <TrendingUpIcon onClick={() => setActivePalletMonitoring('accumulate')} className={activePalletMonitoring === 'accumulate' ? 'active' : ''} />
                      <BarChartIcon onClick={() => setActivePalletMonitoring('difference')} className={activePalletMonitoring === 'difference' ? 'active' : ''} />
                    </div>
                  </div>
                  <PalletMonitoring data={pallet} type={activePalletMonitoring === 'accumulate' ? 'accumulate' : 'difference'}/>
                </Paper>
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
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deliveryNotice.map((notice) => (
                      <TableRow key={notice.unique_code} className="hover-button">
                        <TableCell>{notice.unique_code}</TableCell>
                        <TableCell className="transaction-type">
                          {renderStatus(notice.transaction_type)}
                          <OpenInNewIcon className="hover-button--on" fontSize="small" onClick={() => history.push(`/delivery-notice/${notice.unique_code}/overview`)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </MuiTable>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Spinner sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} >
        <CircularProgress color="inherit" />
      </Spinner>
      <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity="success">{props.location.success}</Alert>
      </Snackbar>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    warehouses: state.dashboard.item,
    searched: state.dashboard.search,
    notice: state.dashboard.notice,
    dashboard: state.dashboard
  }
}

export default connect(mapStateToProps, { fetchDashboard, fetchDashboardDeliveryNotice, fetchDashboardPhysicalItem, fetchDashboardPhysicalItemByName, fetchCBMMonitoring, fetchPalletMonitoring })(Dashboard);