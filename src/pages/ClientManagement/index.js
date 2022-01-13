import './style.scss';
import React from 'react';
import history from 'config/history';
import _ from 'lodash';
import { connect, useDispatch } from 'react-redux';
import { fetchWarehouseByName, fetchWarehouses, fetchAllWarehouse } from 'actions';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { CSVLink } from "react-csv";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Spinner from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Breadcrumbs from 'components/Breadcrumbs';
import Table from 'components/Table';
import Button from '@mui/material/Button';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ClientManagement(props) {
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [warehouseData, setWarehouseData] = React.useState(null)
  const [open, setOpen] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const [csvData, setCsvData] = React.useState([]);
  const dispatch = useDispatch();
  const csvLink = React.useRef();
  const [searched, setSearched] = React.useState(null);
  const [rowCount, setRowCount] = React.useState(0);
  const [page, setPage]= React.useState(10);
  const [warehouseCount, setWarehouseCount] = React.useState(0);
  const routes = [
    {
      label: 'Client Management',
      path: '/client-management'
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
      { label: 'ID', key: 'client_id' },
      { label: 'Company', key: 'client' },
      { label: 'Status', key: 'client_status' },
      { label: 'Number of SKU', key: 'sku_number' },
      { label: 'Country', key: 'country' }
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
  const handleCreateClient = () => {
    history.push('/client-management/create');
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
  console.log(warehouseData)

  React.useEffect(() => { 
    if (JSON.stringify(warehouseData) === '{}') {
      setOpenBackdrop(false);
    }
    if (warehouseData !== null) {
      if (!warehouseData.length) setOpenBackdrop(false);
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

  // Set warehouse count and remove spinner when data fetch is done
  React.useEffect(() => {
    if (props.warehouses.count) {
      setWarehouseCount(props.warehouses.count)
      setOpenBackdrop(false);
    }
  }, [props.warehouses.count]);

  // Show snackbar alert when new warehouse is created
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
          <Button variant="contained" className="btn btn--emerald" style={{ marginRight: 10 }} onClick={handleCreateClient} disableElevation>Create Client</Button>
          <CSVLink data={csvData} filename="warehouses.csv" headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
          <Button variant="contained" className="btn btn--emerald" disableElevation onClick={handleDownloadCSV}>Download CSV</Button>
        </div>
      </div>
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
    warehouses: state.warehouses,
    searched: state.warehouses.search
  }
}

export default connect(mapStateToProps, { fetchWarehouses, fetchWarehouseByName })(ClientManagement);