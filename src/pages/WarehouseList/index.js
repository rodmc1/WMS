import './style.scss';
import React from 'react';
import history from 'config/history';
import { connect } from 'react-redux';
import { fetchWarehouseByName, fetchWarehouses } from 'actions/index';
import { Button } from '@material-ui/core'
import Breadcrumbs from 'components/Breadcrumbs';
import Table from 'components/Table';
import { CSVLink, CSVDownload } from "react-csv";

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
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
  const [open, setOpen] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(true);
  const [query, setQuery] = React.useState(null);
  const [csvData, setCsvData] = React.useState([]);
  const classes = useStyles();
  const csvLink = React.useRef();
  const routes = [
    {
      label: 'Warehouse List',
      path: '/warehouse-list'
    }
  ];

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

  const getWarehousesData = () => {
    // 'api' just wraps axios with some setting specific to our app. the important thing here is that we use .then to capture the table response data, update the state, and then once we exit that operation we're going to click on the csv download link using the ref
    // await api.post('/api/get_transactions_table', { game_id: gameId })
    //   .then((r) => setCsvData(r.data))
    //   .catch((e) => console.log(e))
    csvLink.current.link.click();
  }

  const handleCreateWarehouse = () => {
    history.push('/warehouse-create');
  }

  const handleSearchOpen = () => {
    console.log('handleSearchOpen');
  }

  const handleSubmit = () => {
    props.fetchWarehouseByName(query);
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

  const onSelectSearchItem = (id) => {
    history.push(`/warehouse-list/overview/${id}`);
  }

  const handleDownloadCSV = () => {
    console.log('here')
  }

  React.useEffect(() => {
    if (props.warehouses.count) {
      setOpenBackdrop(false);
      setCsvData([
        { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
        { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
        { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
      ])
    }
  }, [props.warehouses.data]);

  React.useEffect(() => {
    if (props.location.success) {
      setOpen(true);
    }
  },[]);

  return (
    <div className="container">
      <div className="flex justify-space-between align-center">
        <Breadcrumbs routes={routes} />
        <div className="button-group">
          <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginRight: 10 }} onClick={() => handleDownloadCSV()}>Download CSV</Button>
          <CSVLink data={csvData} filename={"warehouses.csv"} className="hidden_csv">Download CSV</CSVLink>
          <Button variant="contained" className="btn btn--emerald" onClick={() => handleCreateWarehouse()} disableElevation>Create Warehouse</Button>
        </div>
      </div>
      <Table
        config={config}
        data={props.warehouses.data}
        total={props.warehouses.count}
        onInputChange={(e) => setQuery(e)}
        onSubmit={handleSubmit}
        onSearchOpen={handleSearchOpen}
        onPaginate={handlePagination}
        onRowClick={handleRowClick}
        onSelectSearchItem={onSelectSearchItem}
        searchedOptions={props.searched}
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