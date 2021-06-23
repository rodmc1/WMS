/* eslint-disable react/prop-types */
import './style.scss';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { Controller, useForm } from 'react-hook-form';
import { getWarehouseDetails } from './warehouseDetails';
import { fetchTruckTypes, fetchClients } from 'actions/picklist';
import { fetchWarehouseByName, fetchWarehouses, fetchAllWarehouse } from 'actions/index';

import validator from 'validator';
import Grid from '@material-ui/core/Grid';
import Dropzone from 'components/Dropzone';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';

function WarehouseForm(props) {
  const [externalDocs, setExternalDocs] = React.useState([]);
  const [appointmentDocs, setAppointmentDocs] = React.useState([]);
  const [hasChanged, setHasChanged] = React.useState(false);
  const [hasFilesChange, setHasFilesChange] = React.useState(false);
  const [hasDefaultValue, setHasDefaultValue] = React.useState(false);
  
  // Hook Form
  const { handleSubmit, errors, control, formState, setValue, reset } = useForm({
    shouldFocusError: false,
    mode: 'onChange'
  });

  const { isDirty, isValid } = formState;

  /*
   * Set option values in building types before setting initial value
   */
  React.useEffect(() => {
    if (props.building_types && props.warehouse) {
      setValue('buildingType', props.warehouse.building_type);
    }
  }, [props.building_types, setValue, props.warehouse]);


  /*
   * Get addional picklist data
   */
  React.useEffect(() => {
    props.fetchTruckTypes();
    props.fetchClients();
  }, []);

  /*
   * Get addional picklist data
   */
  React.useEffect(() => {
    if (props.clients.length) props.fetchWarehouses();
  }, [props.clients]);
  
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
    } else {
      props.onError(data);
    }
  }

  console.log(props)

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
                    <MenuItem key={"test1"} value={"test2"}>{"Test5"}</MenuItem>
                    <MenuItem key={"test2"} value={"test2"}>{"Test6"}</MenuItem>
                    <MenuItem key={"test3"} value={"test2"}>{"Test7"}</MenuItem>
                    <MenuItem key={"test4"} value={"test2"}>{"Test8"}</MenuItem>
                    <MenuItem key={"test5"} value={"test2"}>{"Test9"}</MenuItem>
                    <MenuItem key={"test6"} value={"test2"}>{"Test10"}</MenuItem>
                    <MenuItem key={"test7"} value={"test2"}>{"Test11"}</MenuItem>
                    <MenuItem key={"test8"} value={"test2"}>{"Test12"}</MenuItem>
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
                    !props.truck_types ? null :
                    props.truck_types.map(truck => {
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
          data="Delivery Notice"
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
          data="Delivery Notice"
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
    </form>
  )
};

const mapStateToProps = state => {
  return {
    truck_types: state.picklist.truck_types,
    clients: state.picklist.clients,
    warehouses: state.warehouses.data,
  }
}

export default connect(mapStateToProps, { fetchWarehouses, fetchTruckTypes, fetchClients })(WarehouseForm);