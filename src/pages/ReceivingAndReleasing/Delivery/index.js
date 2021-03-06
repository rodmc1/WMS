/* eslint-disable react/prop-types */
import './style.scss';
import _ from 'lodash';
import React, {  useState, useRef } from 'react';
import { CSVLink } from "react-csv";
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { createReceivingAndReleasing, uploadDocument, deleteDeliveryDocumentsById, fetchAllDocument, fetchReceivedDocumentType, fetchReceivingByCode, fetchDeliveryNoticeById, searchReceivingAndReleasing, fetchAllReceivingAndReleasingByCode, fetchAllReceivingAndReleasingById, searchDeliveryNoticeSKU, fetchAllWarehouseSKUs } from 'actions';

import Table from './table';
import Receiving from './Receiving';
import Cookie from 'universal-cookie';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MuiAlert from '@mui/material/Alert';
import Spinner from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import makeStyles from '@mui/styles/makeStyles';
import Breadcrumbs from 'components/Breadcrumbs';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import AttachedDocuments from './AttachedDocuments';

const cookie = new Cookie();

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles({
  dialogPaper: {
    minHeight: '92vh',
    maxHeight: '92vh',
  },
});

// Table config
const config = {
  rowsPerPage: 10,
  headers: [
    { label: 'ID', key: 'warehouse_id' },
    { label: 'No. of SKU', key: 'item_code' },
    { label: 'Container Van No.', key: 'external_code' },
    { label: 'Serial No.', key: 'external_reference_number' },
    { label: 'Trucker', key: 'trucker' },
    { label: 'Plate Number', key: 'plate_number'},
    { label: 'Driver', key: 'driver_name' },
    { label: 'Date & Time Start', key: 'date_in' },
    { label: 'Date & Time End', key: 'date_out' },
    { label: 'Notes', key: 'notes' },
    { label: ' ' },
  ]
}

function DeliveryList(props) {
  const csvLink = useRef();
  const [tableData, setTableData] = useState([]);
  const anchorRef = React.useRef(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [page, setPage]= useState(10);
  const [query, setQuery] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [searched, setSearched] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [deliveryNoticeData, setDeliveryNoticeData] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [alertConfig, setAlertConfig] = React.useState({ severity: 'info', message: 'loading...' });
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [addMode, setAddMode] = React.useState(false);
  const [receivingDialog, setReceivingDialog] = React.useState(false);
  const [receivingDialogData, setReceivingDialogData] = React.useState([]);
  const [itemCount, setItemCount] = useState([]);
  const [receivingAndReleasing, setReceivingAndReleasing] = useState(null);
  const [expectedItems, setExpectedItems] = useState(0);
  const [expectedTrucks, setExpectedTrucks] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState(null);
  const [openDocuments, setOpenDocuments] = useState(false);
  const rowsPerPage = config.rowsPerPage;

  const routes = [
    {
      label: 'Receiving & Releasing',
      path: '/receiving-and-releasing'
    },
    {
      label: props.match.params.id,
      path: `/d/receiving-and-releasing/${props.match.params.id}`
    }
  ];

  const handleAddDelivery = () => {
    setAddMode(true);
  };

  // Function for cancel action
  const handleCancel = () => {
    setOpenBackdrop(true);
    props.fetchAllReceivingAndReleasingById({
      count: rowsPerPage,
      after: page * rowCount,
      filter: props.match.params.id
    });
          
    setAddMode(false);
  }

  // Function for getting page and row count on table
  const handleRowCount = (page, rowsPerPage) => {
    setRowCount(rowsPerPage);
    setPage(page);
  };

  // Redirect to selected item
  const handleRowClick = row => {
    cookie.set('rowReceiveingReleasing', JSON.stringify(row))
    setReceivingDialogData(row)
    setReceivingDialog(true);
  }

  const handleModalClose = () => {
    setOpenBackdrop(true);
    props.fetchAllReceivingAndReleasingById({
      count: rowsPerPage,
      after: page * rowCount,
      filter: props.match.params.id
    });
    setReceivingDialog(false)
  }

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
      props.fetchAllReceivingAndReleasingById({
        count: rowsPerPage,
        after: page * rowCount,
        filter: props.match.params.id
      });
    }
  };

  /**
   * Fetch page data
   */ 
  const fetchRecivingData = async () => {
    await fetchReceivingByCode(props.match.params.id).then(response => {
      setReceivingAndReleasing(response.data[0])
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
  }

  /**
   * Fetch all documents
   */
  const fetchDeliveryDocuments = (id) => {
    fetchAllDocument(id)
    .then(res => {
      if (res.data[0]) {
        setUploadedDocuments(res.data[0].received_document_file_type);
      }
    }).catch(error => {
      dispatchError(dispatch, THROW_ERROR, error);
    });
  }

  const getExpectedTrucksAndItems = (data) => {
    let trucks = [];
    let items = [];
    let documentCount = 0;

    Object.entries(data).forEach(key => {
      documentCount += key[1].document_count;
      if (key[1].expected_trucks) {
        trucks.push((key[1].expected_trucks))
      }

      if (key[1].expected_items) {
        items.push((key[1].expected_items))
      }
    });

    setDocumentCount(documentCount);
    setExpectedItems(items[0] || 0);
    setExpectedTrucks(trucks[0] || 0);
  }

  // Fetch new data if search values was erased
  React.useEffect(() => {
    if (!receivingAndReleasing) {
      fetchRecivingData()
    }
  }, []);

  // Fetch new data if search values was erased
  React.useEffect(() => {
    if (!query) {
      setSearchLoading(true);
      props.fetchAllReceivingAndReleasingById({
        count: rowsPerPage,
        after: page * rowCount,
        filter: props.match.params.id
      });
      setSearchLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [query]);

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const delayedQuery = React.useCallback(_.debounce(() => {
    setSearchLoading(true);
    props.searchReceivingAndReleasing({
      code: props.match.params.id,
      filter: query,
    })
  }, 510), [query]);
  
  /**
   * Function for CSV Download
   */ 
  const handleDownloadCSV = async () => {
    await fetchAllReceivingAndReleasingByCode(props.match.params.id).then(response => {
      const newData = response.data.map(data => {
        return {
          recieved_id: data.recieved_id,
          unique_code: data.unique_code,
          trucker: data.trucker,
          driver_name: data.driver_name,
          transaction_type: data.transaction_type,
          status: data.status,
          plate_number: data.plate_number,
          date_in: data.date_in,
          date_out: data.date_out,
          serial_no: data.serial_no,
          container_van_no: data.container_van_no,
          notes: data.notes,
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
    { label: "Receiving ID", key: "recieved_id" },
    { label: "Container Van No.", key: "container_van_no" },
    { label: "Serial No.", key: "serial_no" },
    { label: "Trucker", key: "trucker" },
    { label: "Plate Number", key: "plate_number" },
    { label: "Driver", key: "driver_name" },
    { label: "Date & Time Start", key: "date_in" },
    { label: "Date & Time End", key: "date_out" },
    { label: "Notes", key: "notes" }
  ];

  /**
   * Submit function for creating delivery notice
   * 
   * @param {object} data Set of new delivery notice data
   */
  const handleSubmit = data => {
    setOpenSnackBar(false);
    setAlertConfig({ severity: 'info', message: 'Adding Delivery...' });
    setOpenSnackBar(true);
    
    const deliveryData = {
      delivery_notice_id: deliveryNoticeData.delivery_notice_id,
      trucker: data.trucker,
      plate_number: data.plateNumber,
      driver_name: data.driverName,
      datetime_in: data.dateStart,
      datetime_out: data.dateEnd,
      notes: data.notes,
      container_van_no: data.containerVanNumber,
      serial_no: data.serialNumber,
    }
    
    //Invoke action for adding receiving and releasing
    createReceivingAndReleasing(deliveryData)
      .then(response => {
        if (response.status === 201) {
          setAlertConfig({ severity: 'success', message: 'Successfuly saved' });
          setOpenBackdrop(true);
          props.fetchAllReceivingAndReleasingById({
            count: rowsPerPage,
            after: page * rowCount,
            filter: props.match.params.id
          });
          
          setAddMode(false);
        }
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }

  // Function for document updates
  const handleUploadDocument = (id, recievedId, type, files, existingFiles) => {
    setOpenBackdrop(true);
    setOpenSnackBar(false);
    if (existingFiles.length) {
      setAlertConfig({ severity: 'info', message: 'Saving Changes...' });
    } else {
      setAlertConfig({ severity: 'info', message: 'Uploading Document...' });
    }
    setOpenSnackBar(true);
    
    const newDocs = files.map(i => { return i.name });
    const existingDocuments = existingFiles.map(i => { return i.file_name });

    existingFiles.forEach(doc => {
      if (!newDocs.includes(doc.file_name)) {
        deleteDeliveryDocumentsById(doc.id)
          .then(response => {
            if (response.status === 204) {
              setAlertConfig({ severity: 'success', message: 'Successfuly saved' });
              props.fetchAllReceivingAndReleasingById({
                count: rowsPerPage,
                after: page * rowCount,
                filter: props.match.params.id
              });
              fetchDeliveryDocuments(receivingAndReleasing.delivery_notice_id);
            }
          })
          .catch(error => {
            const regex = new RegExp('P0001:');
            if (regex.test(error.response.data.message)) {
              return
            } else {
              dispatchError(dispatch, THROW_ERROR, error);
            }
        });
      }
    });

    files.forEach(file => {
      if (!existingDocuments.includes(file.name)) {
        uploadDocument(id, recievedId, type, [file])
          .then(response => {
            if (response.status === 201) {
              setAlertConfig({ severity: 'success', message: 'Successfuly saved' });
              props.fetchAllReceivingAndReleasingById({
                count: rowsPerPage,
                after: page * rowCount,
                filter: props.match.params.id
              });
              fetchDeliveryDocuments(receivingAndReleasing.delivery_notice_id);
            }
          })
          .catch(error => {
            const regex = new RegExp('P0001:');
            if (regex.test(error.response.data.message)) {
              return
            } else {
              dispatchError(dispatch, THROW_ERROR, error);
            }
          });
      }
    });
  }

  /**
   * Invoke alert with error message
   */
  const handleErrors = () => {
    setOpenSnackBar(true);
    setAlertConfig({ severity: 'error', message: 'Invalid SKU Value' });
  }

  /**
   * Call delayedQuery function when user search and set new sku data
   */
  React.useEffect(() => {
    if (query) {
      delayedQuery(page, rowCount);
    } else if (!query && deliveryNoticeData === null) {
      setDeliveryNoticeData(props.notice);
      setSearchLoading(false);
    }
    return delayedQuery.cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [query, delayedQuery, page, rowCount]);

  /**
   * Set delivery notice data
   */
  React.useEffect(() => {
    if (props.notice) {
      setDeliveryNoticeData(props.notice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.notice]);

  // Set searched values and warehouse count after search
  React.useEffect(() => {
    if (props.searched) {
      setSearched(props.searched.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.searched]);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    if (searched) {
      setTableData(searched)
      setSearchLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [searched]);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    props.fetchReceivedDocumentType()
  }, []);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    if (receivingAndReleasing) fetchDeliveryDocuments(receivingAndReleasing.delivery_notice_id)
  }, [receivingAndReleasing]);

  React.useEffect(() => {
    if (props.receivingAndReleasing && Array.isArray(tableData)) {
      setTableData(props.receivingAndReleasing.data);
      setItemCount(props.receivingAndReleasing.count);
      setSearchLoading(false);
    }

    if (props.receivingAndReleasing) {
      if (!addMode) getExpectedTrucksAndItems(props.receivingAndReleasing.data);
      setTableData(props.receivingAndReleasing.data);
      setItemCount(props.receivingAndReleasing.count);
      setOpenBackdrop(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.receivingAndReleasing]);

  React.useEffect(() => {
    if (!Array.isArray(tableData)) setOpenBackdrop(false);
  }, [tableData]);

  React.useEffect(() => {
    if (props.warehouse) fetchAllWarehouseSKUs({ warehouse_name: props.warehouse.warehouse_name })
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.warehouse]);

  React.useEffect(() => { 
    if (addMode) props.fetchDeliveryNoticeById(props.match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [addMode]);


  /**
   * Handler api errors
   */
   const handleError = () => {
    if (props.error.status === 401) {
      setAlertConfig({ severity: 'error', message: 'Session Expired, please login again...' });
    } else if (props.error.status === 500) {
      setAlertConfig({ severity: 'error', message: 'Internal Server Error' });
    } else {
      setAlertConfig({ severity: 'error', message: props.error.data.type +': '+ props.error.data.message });
    }
  }

  /**
   * Handle errors
   */
   React.useEffect(() => {
    if (!_.isEmpty(props.error)) {
      setOpenSnackBar(true);
      if (props.error === 'Network Error') {
        setAlertConfig({ severity: 'error', message: 'Network Error, please try again...' });
      } else {
        handleError();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.error]);

  return (
    <div className="container delivery-notice-receiving-container sku">
      <div className="flex justify-space-between align-center">
        <Breadcrumbs routes={routes} />
        <div className="button-group">
          <CSVLink data={csvData} filename="receiving-and-releasing.csv" headers={csvHeaders} ref={csvLink} className="hidden_csv" target='_blank' />
          <Button ref={anchorRef} aria-haspopup="true" onClick={handleAddDelivery} variant="contained" className="btn btn--emerald" disableElevation>Add Delivery</Button>
          <Button variant="contained" className="btn btn--emerald btn-csv" disableElevation onClick={handleDownloadCSV}>Download CSV</Button>
        </div>
      </div>
      {receivingAndReleasing && 
        <Grid container spacing={3} className="delivery-overview">
          <Grid item xs={2}>
            <Paper 
              elevation={1}
              title={receivingAndReleasing.warehouse_name}>
              <Typography>{receivingAndReleasing.warehouse_name}</Typography>
              <Typography variant="body2" display="block">
                Warehouse
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper 
              elevation={1}
              title={receivingAndReleasing.warehouse_client}>
              <Typography>{receivingAndReleasing.warehouse_client}</Typography>
              <Typography variant="body2" display="block">
                Warehouse Client
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper elevation={1}>
              <Typography>{receivingAndReleasing.transaction_type}</Typography>
              <Typography variant="body2" display="block">
                Transaction Type
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper elevation={1}>
              <Typography>{expectedTrucks}</Typography>
              <Typography variant="body2" display="block">
                Expected Trucks
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper elevation={1}>
              <Typography>{expectedItems}</Typography>
              <Typography variant="body2" display="block">
                Expected Items
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            <Paper elevation={1} onClick={() => setOpenDocuments(true)}>
              <Typography>{documentCount}</Typography>
              <Typography variant="body2" display="block">
                Documents Attached
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      }
      {openDocuments &&
        <AttachedDocuments
          data={uploadedDocuments}
          open={openDocuments}
          receivingAndReleasing={receivingAndReleasing}
          handleClose={() => setOpenDocuments(false)}
        />
      }
      <Table 
        config={config}
        defaultData={tableData}
        handleRowCount={handleRowCount}
        onPaginate={handlePagination}
        query={query}
        searchLoading={searchLoading}
        onInputChange={onInputChange}
        handleCancel={handleCancel}
        onSubmit={handleSubmit}
        onError={handleErrors}
        total={itemCount}
        addMode={addMode}
        onRowClick={handleRowClick}
        handleUploadDocument={handleUploadDocument}
        receivingAndReleasing={receivingAndReleasing}
      />
      <Dialog open={receivingDialog} onClose={handleModalClose} classes={{ paper: classes.dialogPaper }} maxWidth={'xl'} fullWidth aria-labelledby="form-dialog-title">
        <DialogContent >
          <Receiving receivingData={receivingDialogData} onClose={handleModalClose} />
        </DialogContent>
      </Dialog>
      <Spinner sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} >
        <CircularProgress color="inherit" />
      </Spinner>
      <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={openSnackBar} autoHideDuration={3000} onClose={() => setOpenSnackBar(false)}>
        <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
      </Snackbar>
    </div>
  )
}

/**
 * Redux states to component props
 */
const mapStateToProps = (state, ownProps) => {
  return { 
    error: state.error,
    searched: state.receiving_releasing.search,
    notice: state.notice.data[ownProps.match.params.id],
    sku: state.notice.sku,
    receivingAndReleasing: state.receiving_releasing,
  }
};

export default connect(mapStateToProps, { searchReceivingAndReleasing, fetchReceivedDocumentType, fetchAllReceivingAndReleasingById, fetchDeliveryNoticeById, searchDeliveryNoticeSKU })(DeliveryList);