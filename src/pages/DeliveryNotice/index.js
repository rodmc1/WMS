/* eslint-disable react/prop-types */
import './style.scss';
import _ from 'lodash';
import history from 'config/history';
import React, { useState, useRef } from 'react';
import { CSVLink } from "react-csv";
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { fetchDeliveryNotices, fetchDeliveryNoticeByName, fetchAllDeliveryNotice } from 'actions';

import Table from 'components/Table';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Spinner from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import Breadcrumbs from 'components/Breadcrumbs';
import CircularProgress from '@mui/material/CircularProgress';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function DeliveryNotice(props) {
  const csvLink = useRef();
  const dispatch = useDispatch();
  const [page, setPage]= useState(10);
  const [query, setQuery] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [searched, setSearched] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [deliveryNoticeCount, setDeliveryNoticeCount] = useState(0);
  const [deliveryNoticeData, setDeliveryNoticeData] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ severity: 'info', message: 'loading...' });
  const [searchLoading, setSearchLoading] = useState(false);
  const routes = [{ label: 'Delivery Notice', path: '/delivery-notice' }];

  // Table config
  const config = {
    rowsPerPage: 10,
    headers: [
      { label: 'ID', key: 'warehouse_id' },
      { label: 'Unique Code', key: 'unique_code' },
      { label: 'External Reference No.', key: 'external_reference_number' },
      { label: 'Warehouse Client', key: 'warehouse_client' },
      { label: 'Warehouse', key: 'warehouse_name' },
      { label: 'Transaction Type', key: 'transaction_type' },
      { label: 'Booking Date', key: 'booking_datetime' },
      { label: 'Appointed Date', key: 'appointment_datetime' },
      { label: 'Delivery Mode', key: 'delivery_mode' },
      { label: 'Type of Trucks', key: 'asset_type' },
      { label: 'Quantity of truck', key: 'qty_of_trucks' },
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
      props.fetchDeliveryNotices({
        count: rowsPerPage,
        after: page * rowsPerPage
      });
    }
  };

  // Fetch new data if search values was erased
  React.useEffect(() => {
    if (!query) {
      setSearchLoading(true);
      props.fetchDeliveryNotices({
        count: page || 10,
        after: page * rowCount
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [query]);

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const delayedQuery = React.useCallback(_.debounce((page, rowCount) => {
    setSearchLoading(true);
    props.fetchDeliveryNoticeByName({
      filter: query,
      count: rowCount,
      after: page * rowCount
    })
  }, 510), [query]);

  // Redirect to create warehouse page
  const handleCreateDeliveryNotice = () => {
    history.push('/delivery-notice/create');
  }

  // Redirect to selected warehouse
  const handleRowClick = row => {
    history.push({
      pathname: `/delivery-notice/${row.unique_code}/overview`,
      data: row
    });
  }

  // Function for CSV Download  
  const handleDownloadCSV = async () => {
    await fetchAllDeliveryNotice().then(response => {
      const newData = response.data.map(notice => {
        return {
          warehouse_name: notice.warehouse_name,
          warehouse_client: notice.warehouse_client,
          transaction_type: notice.transaction_type,
          unique_code: notice.unique_code,
          booking_datetime: notice.booking_datetime.slice(0, 10),
          appointment_datetime: notice.appointment_datetime.slice(0, 10),
          delivery_mode: notice.delivery_mode,
          asset_type: notice.asset_type,
          qty_of_trucks: notice.qty_of_trucks,
          external_reference_number: notice.external_reference_number,
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
    { label: "Unique Code", key: "unique_code" },
    { label: "External Reference No.", key: "external_reference_number" },
    { label: "Warehouse Client", key: "warehouse_client" },
    { label: "Warehouse", key: "warehouse_name" },
    { label: "Transaction Type", key: "transaction_type" },
    { label: "Booking Date", key: "booking_datetime" },
    { label: "Appointed Date", key: "appointment_datetime" },
    { label: "Delivery Mode", key: "delivery_mode" },
    { label: "Type of Trucks", key: "asset_type" },
    { label: "Quantity of truck", key: "qty_of_trucks" }
  ];

  /**
   * Call delayedQuery function when user search and set new delivery notice data
   */
  React.useEffect(() => {
    if (query) {
      delayedQuery(page, rowCount);
    } else if (!query) {
      setDeliveryNoticeData(props.notice.data);
      setDeliveryNoticeCount(props.notice.count);
      setSearchLoading(false);
    }
    return delayedQuery.cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [query, delayedQuery, page, rowCount, props.notice.count, props.notice.data]);

  /**
   * Set delivery notice data
   */
  React.useEffect(() => {
    if (props.notice.data) {
      setDeliveryNoticeData(props.notice.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.notice]);

  /**
   * Show snackbar alert when new delivery notice is created
   */
  React.useEffect(() => {
    if (props.location.success) {
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.location.success]);

  /**
   * Remove Spinner if data is done fetching with empty value
   */
  React.useEffect(() => { 
    if (JSON.stringify(deliveryNoticeData) === '{}') {
      setOpenBackdrop(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [deliveryNoticeData]);

  /**
   * Set searched values and delivery notice count after search
   */
  React.useEffect(() => {
    if (props.searched) {
      setSearched(props.searched.data);
      setDeliveryNoticeCount(props.searched.count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.searched]);

  /**
   * Set delivery notice count and remove spinner when data fetch is done
   */
  React.useEffect(() => {
    if (props.notice.count) {
      setDeliveryNoticeCount(props.notice.count)
      setOpenBackdrop(false);
    }
  }, [props.notice.count]);

  /**
   * Set new delivery notice data with searched items and remove spinner in textfield
   */
  React.useEffect(() => {
    if (searched) {
      setSearchLoading(false);
      setDeliveryNoticeData(searched);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [searched]);

  /**
   * Handler api errors
   */
   const handleError = () => {
    if (props.error.status === 401) {
      setAlertConfig({ severity: 'error', message: 'Session Expired, please login again...' });
    } else if (props.error.status === 500) {
      setAlertConfig({ severity: 'error', message: 'Internal Server Error' });
    } 
  }

  /**
   * Handle errors
   */
   React.useEffect(() => {
    if (!_.isEmpty(props.error)) {
      setOpenBackdrop(false);
      setOpen(true);
      handleError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.error]);

  return (
    <div className="container delivery-notice-container">
      <div className="flex justify-space-between align-center">
        <Breadcrumbs routes={routes} />
        <div className="button-group">
          <CSVLink data={csvData} filename="delivery_notice.csv" headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
          <Button variant="contained" className="btn btn--emerald" onClick={handleCreateDeliveryNotice} disableElevation>Create Delivery Notice</Button>
          <Button variant="contained" className="btn btn--emerald" disableElevation style={{ marginLeft: 10 }} onClick={handleDownloadCSV}>Download CSV</Button>
        </div>
      </div>
      <Table 
        config={config}
        data={deliveryNoticeData}
        total={deliveryNoticeCount}
        handleRowCount={handleRowCount}
        onPaginate={handlePagination}
        onRowClick={handleRowClick}
        query={query}
        searchLoading={searchLoading}
        onInputChange={onInputChange}
      />
      <Spinner sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} >
        <CircularProgress color="inherit" />
      </Spinner>
      <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        { !_.isEmpty(props.error) 
          ? <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
          : <Alert severity="success">{props.location.success}</Alert>
        }
      </Snackbar>
    </div>
  )
}

const mapStateToProps = state => {
  return { 
    error: state.error,
    notice: state.notice,
    searched: state.notice.search
  }
};

export default connect(mapStateToProps, { fetchDeliveryNotices, fetchDeliveryNoticeByName })(DeliveryNotice);