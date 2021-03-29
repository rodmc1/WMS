import React from 'react';
import history from 'config/history';
import { connect } from 'react-redux';
import { fetchWarehouses } from 'actions/index';
import { Button } from '@material-ui/core'
import Breadcrumbs from 'components/Breadcrumbs';
import Table from 'components/Table';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function WarehouseList(props) {
  const [open, setOpen] = React.useState(false);
  const routes = [
    {
      label: 'Warehouse List',
      path: '/warehouse-list'
    }
  ];

  React.useEffect(() => {
    if (props.location.success) {
      setOpen(true);
    }
  },[]);

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

  const handleDownloadCSV = () => {
    console.log('handleDownloadCSV');
  }

  const handleCreateWarehouse = () => {
    history.push('/warehouse-create');
  }

  const handleSearchOpen = () => {
    console.log('handleSearchOpen');
  }

  const setQuery = () => {
    console.log('setQuery');
  }

  const handleSubmit = () => {
    console.log('handleSubmit');
  }

  const handlePagination = (page, rowsPerPage) => {
    props.fetchWarehouses({
      count: rowsPerPage,
      after: page * rowsPerPage
    });
  };

  const handleRowClick = (row) => {
    history.push(`/warehouse-list/overview/${row.warehouse_id}`);
  }

  return (
    <div className="container">
      <div className="flex justify-space-between align-center">
        <Breadcrumbs routes={routes} />
        <div className="button-group">
          <Button variant="contained" className="btn btn--emerald" onClick={() => handleDownloadCSV()} disableElevation style={{ marginRight: 10 }}>Download CSV</Button>
          <Button variant="contained" className="btn btn--emerald" onClick={() => handleCreateWarehouse()} disableElevation>Create Warehouse</Button>
        </div>
      </div>
      <Table
        config={config}
        data={props.warehouses.data}
        total={props.warehouses.count}
        onInputChange={setQuery}
        onSubmit={handleSubmit}
        onSearchOpen={handleSearchOpen}
        onPaginate={handlePagination}
        onRowClick={handleRowClick}
      />
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity="success">{props.location.success}</Alert>
      </Snackbar>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    warehouses: state.warehouses
  }
}

export default connect(mapStateToProps, { fetchWarehouses })(WarehouseList);