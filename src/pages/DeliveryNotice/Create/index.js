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
import { uploadDeliveryNoticeFilesById, createDeliveryNotice } from 'actions/index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';

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
  const [created, setCreated] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [status, setStatus] = React.useState({ notice: false, appointedDocuments: false, externalDocuments: false });

  /**
   * Breadcrumbs routes
   */
  const routes = [
    { label: 'Delivery Notice', path: '/delivery-notice' },
    { label: 'Creating Delivery Notice', path: '/delivery-notice/create' }
  ];

  /**
   * Submit function for creating delivery notice
   * 
   * @param {object} data Set of new delivery notice data
   */
  const handleSubmit = data => {
    setAlertConfig({ severity: 'info', message: 'Creating delivery notice...' });
    setOpenSnackBar(true);

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
      remarks: data.remarks,
    }

    console.log(deliveryNotice);

    // Invoke action for create delivery notice
    createDeliveryNotice(deliveryNotice)
      .then(response => {
        const id = response.data.id;
        if (response.status === 201) setStatus(prevState => { return {...prevState, notice: true }});

        if (data.externalDocs.length > 1)  {
          handleWarehouseFilesUpload(id, data.externalDocs[data.externalDocs.length - 1], 'External Documents')
        } else {
          setStatus(prevState => { return {...prevState, externalDocuments: true }});
        }

        if (data.appointmentDocs.length > 1)  {
          handleWarehouseFilesUpload(id, data.appointmentDocs[data.appointmentDocs.length - 1], 'Appointed Documents')
        } else {
          setStatus(prevState => { return {...prevState, appointedDocuments: true }});
        }
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }
  
  /**
   * Show dialog confirmation if user click cancel in create form
   */
  const handleDialog = () => {
    setOpenDialog(state => ({...state, open: true}));
  }

  /**
   * Function for files upload
   * 
   * @param {int} id ID of newly created delivery notice
   * @param {array} data Array of files to be uploaded
   */
  const handleWarehouseFilesUpload = (id, data, type) => {
    uploadDeliveryNoticeFilesById(id, data, type)
      .then(res => {
        if (res.status === 201) {
          if (type === "External Documents") setStatus(prevState => { return {...prevState, externalDocuments: true }});
          if (type === "Appointed Documents") setStatus(prevState => { return {...prevState, appointedDocuments: true }});
        };
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }

  /**
   * Redirect to Delivery notice list with success message
   */
   if (created) {
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
      setCreated(true);
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

  return (
    <div className="container">
      <Breadcrumbs routes={routes} />
      <Grid container spacing={2}
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
        <Grid item xs={12} md={3}>
          <WarehouseSideBar id={props.match.params.id} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className="paper" elevation={0} variant="outlined">
            <Typography variant="subtitle1" className="paper__heading">Creating Delivery Notice</Typography>
            <div className="paper__divider" />
            <WarehouseForm handleDialog={handleDialog} onSubmit={handleSubmit} onError={handleError} />
          </Paper>
        </Grid>
        <Snackbar open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
        {/* <WarehouseDialog
          openDialog={openDialog.open}
          diaglogText="Changes won't be save, continue?"
          dialogTitle="Confirmation"
          buttonConfirmText="Yes"
          buttonCancelText="No"
          dialogAction={() => history.push('/')}
        /> */}
      </Grid>
    </div>
  )
}

/**
 * Redux states to component props
 */
const mapStateToProps = state => {
  return { 
    error: state.error
  }
};

export default connect(mapStateToProps)(DeliveryNoticeCreate);