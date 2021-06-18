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
import { fetchWarehouses, fetchWarehouseByName, fetchAllWarehouse } from 'actions';

import Table from 'components/Table';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import Breadcrumbs from 'components/Breadcrumbs';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import WarehouseDialog from 'components/WarehouseDialog';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function DeliveryNotice(props) {
  const csvLink = useRef();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage]= useState(10);
  const [query, setQuery] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [searched, setSearched] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [warehouseCount, setWarehouseCount] = useState(0);
  const [warehouseData, setWarehouseData] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const routes = [{ label: 'Delivery Notice', path: '/delivery-notice' }];

  // Table config
  const config = {
    rowsPerPage: 10,
    headers: [
      { label: 'ID', key: 'warehouse_id' },
      { label: 'Booking No.', key: 'warehouse_client' },
      { label: 'External Reference No.', key: 'address' },
      { label: 'Warehouse Client', key: 'warehouse_client' },
      { label: 'Warehouse', key: 'warehouse_name' },
      { label: 'Transaction Type', key: 'transaction_type' },
      { label: 'Booking Date', key: 'booking_date' },
      { label: 'Appointed Date', key: 'appointed_date' },
      { label: 'Delivery Mode', key: 'delivery_mode' },
      { label: 'Type of Trucks', key: 'truck_type' },
      { label: 'Quantity of truck', key: 'truck_qty' },
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
      props.fetchWarehouses({
        count: rowsPerPage,
        after: page * rowsPerPage
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const delayedQuery = React.useCallback(_.debounce((page, rowCount) => {
    setSearchLoading(true);
    props.fetchWarehouseByName({
      filter: query,
      count: rowCount,
      after: page * rowCount
    })
  }, 510), [query]);

  // Redirect to create warehouse page
  const handleCreateWarehouse = () => {
    history.push('/delivery-notice/create');
  }

  // Function for CSV Download  
  const handleDownloadCSV = async () => {
    await fetchAllWarehouse().then(response => {
      const newData = response.data.map(warehouse => {
        return {
          warehouseName: warehouse.warehouse_client,
          address: warehouse.address,
          gpsCoordinate: warehouse.gps_coordinate,
          country: warehouse.country,
          warehouseType: warehouse.warehouse_type,
          buildingType: warehouse.building_type,
          warehouseStatus: warehouse.warehouse_status,
          nearbyStation: warehouse.nearby_station,
          yearTop: warehouse.year_top,
          minLeaseTerms: warehouse.min_lease_terms,
          psf: warehouse.psf,
          floorArea: warehouse.floor_area,
          coveredArea: warehouse.covered_area,
          mezzanineArea: warehouse.mezzanine_area,
          openArea: warehouse.open_area,
          officeArea: warehouse.office_area,
          batteryChargingArea: warehouse.battery_charging_area,
          loadingAndUnloadingBays: warehouse.loading_unloading_bays,
          remarks: warehouse.remarks,
          facilitiesAndAmenities: warehouse.facilities_amenities
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

  return (
    <div className="container">
      <div className="flex justify-space-between align-center">
        <Breadcrumbs routes={routes} />
        <div className="button-group">
          <CSVLink data={csvData} filename="delivery_notice.csv" headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
          <Button variant="contained" className="btn btn--emerald" onClick={handleCreateWarehouse} disableElevation>Create Delivery Notice</Button>
          <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginLeft: 10 }} onClick={handleDownloadCSV}>Download CSV</Button>
        </div>
      </div>
      <Table 
        config={config}
        // data={warehouseData}
        total={warehouseCount}
        handleRowCount={handleRowCount}
        onPaginate={handlePagination}
        // onRowClick={handleRowClick}
        // query={query}
        // searchLoading={searchLoading}
        onInputChange={onInputChange}
      />
      {/* <Spinner className={classes.backdrop} open={openBackdrop} >
        <CircularProgress color="inherit" />
      </Spinner> */}
    </div>
  )
}

const mapStateToProps = state => {
  return { 
    error: state.error,
    warehouses: state.warehouses,
  }
};

export default connect(mapStateToProps, { fetchWarehouses })(DeliveryNotice);