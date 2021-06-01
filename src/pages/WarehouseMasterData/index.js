import React from 'react';
import { fetchWarehouses } from 'actions';
import { connect } from 'react-redux';
import history from 'config/history';
import Breadcrumbs from 'components/Breadcrumbs';
import Table from 'components/Table';
import Button from '@material-ui/core/Button';
import Spinner from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function WarehouseMasterData(props) {

  const classes = useStyles();
  const [openBackdrop, setOpenBackdrop] = React.useState(true);
  const [query, setQuery] = React.useState('');
  const [rowCount, setRowCount] = React.useState(0);
  const [page, setPage]= React.useState(10);
  const [warehouseData, setWarehouseData] = React.useState(null);
  const [warehouseCount, setWarehouseCount] = React.useState(0);

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
    // if (query) {
    //   delayedQuery(page, rowsPerPage);
    // } else {
      props.fetchWarehouses({
        count: rowsPerPage,
        after: page * rowsPerPage
      });
    // }
  };

  // Redirect to selected warehouse
  const handleRowClick = (row) => {
    history.push(`/warehouse-master-data/${row.warehouse_client}/overview`);
  }
  
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
          <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginRight: 10 }} onClick={() => {}}>Download CSV</Button>
        </div>
      </div>
      <Table 
        config={config}
        data={warehouseData}
        total={warehouseCount}
        handleRowCount={handleRowCount}
        onPaginate={handlePagination}
        onRowClick={handleRowClick}
      />
      <Spinner className={classes.backdrop} open={openBackdrop} >
        <CircularProgress color="inherit" />
      </Spinner>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    warehouses: state.warehouses
  }
}

export default connect(mapStateToProps, { fetchWarehouses })(WarehouseMasterData);