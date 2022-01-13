import React, { useEffect } from 'react';
import _ from 'lodash';
import './style.scss';
import { connect } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { fetchClients, fetchUOM, fetchStorageType } from 'actions/picklist';
import Dropzone from 'components/Dropzone';
import ButtonGroup from 'components/_ButtonGroup';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import ImageIcon from '@mui/icons-material/Image';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

function WarehouseMasterDataSKUForm(props) {
  const [hasChanged, setHasChanged] = React.useState(false);
  const [hasFilesChange, setHasFilesChange] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [batchManagement, setBatchManagement] = React.useState(false);;
  const [expiryManagement, setExpiryManagement] = React.useState(false);
  const [SKU, setSKU] = React.useState([]);
  const [isClientFetched, setIsClientFetched] = React.useState(false)

  const { handleSubmit, errors, control, formState, setValue, getValues } = useForm({
    shouldFocusError: false,
    mode: 'onTouched'
  });

  const formActionModal = document.querySelector('.form__actions-container');

  const { isDirty } = formState;

  const handleManagement = (status, id) => {
    if (id === 'batch-management') setBatchManagement(status);
    if (id === 'expiry-management') setExpiryManagement(status);
    setHasChanged(true);
  }
  
  const __submit = data => {
    data.batchManagement = batchManagement;
    data.expiryManagement = expiryManagement;
    data.images = images;

    if (_.isEmpty(errors)) {
      props.onSubmit(data);
    } else {
      console.log(errors);
    } 
  }

  /*
   * Set initial values if action is Edit Warehouse
   */
  useEffect(() => {
    if (props.sku) {
      let SKUDetails = [
        ['productName', props.sku.product_name],
        ['code', props.sku.item_code],
        ['externalCode', props.sku.external_code],
        ['minQuantity', props.sku.min_qty ? props.sku.min_qty : '0'],
        ['maxQuantity', props.sku.max_qty ? props.sku.max_qty : '0'],
        ['valuePerHandling', props.sku.value_per_unit ? props.sku.value_per_unit : '0'],
        ['length', props.sku.length ? props.sku.length : '0'],
        ['width', props.sku.width ? props.sku.width : '0'],
        ['height', props.sku.height ? props.sku.height : '0'],
        ['weight', props.sku.weight ? props.sku.weight : '0'],
        ['storageType', props.sku.storage_type],
        ['unitOfMeasurement', props.sku.uom_description],
        ['unitOfHandling', props.sku.unit_of_handling],
        ['remarks', props.sku.remarks]
      ];

      setSKU(props.sku);
      SKUDetails.forEach(w => {
        if (w[1]) setValue(w[0], w[1]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.sku]);

  React.useEffect(() => {
    if (SKU) {
      setBatchManagement(SKU.batch_management);
      setExpiryManagement(SKU.expiry_management);
    }
  }, [SKU]);

  /*
   * Get addional picklist data
   */
  React.useEffect(() => {
    if (!props.clients.length) {
      props.fetchClients();
    }
    props.fetchUOM();
    props.fetchStorageType();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  React.useEffect(() => {
    if (props.clients.length) {
      setIsClientFetched(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.clients]);

  React.useEffect(() => {
    onChangeHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
  const [code, setCode] = React.useState(null)
  const onChangeHandler = event => {
    setInterval(function(){ setCode(getValues('productName') + '-' + getValues('externalCode'))  }, 1000);
  };

  return (
    <form onSubmit={handleSubmit(__submit)} className="sku-form">
      <div className="paper__section">
        <Grid container spacing={2}>
          <Grid item xs={12} md={1}>
            <ListItem style={{ paddingLeft: 3}}>
              <ListItemAvatar style={{ position: 'relative' }}>
                <Avatar style={{height: 64, width: 64}}>
                  <ImageIcon />
                </Avatar>
                <Avatar style={{top: 40, right: 0, height: 15, width: 15, position: 'absolute'}}>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
            </ListItem>
          </Grid>
          <Grid item xs={12} md={7}>
            <label className="paper__label">Company Name</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0, step: .01 },
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }} />
              }
              name="length"
              control={control}
              required
              defaultValue=""
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {errors.length && <FormHelperText error>{errors.length.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Status</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0, step: .01 },
                  startAdornment: <InputAdornment position="start">&#8369;</InputAdornment>,
                }} />
              }
              name="valuePerHandling"
              control={control}
              defaultValue=""
              required
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {errors.valuePerHandling && <FormHelperText error>{errors.valuePerHandling.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="paper__label">Unit of Measurement</label>
            <Controller
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  required
                  displayEmpty={true}
                > 
                  {
                    !props.uom ? null :
                    props.uom.map(type => {
                      return <MenuItem key={type.Id} value={type.Description}>{type.Description}</MenuItem>
                    })
                  } 
                </Select>
              }
              control={control}
              name="unitOfMeasurement"
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.uom && <FormHelperText error>{errors.uom.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="paper__label">UOH per UOM</label>
            <Controller
              as={
                <TextField 
                disabled
                fullWidth
                variant="outlined"
                type="number"
                style={{backgroundColor: '#F2F2F2'}}
                InputProps={{
                  inputProps: { min: 0, step: .01 },
                }} />
              }
              name="UOHPerUOM"
              control={control}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.UOHPerUOM && <FormHelperText error>{errors.UOHPerUOM.message}</FormHelperText>}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <label className="paper__label">Length</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0, step: .01 },
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }} />
              }
              name="length"
              control={control}
              required
              defaultValue=""
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {errors.length && <FormHelperText error>{errors.length.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={3}>
            <label className="paper__label">Width</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0, step: .01 },
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }} />
              }
              name="width"
              control={control}
              required
              defaultValue=""
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {errors.width && <FormHelperText error>{errors.width.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={3}>
            <label className="paper__label">Height</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0, step: .01 },
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }} />
              }
              name="height"
              required
              control={control}
              defaultValue=""
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {errors.height && <FormHelperText error>{errors.height.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={3}>
            <label className="paper__label">Weight</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0, step: .01 },
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }} />
              }
              name="weight"
              control={control}
              required
              defaultValue=""
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {errors.weight && <FormHelperText error>{errors.weight.message}</FormHelperText>}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Storage Type</label>
            <Controller
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  required
                  displayEmpty={true}
                > 
                  {
                    !props.storage_type ? null :
                    props.storage_type.map(type => {
                      return <MenuItem key={type.Id} value={type.Description}>{type.Description}</MenuItem>
                    })
                  } 
                </Select>
              }
              control={control}
              name="storageType"
              required
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.storageType && <FormHelperText error>{errors.storageType.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4} className="btn-group">
            <label className="paper__label">Batch Management</label>
            <ButtonGroup id="batch-management" initialStatus={SKU.batch_management} onButtonClick={handleManagement} />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Expiry Management</label>
            <ButtonGroup id="expiry-management" initialStatus={SKU.expiry_management} onButtonClick={handleManagement} />
          </Grid>
        </Grid>
      </div>
      { (isDirty || hasChanged) &&
        <div className="form__actions-container">
          <div className="form__actions">
            <p>Save this SKU?</p>
            <div className="form__btn-group">
              <Button
                type="button"
                className="btn btn--invert"
                style={{ marginRight: 10 }}
                onClick={() => {
                  setHasChanged(false);
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
}

const mapStateToProps = state => {
  return {
    clients: state.picklist.clients,
    uom: state.picklist.uom,
    storage_type: state.picklist.storage_type
  }
}

export default connect(mapStateToProps, { fetchClients, fetchUOM, fetchStorageType })(WarehouseMasterDataSKUForm);