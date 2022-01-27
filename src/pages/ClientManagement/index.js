import './style.scss';
import React from 'react';
import history from 'config/history';
import _ from 'lodash';
import { connect, useDispatch } from 'react-redux';
import { fetchWarehouseByName, searchClient, fetchWarehouseClients, fetchAllWarehouseClient } from 'actions';
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
  const [clientData, setClientData] = React.useState(null)
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
      { label: 'ID', key: 'id' },
      { label: 'Company', key: 'client_name' },
      { label: 'Number of SKU', key: 'total_sku' },
      { label: 'Country', key: 'country' }
    ]
  }

  // CSV Headers
  const csvHeaders = [  
    { label: "Company", key: "companyName" },
    { label: "Number of SKU", key: "sku" },
    { label: "Country", key: "country" },
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
    props.searchClient({
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
      setClientData(props.clients.data);
      setWarehouseCount(props.clients.count);
      setSearchLoading(false);
    }
    return delayedQuery.cancel;
  }, [query, delayedQuery, page, rowCount, props.clients.count, props.clients.data]);

  // Fetch new data if search values was erased
  React.useEffect(() => {
    if (!query) {
      setSearchLoading(true);
      props.fetchWarehouseClients({
        count: page || 10,
        after: page * rowCount
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [query]);

  React.useEffect(() => { 
    if (JSON.stringify(clientData) === '{}') {
      setOpenBackdrop(false);
    }
  }, [clientData]);

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
      setClientData(searched);
    }
  }, [searched]);

  // Set warehouses data
  React.useEffect(() => {
    if (props.clients.data) {
      setClientData(props.clients.data);
    }
  }, [props.clients]);

  /*
   * Function for pagination when searching
   * @args Page num, rowsPerPage num
   */
  const handlePagination = (page, rowsPerPage) => {
    if (query) {
      delayedQuery(page, rowsPerPage);
    } else {
      props.fetchWarehouseClients({
        count: rowsPerPage,
        after: page * rowsPerPage
      });
    }
  };

  // Redirect to selected warehouse
  const handleRowClick = (row) => {
    history.push(`/client-management/${row.client_name}/overview`);
  }

  // Function for CSV Download  
  const handleDownloadCSV = async () => {
    await fetchAllWarehouseClient().then(response => {
      const newData = response.data.map(clientData => {
        return {
          companyName: clientData.client_name,
          sku: clientData.total_sku,
          country: clientData.country,
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
    if (props.clients.count) {
      setWarehouseCount(props.clients.count)
      setOpenBackdrop(false);
    }
  }, [props.clients.count]);

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
          <CSVLink data={csvData} filename="warehouse_clients.csv" headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
          <Button variant="contained" className="btn btn--emerald" disableElevation onClick={handleDownloadCSV}>Download CSV</Button>
        </div>
      </div>
      <Table
        config={config}
        data={clientData}
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
    clients: state.client,
    searched: state.client.search
  }
}

export default connect(mapStateToProps, { fetchWarehouseByName, fetchWarehouseClients, searchClient })(ClientManagement);