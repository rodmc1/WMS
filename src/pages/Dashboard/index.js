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
import { Doughnut, Bar } from 'react-chartjs-2';
import * as d3 from "d3";

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
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { forceSimulation, forceX, forceY, forceCollide, select, layout } from 'd3'
import Bubble from './Bubble';
import BubbleChart from "@weknow/react-bubble-chart-d3";
import HorizontalBarChart from './ItemNumbers';
import ReceivedAndReleased from './ReceivedAndReleased';
import NumberOfItems from './ItemNumbers';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
  const [hoveredTransactionType, setHoveredTransasctionType] = React.useState(null);

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

  const dataJSON = [
    {
      Name: "Stocky Yard",
      Count: 8
    },
    {
      Name: "Home Economics",
      Count: 4
    },
    {
      Name: "Venture Capital Investment",
      Count: 3
    },
    {
      Name: "Fabric design",
      Count: 6
    }
  ];


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
      setReceivedAndRelease(props.dashboard.total_received_and_release);
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
      percentage = totalInventory / totalItemsReceived * 100;
    }

    return percentage > 100 ? 100 : percentage
  }
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
      let val = 105;
      const collapsed = document.querySelector('.drawer:not(.drawer--collapsed) + main');

      if (collapsed && analytics) {
        val = 80;
      }
      
      return val;
    }
  }

  const doughnutData = {
    datasets: [
      {
        data: [getInventoryPercentage(), getInventoryPercentage() - 100],
        backgroundColor: [
          "#009688",
          "#A8DCD3",
        ],
        hoverBackgroundColor: [
          "#E9E9E9",
        ],
    }]
  };


  // if (document.querySelector('.drawer:not(.drawer--collapsed) + main')) {
  //   console.log('collapsed')
  // }

  var colorLegend = [
    //reds from dark to light
    {color: "#67000d", text: 'Negative', textColor: "#ffffff"}, "#a50f15", "#cb181d", "#ef3b2c", "#fb6a4a", "#fc9272", "#fcbba1", "#fee0d2",
    //neutral grey
    {color: "#f0f0f0", text: 'Neutral'},
    // blues from light to dark
    "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", {color: "#08306b", text: 'Positive', textColor: "#ffffff"}
  ];
   
  var tooltipProps = [{
    css: 'symbol',
    prop: '_id'
  }, {
    css: 'value',
    prop: 'value',
    display: 'Last Value'
  }, {
    css: 'change',
    prop: 'colorValue',
    display: 'Change'
  }];

  useEffect(() => {
    if (analytics) {
      // getSvg();
      drawBubble(dataJSON.map(e=> dataForPacking(e)))
    }
  }, [analytics]);

  const getSvg = () => {
    const svg = d3.select(svgRef.current)
                .attr("width", 500)
                .attr("height", 500);
                
      // Step 1
      const data = [
        {source:"Item 1", x: 100, y: 60, val: 8, color: "#C9D6DF"},
        {source:"Item 2", x: 30, y: 80, val: 4, color: "#F7EECF"},
        {source:"Item 4", x: 190, y: 100, val: 3, color: "#F9CAC8"},
        {source:"Item 5", x: 80, y: 170, val: 6, color: "#F9CAC8"}
      ]

    // Step 4
    svg.selectAll("circle")
      .data(data).enter()
      .append("circle")
      .attr("cx", function(d) {return d.x})
      .attr("cy", function(d) {return d.y})
      .attr("r", function(d) {
        return Math.sqrt(d.val)/Math.PI 
      })
      .attr("fill", function(d) {
        return d.color;
      });

    // Step 5
    svg.selectAll("text")
      .data(data).enter()
      .append("text")
      .attr("x", function(d) {return d.x+(Math.sqrt(d.val)/Math.PI)})
      .attr("y", function(d) {return d.y+4})
      .text(function(d) {return d.source})
      .style("font-family", "arial")
      .style("font-size", "12px")
  }

  
  const dataForPacking = (data) => {
    return {
      r: data.Count,
      x: 0,
      y: 0,
      Count: data.Count,
      Name: data.Name
    };
  };

  const svgRef = React.createRef()

  const drawBubble = () => {
    const svg = d3.select(svgRef.current);
    svg.select("g").remove();
    const diameter = 600;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const circles = svg
      .append("g")
      .attr("class", "circles")
      .attr(
        "transform",
        `translate(${325 / 2},
          ${300 / 2})scale(8)`
      );

    const node = circles
      .selectAll(".node")
      .data(d3.packSiblings(dataJSON.map(e=> dataForPacking(e))))
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    node
      .append("circle")
      .attr("r", function(d) {
        return d.r;
      })
      .attr("class", "circle")
      .style("fill", function(d, i) {
        return color(i);
      });

    node
      .append("text")
      .attr("dy", "0.3em")
      .style("text-anchor", "middle")
      .text(function(d) {
        return d.Count;
      })
      .attr("font-family", "Gill Sans", "Gill Sans MT")
      .attr("font-size", 2)
      .attr("fill", "white");
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
                    {/* <svg width="500" height="500" ref={svgRef} /> */}
                    <svg width="300" height="300" ref={svgRef} />
                  </Paper>
                </Grid>
                <Grid item xs={4} className="inventory">
                  <Paper elevation={1}>
                    <Typography>Inventory</Typography>
                    <Typography variant="body2" style={{marginBottom: 45}}>Percentage</Typography>
                    {totalInventory && 
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
                  <Paper elevation={1} className="chart">
                    <Typography>Total items Received and Released</Typography>
                    <div className="flex justify-space-between align-center">
                      <Typography variant="body2">Difference</Typography>
                    </div>
                     {receivedAndRelease && <ReceivedAndReleased data={receivedAndRelease} />}
                  </Paper>
                </Grid>
                <Grid item xs={4} className="inventory">
                  <Paper elevation={1} className="chart">
                    <Typography>Number of Items</Typography>
                    <Typography variant="body2">Descending</Typography>
                    {/* <HorizontalBarChart />
                    
                    NumberOfItems*/}
                    {receivedAndRelease && <NumberOfItems data={numberOfItems} />}
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