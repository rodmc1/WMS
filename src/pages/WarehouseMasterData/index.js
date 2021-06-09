import React from 'react';
import _ from 'lodash';
import { fetchWarehouses, fetchWarehouseByName, fetchAllWarehouse } from 'actions';
import { connect, useDispatch } from 'react-redux';
import history from 'config/history';
import Breadcrumbs from 'components/Breadcrumbs';
import Table from 'components/Table';
import Button from '@material-ui/core/Button';
import Spinner from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { CSVLink } from "react-csv";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function WarehouseMasterData(props) {
  const classes = useStyles();
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const [rowCount, setRowCount] = React.useState(0);
  const [page, setPage]= React.useState(10);
  const [warehouseData, setWarehouseData] = React.useState(null);
  const [warehouseCount, setWarehouseCount] = React.useState(0);
  const [searched, setSearched] = React.useState(null);
  const [csvData, setCsvData] = React.useState([]);
  const dispatch = useDispatch();
  const csvLink = React.useRef();

  const config = {
    rowsPerPage: 10,
    headers: [
      { label: 'ID', key: 'warehouse_id' },
      { label: 'Warehouse', key: 'warehouse_client' },
      { label: 'Street Address', key: 'address' },
      { label: 'Country', key: 'country' }
    ] 
  }

  const routes = [
    {
      label: 'Warehouse Master Data',
      path: '/warehouse-master-data'
    }
  ];

  const handleRowCount = (page, rowsPerPage) => {
    setRowCount(rowsPerPage);
    setPage(page);
  };

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
    history.push(`/warehouse-master-data/${row.warehouse_client}/overview`);
  }

  // Set query state on input change
  const onInputChange = (e) => {
    setSearched(null);
    setQuery(e.target.value);
  }
  
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const delayedQuery = React.useCallback(_.debounce((page, rowCount) => {
    setSearchLoading(true);
    props.fetchWarehouseByName({
      filter: query,
      count: rowCount,
      after: page * rowCount
    })
  }, 510), [query]);

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
  }, [query, delayedQuery, page, rowCount, props.warehouses.count, props.warehouses.data]);


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
  
  React.useEffect(() => {
    props.fetchWarehouses({
      count: page || 10,
      after: page * rowCount
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  React.useEffect(() => {
    if (props.warehouses.count) {
      setWarehouseData(props.warehouses.data);
      setWarehouseCount(props.warehouses.count);
      setOpenBackdrop(false);
    }
  }, [props.warehouses]);


  return (
    <div className="container">
      <div className="flex justify-space-between align-center">
        <Breadcrumbs routes={routes} />
        <div className="button-group">
          <CSVLink data={csvData} filename="warehouses.csv" headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
          <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginRight: 10 }} onClick={handleDownloadCSV}>Download CSV</Button>
        </div>
      </div>
      <Table 
        config={config}
        data={warehouseData}
        total={warehouseCount}
        handleRowCount={handleRowCount}
        onPaginate={handlePagination}
        onRowClick={handleRowClick}
        query={query}
        searchLoading={searchLoading}
        onInputChange={onInputChange}
      />
      <Spinner className={classes.backdrop} open={openBackdrop} >
        <CircularProgress color="inherit" />
      </Spinner>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    warehouses: state.warehouses,
    searched: state.warehouses.search
  }
}

export default connect(mapStateToProps, { fetchWarehouses, fetchWarehouseByName })(WarehouseMasterData);