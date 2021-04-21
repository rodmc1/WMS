import './style.scss';
import React from 'react';
import history from 'config/history';
import _ from 'lodash';
import { connect, useDispatch } from 'react-redux';
import { fetchWarehouseByName, fetchWarehouses, fetchAllWarehouse } from 'actions/index';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { CSVLink } from "react-csv";

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Breadcrumbs from 'components/Breadcrumbs';
import Table from 'components/Table';
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

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
  const [loading, setLoading] = React.useState(false);
  const [warehouseData, setWarehouseData] = React.useState(null)
  const [open, setOpen] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const [csvData, setCsvData] = React.useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const csvLink = React.useRef();
  const [searched, setSearched] = React.useState(null);
  const [rowCount, setRowCount] = React.useState(0);
  const [page, setPage]= React.useState(10);
  const [warehouseCount, setWarehouseCount] = React.useState(0);
  const routes = [
    {
      label: 'Warehouse List',
      path: '/warehouse-list'
    }
  ];

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

  const handleCreateWarehouse = () => {
    history.push('/warehouse-list/warehouse-create');
  }

  const onInputChange = (e) => {
    setSearched(null);
    setQuery(e.target.value);
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const delayedQuery = React.useCallback(_.debounce((page, rowCount) => {
    setLoading(true);
    props.fetchWarehouseByName({
      filter: query,
      count: rowCount,
      after: page * rowCount
    })
  }, 510), [query]);

  React.useEffect(() => {
    if (query) {
      delayedQuery(page, rowCount);
    } else if (!query) {
      setWarehouseData(props.warehouses.data);
      setWarehouseCount(props.warehouses.count);
      setLoading(false);
    }
    return delayedQuery.cancel;
  }, [query, delayedQuery, page, rowCount, props.warehouses.count, props.warehouses.data]);

  React.useEffect(() => {
    if (!query) {
      setLoading(true);
      props.fetchWarehouses({
        count: page || 10,
        after: page * rowCount
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [query]);

  React.useEffect(() => {
    if (props.searched) {
      setSearched(props.searched.data);
      setWarehouseCount(props.searched.count);
    }
  }, [props.searched]);

  React.useEffect(() => {
    if (searched) {
      setLoading(false);
      setWarehouseData(searched);
    }
  }, [searched]);

  React.useEffect(() => {
    if (props.warehouses.data) {
      setWarehouseData(props.warehouses.data);
    }
  }, [props.warehouses]);

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

  // Redirect to selected warehouse
  const handleRowClick = (row) => {
    history.push(`/warehouse-list/overview/${row.warehouse_client}`);
  }

  // Redirect to selected searched warehouse
  const onSelectSearchItem = (id) => {
    history.push(`/warehouse-list/overview/${id}`);
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
    }).catch((error) => {
      dispatchError(dispatch, THROW_ERROR, error);
    });

    csvLink.current.link.click();
  }

  React.useEffect(() => {
    if (props.warehouses.count) {
      setWarehouseCount(props.warehouses.count)
      setOpenBackdrop(false);
    }
  }, [props.warehouses.count]);

  React.useEffect(() => {
    if (props.location.success) {
      setOpen(true);
    }
  }, [props.location.success]);

  return (
    <div className="container">
      <div className="flex justify-space-between align-center">
        <Breadcrumbs routes={routes} />
        <div className="button-group">
          <CSVLink data={csvData} filename="warehouses.csv" headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
          <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginRight: 10 }} onClick={handleDownloadCSV}>Download CSV</Button>
          <Button variant="contained" className="btn btn--emerald" onClick={handleCreateWarehouse} disableElevation>Create Warehouse</Button>
        </div>
      </div>
      <Table
        config={config}
        data={warehouseData}
        total={warehouseCount}
        onInputChange={onInputChange}
        onPaginate={handlePagination}
        onRowClick={handleRowClick}
        onSelectSearchItem={onSelectSearchItem}
        handleRowCount={handleRowCount}
        searchedOptions={searched}
        query={query}
        searchLoading={loading}
      />
      <Backdrop className={classes.backdrop} open={openBackdrop} >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity="success">{props.location.success}</Alert>
      </Snackbar>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    warehouses: state.warehouses,
    searched: state.warehouses.search
  }
}

export default connect(mapStateToProps, { fetchWarehouses, fetchWarehouseByName })(WarehouseList);