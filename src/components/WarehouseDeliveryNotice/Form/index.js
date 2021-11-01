/* eslint-disable react/prop-types */
import './style.scss';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { fetchTruckTypes, fetchClients } from 'actions/picklist';
import { fetchWarehouses } from 'actions/index';
import { truckTypes } from 'assets/static/index';

import Grid from '@mui/material/Grid';
import Dropzone from 'components/Dropzone';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import Spinner from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function DeliveryNoticeForm(props) {
  const classes = useStyles();
  const [externalDocs, setExternalDocs] = React.useState([]);
  const [appointmentDocs, setAppointmentDocs] = React.useState([]);
  const [hasChanged, setHasChanged] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [hasFilesChange, setHasFilesChange] = React.useState(false);
  const [hasDefaultValue, setHasDefaultValue] = React.useState(false);
  const [deliveryNotice, setDeliveryNotice] = React.useState([]);
  
  // Hook Form
  const { handleSubmit, errors, control, formState, setValue, reset, getValues } = useForm({
    shouldFocusError: false,
    mode: 'onChange'
  });

  const { isDirty, isValid } = formState;

  /*
   * Set initial values if action is Edit Warehouse
   */
  useEffect(() => {
    if (props.deliveryNotice) {
      setHasDefaultValue(true);
      const bookingDatetime = new Date(props.deliveryNotice.booking_datetime);
      const appointedDatetime = new Date(props.deliveryNotice.appointment_datetime);
      const bookingDate = bookingDatetime.toISOString().substring(0, 10);
      const bookingTime = bookingDatetime.toISOString().substring(11,16);
      const appointedDate = appointedDatetime.toISOString().substring(0, 10);
      const appointedTime = appointedDatetime.toISOString().substring(11,16);
      let deliveyNoticeDetails = [
        ['warehouseClient', props.deliveryNotice.warehouse_client],
        ['transactionType', props.deliveryNotice.transaction_type],
        ['bookingDate', bookingDate],
        ['bookingTime', bookingTime],
        ['appointedDate', appointedDate],
        ['appointedTime',appointedTime],
        ['deliveryMode', props.deliveryNotice.delivery_mode],
        ['typeOfTrucks', props.deliveryNotice.asset_type],
        ['quantityOfTruck', props.deliveryNotice.qty_of_trucks],
        ['bookingNumber', props.deliveryNotice.job_order_number],
        ['externalReferenceNumber', props.deliveryNotice.external_reference_number],
        ['operationType', props.deliveryNotice.operation_type],
        ['projectTeam', props.deliveryNotice.project_team],
        ['subconForwarderSupplier', props.deliveryNotice.subcon_forwarder_supplier],
        ['wbsCode', props.deliveryNotice.wbs_code],
        ['ccidWoPo', props.deliveryNotice.ccid_wo_po]
      ];

      deliveyNoticeDetails.forEach(w => { if (w[1]) setValue(w[0], w[1]) });
      if (Array.isArray(deliveryNotice)) setDeliveryNotice(props.deliveryNotice);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.deliveryNotice]);

  /*
   * Get addional picklist data
   */
  React.useEffect(() => {
    if (!props.clients.length) {
      props.fetchClients();
    } else if (!props.editMode) {
      props.fetchWarehouses();
    }

    if (props.deliveryNotice && props.editMode && props.clients.length)  {
      setTimeout(() => { props.fetchWarehouses() }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.clients, props.deliveryNotice]);

  // Set warehouse count and remove spinner when data fetch is done
  React.useEffect(() => {
    if (props.warehouses instanceof Object && props.warehouses.constructor === Object) {
      setOpenBackdrop(false);
      
      if (props.editMode && getValues("warehouse").constructor === String) {
        setValue('warehouse', props.deliveryNotice.warehouse_name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.warehouses]);
  
  /*
   * Submit form data if values are valid
   */
  const __submit = data => {
    if (isValid || hasDefaultValue) {
      const newData = {
        ...data,
        externalDocs,
        appointmentDocs
      }
      props.onSubmit(newData);
      console.log(newData)
    } else {
      props.onError(data);
    }
  }

  return (
    <form onSubmit={handleSubmit(__submit)}>
      <div className="paper__section delivery-notice-form">
        <Typography variant="subtitle1" className="paper__heading">General Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <label className="paper__label">Warehouse Client</label>
            <Controller
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  defaultValue=""
                  displayEmpty={true}>
                  {
                    !props.clients ? null :
                    props.clients.map(client => {
                      return <MenuItem key={client.Id} value={client.name}>{client.name}</MenuItem>
                    })
                  } 
                </Select>
              }
              control={control}
              name="warehouseClient"
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.warehouseClient && <FormHelperText error>{errors.warehouseClient.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={12}>
            <label className="paper__label">Warehouse</label>
            <Controller
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  defaultValue=""
                  displayEmpty={true}>
                  {
                    !props.warehouses ? null :
                    Object.values(props.warehouses).map(warehouse => {
                      return <MenuItem key={warehouse.warehouse_id} value={warehouse.warehouse_client}>{warehouse.warehouse_client}</MenuItem>
                    })
                  } 
                </Select>
              }
              control={control}
              name="warehouse"
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.warehouse && <FormHelperText error>{errors.warehouse.message}</FormHelperText>}
          </Grid>
          <Grid item xs={6} md={6}>
            <label className="paper__label">Transaction Type</label>
            <Controller
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  defaultValue=""
                  displayEmpty={true}>
                  <MenuItem value="Inbound">Inbound</MenuItem>
                  <MenuItem value="Outbound">Outbound</MenuItem>
                </Select>
              }
              control={control}
              name="transactionType"
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.transactionType && <FormHelperText error>{errors.transactionType.message}</FormHelperText>}
          </Grid>
          <Grid item xs={3} md={3}>
            <label className="paper__label">Booking Date</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="date"
                  required
                  fullWidth
                />
              }
              name="bookingDate"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.bookingDate && <FormHelperText error>{errors.bookingDate.message}</FormHelperText>}
          </Grid>
          <Grid item xs={3} md={3}>
            <label className="paper__label">Booking Time</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="time"
                  required
                  fullWidth
                />
              }
              name="bookingTime"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.bookingTime && <FormHelperText error>{errors.bookingTime.message}</FormHelperText>}
          </Grid>
          <Grid item xs={3} md={3}>
            <label className="paper__label">Appointed Date</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="date"
                  required
                  fullWidth
                />
              }
              name="appointedDate"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.appointedDate && <FormHelperText error>{errors.appointedDate.message}</FormHelperText>}
          </Grid>
          <Grid item xs={3} md={3}>
            <label className="paper__label">Appointed Time</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="time"
                  required
                  fullWidth
                />
              }
              name="appointedTime"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.appointedTime && <FormHelperText error>{errors.appointedTime.message}</FormHelperText>}
          </Grid>
          <Grid item xs={6} md={6}>
            <label className="paper__label">Delivery Mode</label>
            <Controller
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  defaultValue=""
                  displayEmpty={true}>
                  <MenuItem value="Batch">Batch</MenuItem>
                  <MenuItem value="Single">Single</MenuItem>
                </Select>
              }
              control={control}
              name="deliveryMode"
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.deliveryMode && <FormHelperText error>{errors.deliveryMode.message}</FormHelperText>}
          </Grid>
          <Grid item xs={6} md={6}>
            <label className="paper__label">Type of trucks</label>
            <Controller
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  defaultValue=""
                  displayEmpty={true}>
                  {
                    !truckTypes ? null :
                    truckTypes.map(truck => {
                      return <MenuItem key={truck.Id} value={truck.Description}>{truck.Description}</MenuItem>
                    })
                  } 
                </Select>
              }
              control={control}
              name="typeOfTrucks"
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.typeOfTrucks && <FormHelperText error>{errors.typeOfTrucks.message}</FormHelperText>}
          </Grid>
          <Grid item xs={6} md={6}>
            <label className="paper__label">Quantity of Truck</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="number"
                  required
                  InputProps={{ 
                    inputProps: { min: 0 }
                  }}
                  fullWidth
                />
              }
              name="quantityOfTruck"
              control={control}
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.quantityOfTruck && <FormHelperText error>{errors.quantityOfTruck.message}</FormHelperText>}
          </Grid>
        </Grid>
        <Typography variant="subtitle1" className="paper__heading" style={{marginTop: 45}}>External Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <label className="paper__label">Booking Number</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
                  required
                  fullWidth
                />
              }
              name="bookingNumber"
              control={control}
              rules={{ 
                required: "This field is required"
              }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.bookingNumber && <FormHelperText error>{errors.bookingNumber.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={12}>
            <label className="paper__label">External Reference Number</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
                  required
                  fullWidth
                />
              }
              name="externalReferenceNumber"
              control={control}
              rules={{ 
                required: "This field is required",
              }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.externalReferenceNumber && <FormHelperText error>{errors.externalReferenceNumber.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={12}>
            <label className="paper__label">Operation Type</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
                  required
                  fullWidth
                />
              }
              name="operationType"
              control={control}
              rules={{ 
                required: "This field is required"
              }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.operationType && <FormHelperText error>{errors.operationType.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={12}>
            <label className="paper__label">Project Team</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
                  required
                  fullWidth
                />
              }
              name="projectTeam"
              control={control}
              rules={{ 
                required: "This field is required"
              }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.projectTeam && <FormHelperText error>{errors.projectTeam.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={12}>
            <label className="paper__label">Subcon/Forwarder/Supplier</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
                  required
                  fullWidth
                />
              }
              name="subconForwarderSupplier"
              control={control}
              rules={{ 
                required: "This field is required"
              }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.subconForwarderSupplier && <FormHelperText error>{errors.subconForwarderSupplier.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={12}>
            <label className="paper__label">WMS Code</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
                  required
                  fullWidth
                />
              }
              name="wbsCode"
              control={control}
              rules={{ 
                required: "This field is required"
              }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.wbsCode && <FormHelperText error>{errors.wbsCode.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={12}>
            <label className="paper__label">CCID/WO/PO</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
                  required
                  fullWidth
                />
              }
              name="ccidWoPo"
              control={control}
              rules={{ 
                required: "This field is required"
              }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.ccidWoPo && <FormHelperText error>{errors.ccidWoPo.message}</FormHelperText>}
          </Grid>
        </Grid>
      </div>
      <div className="paper__section documents__dropzone">
        <Typography variant="subtitle1" className="paper__heading">External Documents</Typography>
        <Dropzone
          documentCount={externalDocs[externalDocs.length - 1]}
          type="files"
          data="External Document"
          defaultFiles={deliveryNotice}
          onDelete={() => {
            setHasChanged(true);
            setHasFilesChange(true);
          }}
          onDrop={() => {
            setHasChanged(true);
            setHasFilesChange(true);
          }}
          onChange={(files) => {
            setExternalDocs([...externalDocs, files])
          }}
          showPreviews
          showPreviewsInDropzone={false}
          text="Drag and drop a file here or click"
        />
      </div>
      <div className="paper__section documents__dropzone">
        <Typography variant="subtitle1" className="paper__heading">Appointment Confirmation</Typography>
        <Dropzone
          documentCount={appointmentDocs[appointmentDocs.length - 1]}
          type="files"
          data="Appointment Confirmation"
          defaultFiles={deliveryNotice}
          onDelete={() => {
            setHasChanged(true);
            setHasFilesChange(true);
          }}
          onDrop={() => {
            setHasChanged(true);
            setHasFilesChange(true);
          }}
          onChange={(files) => {
            setAppointmentDocs([...appointmentDocs, files])
          }}
          showPreviews
          showPreviewsInDropzone={false}
          text="Drag and drop a file here or click"
        />
      </div>
      { (isDirty || hasChanged) &&
        <div className="form__actions-container">
          <div className="form__actions">
            <p>Save this delivery notice?</p>
            <div className="form__btn-group">
              <Button
                type="button"
                className="btn btn--invert"
                style={{ marginRight: 10 }}
                onClick={() => {
                  setHasChanged(false);
                  if (props.warehouse) reset();
                  props.handleDialog(hasFilesChange);
                }}>
                Cancel
              </Button>
              <Button type="submit" className="btn btn--emerald">Save</Button>
            </div>
          </div>
        </div>
      }
      <Spinner className={classes.backdrop} open={openBackdrop} >
        <CircularProgress color="inherit" />
      </Spinner>
    </form>
  )
};

const mapStateToProps = state => {
  return {
    clients: state.picklist.clients,
    warehouses: state.warehouses.data
  }
}

export default connect(mapStateToProps, { fetchWarehouses, fetchTruckTypes, fetchClients })(DeliveryNoticeForm);