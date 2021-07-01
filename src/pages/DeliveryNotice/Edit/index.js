import _ from 'lodash';
import React from 'react';
import history from 'config/history';
import Breadcrumbs from 'components/Breadcrumbs';
import WarehouseDialog from 'components/WarehouseDialog';
import WarehouseForm from 'components/WarehouseDeliveryNotice/Form';
import WarehouseSideBar from 'components/WarehouseDeliveryNotice/SideBar';

import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { uploadDeliveryNoticeFilesById, updateDeliveryNoticeById, deleteDeliveryNoticeFilesById, fetchDeliveryNoticeByName } from 'actions/index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { CollectionsBookmarkOutlined } from '@material-ui/icons';

// Alerts
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/**
 * Functional component for creation of delivery notice
 */
function DeliveryNoticeCreate(props) {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = React.useState({ open: false });
  const [edited, setEdited] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [existingDeliveryNotice, setExistingDeliveryNotice] = React.useState('');
  const [existingExternalDocs, setExistingExternalDocs] = React.useState([]);
  const [existingAppointmentDocs, setExistingAppointmentDocs] = React.useState([]);
  const [status, setStatus] = React.useState({ notice: false, appointedDocuments: false, externalDocuments: false });

  /**
   * Breadcrumbs routes
   */
  const routes = [
    { label: 'Delivery Notice', path: '/delivery-notice' },
    { label: props.match.params.id, path: `/delivery-notice/${props.match.params.id}/overview` },
    { label: 'Editing Delivery Notice', path: `/delivery-notice/${props.match.params.id}/edit` }
  ];

  /**
   * Submit function for creating delivery notice
   * 
   * @param {object} data Set of new delivery notice data
   */
  const handleSubmit = data => {
    setAlertConfig({ severity: 'info', message: 'Saving changes...' });
    setOpenSnackBar(true);
    const id = existingDeliveryNotice.delivery_notice_id;
    const deliveryNotice = {
      warehouse_name: data.warehouse,
      warehouse_client: data.warehouseClient,
      transaction_type: data.transactionType,
      booking_datetime: new Date(data.bookingDate + " " + data.bookingTime).toLocaleString(),
      appointment_datetime: new Date(data.appointedDate + " " + data.appointedTime).toLocaleString(),
      delivery_mode: data.deliveryMode,
      type_of_trucks: data.typeOfTrucks,
      qty_of_trucks: Number(data.quantityOfTruck),
      job_order_number: data.bookingNumber,
      external_reference_number: data.externalReferenceNumber,
      operation_type: data.operationType,
      project_team: data.projectTeam,
      subcon_forwarder_supplier: data.subconForwarderSupplier,
      wbs_code: data.wbsCode,
      ccid_wo_po: data.ccidWoPo,
      remarks: null,
    }

    console.log(existingDeliveryNotice)

    // Invoke action for update delivery notice
    updateDeliveryNoticeById(existingDeliveryNotice.delivery_notice_id, deliveryNotice)
      .then(response => {
        setStatus(prevState => { return {...prevState, notice: true }});
        // setStatus(prevState => { return {...prevState, externalDocuments: true }});
        // setStatus(prevState => { return {...prevState, appointedDocuments: true }});
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });

      console.log(data.externalDocs);
      console.log(data.appointmentDocs)

    //Documents upload and delete
    if (data.externalDocs.length > 1)  {
      handleDocumentUpdate(id, data.externalDocs[data.externalDocs.length - 1], 'External Document')
    } else {
      setStatus(prevState => { return {...prevState, externalDocuments: true }});
    }

    if (data.appointmentDocs.length > 1)  {
      handleDocumentUpdate(id, data.appointmentDocs[data.appointmentDocs.length - 1], 'Appointment Confirmation')
    } else {
      setStatus(prevState => { return {...prevState, appointedDocuments: true }});
    }
  }
  
  /**
   * Show dialog confirmation if user click cancel in create form
   */
  const handleDialog = () => {
    setOpenDialog(state => ({...state, open: true}));
  }

  /**
   * Function for document updates
   * 
   * @param {int} id ID of newly created delivery notice
   * @param {array} data Array of files to be uploaded
   */
  const handleDocumentUpdate = (id, data, type) => {
    console.log(data)
    let existingDocuments;
    let arrayOfExistingDocuments;
    if (type === 'External Document' && existingExternalDocs !== undefined) existingDocuments = existingExternalDocs.delivery_notice_files;
    if (type === 'Appointment Confirmation' && existingAppointmentDocs !== undefined) existingDocuments = existingAppointmentDocs.delivery_notice_files;
    
    const newDocs = data.map(i => { return i.name });
    if (existingDocuments) {
      arrayOfExistingDocuments = existingDocuments.map(file => { return file.warehouse_filename });
      existingDocuments.forEach(file => {
        if (!newDocs.includes(file.warehouse_filename)) {
          deleteDeliveryNoticeFilesById(file.warehouse_documents_file_id);
        }
      });

      data.forEach(file => {
        if (!arrayOfExistingDocuments.includes(file.name)) {
          uploadDeliveryNoticeFilesById(id, data, type, existingDocuments.warehouse_documents_id)
        }
      });
    }

    if (!existingDocuments && data.length) {
      uploadDeliveryNoticeFilesById(id, data, type)
    }
    setStatus(prevState => { return {...prevState, appointedDocuments: true }});
    setStatus(prevState => { return {...prevState, externalDocuments: true }});
  }
  

  /**
   * Redirect to Delivery notice list with success message
   */
   if (edited) {
    history.push({
      pathname: '/delivery-notice',
      success: 'Successfuly saved'
    });
  }

  /**
   * Handler api errors
   */
  const handleError = () => {
    if (props.error.status === 401) {
      setAlertConfig({ severity: 'error', message: 'Session Expired, please login again...' });
    } else {
      setAlertConfig({ severity: 'error', message: props.error.data.type +': '+ props.error.data.message });
    }
  }

  /**
   * Set created status to true if all api response is success
   */
  React.useEffect(() => {
    if (!Object.values(status).includes(false)) {
      setEdited(true);
    }
  }, [status]);

  /**
   * Handle errors
   */
  React.useEffect(() => {
    if (!_.isEmpty(props.error)) {
      if (props.error === 'Network Error') {
        setAlertConfig({ severity: 'error', message: 'Network Error, please try again...' });
      } else {
        handleError();
      }
    }
  }, [props.error]);


  // Error Alert Configs
  React.useEffect(() => {
    if (!_.isEmpty(props.error)) {
      if (props.error === 'Network Error') {
        setAlertConfig({ severity: 'error', message: 'Network Error, please try again...' });
      } else if (props.error.status === 401) {
        setAlertConfig({ severity: 'error', message: 'Session Expired, please login again..' });
      } else {
        setAlertConfig({ severity: 'error', message: props.error.data.type +': '+ props.error.data.message });
      }
    }
  }, [props.error]);

  /**
   * Fetch request for selected delivery notice
   */
  React.useEffect(() => {
    const id = props.match.params.id;    
    if (id) props.fetchDeliveryNoticeByName(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.match.params.id]);

  /**
   * Set initial delivery notice data
   */
  React.useEffect(() => {
    if (props.notice) setOpenSnackBar(false);
    if (!existingDeliveryNotice && props.notice) {
      setExistingDeliveryNotice(props.notice);
    }
  }, [props.notice, existingDeliveryNotice]);

  React.useEffect(() => {
    if (existingDeliveryNotice !== null && existingDeliveryNotice.constructor.name === "Object") {
      if (Array.isArray(existingDeliveryNotice.delivery_notice_document_file_type)) {
        let externalDocument;
        let appointmentConfirmation;
        existingDeliveryNotice.delivery_notice_document_file_type.map(file => {
          if (file.description === 'External Document') externalDocument = file;
          if (file.description === 'Appointment Confirmation') appointmentConfirmation = file;
        })
        setExistingExternalDocs(externalDocument);
        setExistingAppointmentDocs(appointmentConfirmation);
      }
    }
  }, [existingDeliveryNotice]);

  console.log(existingDeliveryNotice)

  return (
    <div className="container">
      <Breadcrumbs routes={routes} />
      <Grid container spacing={2}
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
        <Grid item xs={12} md={3}>
          <WarehouseSideBar id={props.match.params.id} deleteId={existingDeliveryNotice && existingDeliveryNotice.delivery_notice_id} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className="paper" elevation={0} variant="outlined">
            <Typography variant="subtitle1" className="paper__heading">Editing Delivery Notice</Typography>
            <div className="paper__divider" />
            <WarehouseForm handleDialog={handleDialog} onSubmit={handleSubmit} onError={handleError} deliveryNotice={existingDeliveryNotice && existingDeliveryNotice} editMode />
          </Paper>
        </Grid>
        <Snackbar open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
        <WarehouseDialog
          openDialog={openDialog.open}
          diaglogText="Changes won't be save, continue?"
          dialogTitle="Confirmation"
          buttonConfirmText="Yes"
          buttonCancelText="No"
          dialogAction={() => history.push('/')}
        />
      </Grid>
    </div>
  )
}

/**
 * Redux states to component props
 */
const mapStateToProps = (state, ownProps) => {
  return { 
    error: state.error,
    notice: state.notice.data[ownProps.match.params.id]
  }
};

export default connect(mapStateToProps, { fetchDeliveryNoticeByName })(DeliveryNoticeCreate);