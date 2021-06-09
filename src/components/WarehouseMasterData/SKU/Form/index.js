import React from 'react';
import _ from 'lodash';
import './style.scss';
import { Controller, useForm } from 'react-hook-form';
import Dropzone from 'components/Dropzone';
import ButtonGroup from 'components/_ButtonGroup';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';

function WarehouseMasterDataSKUForm(props) {
  const [hasChanged, setHasChanged] = React.useState(false);
  const [hasFilesChange, setHasFilesChange] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [batchManagement, setBatchManagement] = React.useState(false);;
  const [expiryManagement, setExpiryManagement] = React.useState(false);
  const [SKU, setSKU] = React.useState([]);
  const [hasDefaultValue, setHasDefaultValue] = React.useState(false);
  const { handleSubmit, errors, control, formState, setValue, reset } = useForm({
    shouldFocusError: false,
    mode: 'onChange'
  });

  const formActionModal = document.querySelector('.form__actions-container');

  const { isDirty, isValid } = formState;

  const handleManagement = (status, id) => {
    if (id === 'batch-management') setBatchManagement(status);
    if (id === 'batch-management') setExpiryManagement(status);
    setHasChanged(true);
  }

  console.log(images)

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
  React.useEffect(() => {
    if (props.sku) {
      let SKUDetails = [
        ['productName', props.sku.product_name],
        ['code', props.sku.item_code],
        ['externalCode', props.sku.external_code],
        ['minQuantity', props.sku.min_qty],
        ['maxQuantity', props.sku.max_qty],
        ['valuePerUnit', props.sku.value_per_unit],
        ['length', props.sku.length],
        ['width', props.sku.width],
        ['height', props.sku.height],
        ['weight', props.sku.weight],
        ['storageType', props.sku.storage_type],
        ['uom', props.sku.uom_description],
        ['remarks', props.sku.remarks]
      ];
      
      setHasDefaultValue(true);
      setSKU(props.sku);
      SKUDetails.forEach(w => {
        if (w[1]) setValue(w[0], w[1]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.sku]);
  console.log(images)
  /*
   * Set option values in building types before setting initial value
   */
  React.useEffect(() => {
    if (props.building_types && props.warehouse) {
      setValue('buildingType', props.warehouse.building_type);
    }
  }, [props.building_types, setValue, props.sku]);

  return (
    <form onSubmit={handleSubmit(__submit)} className="sku-form">
      <div className="paper__section">
        <Typography variant="subtitle1" className="paper__heading">General Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <label className="paper__label">Product Name</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
                  inputProps={{ maxLength: 40 }}
                  fullWidth
                  required
                />
              }
              name="productName"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.productName && <FormHelperText error>{errors.productName.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="paper__label">UOM</label>
            <Controller
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  required
                  defaultValue=""
                  displayEmpty={true}>
                  <MenuItem value="Roll">Roll</MenuItem>
                  <MenuItem value="Pallet">Pallet</MenuItem>
                  <MenuItem value="Carton">Carton</MenuItem>
                  <MenuItem value="Piece">Piece</MenuItem>
                </Select>
              }
              control={control}
              name="uom"
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.uom && <FormHelperText error>{errors.uom.message}</FormHelperText>}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <label className="paper__label">Code</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
                  required
                  inputProps={{ maxLength: 40 }}
                  fullWidth
                />
              }
              name="code"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.code && <FormHelperText error>{errors.code.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="paper__label">External Code</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
                  required
                  inputProps={{ maxLength: 40 }}
                  fullWidth
                />
              }
              name="externalCode"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.externalCode && <FormHelperText error>{errors.externalCode.message}</FormHelperText>}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Min Quantity</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0, step: .01 },
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }} />
              }
              name="minQuantity"
              control={control}
              defaultValue=""
              required
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {errors.minQuantity && <FormHelperText error>{errors.minQuantity.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Max Quantity</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0, step: .01 },
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }} />
              }
              name="maxQuantity"
              control={control}
              defaultValue=""
              required
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {errors.maxQuantity && <FormHelperText error>{errors.maxQuantity.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Value Per Unit</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0, step: .01 },
                  startAdornment: <InputAdornment position="start">&#8369;</InputAdornment>,
                }} />
              }
              name="valuePerUnit"
              control={control}
              required
              defaultValue=""
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {errors.valuePerUnit && <FormHelperText error>{errors.valuePerUnit.message}</FormHelperText>}
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
                  defaultValue=""
                  displayEmpty={true}>
                  <MenuItem value="Standard">Standard</MenuItem>
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <label className="paper__label">Remarks</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
                  inputProps={{ maxLength: 40 }}
                  fullWidth
                />
              }
              name="remarks"
              control={control}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
          </Grid>
        </Grid>
      </div>
      <div className={images.length && formActionModal ? 'paper__section dropzone-margin' : 'paper__section'}>
        <div className="paper__section image__dropzone">
          <Typography variant="subtitle1" className="paper__heading">SKU Photos</Typography>
          <Dropzone 
            imageCount={images[images.length - 1]}
            defaultFiles={SKU}
            data="SKU"
            filesLimit={1}
            onDelete={() => {
              setHasChanged(true);
              setHasFilesChange(true);
            }}
            onDrop={() => {
              setHasChanged(true);
              setHasFilesChange(true);
            }}
            onChange={(files) => {
              setImages([...images, files]);
            }}
            type="image"
            showPreviews
            showPreviewsInDropzone={false} text="Drag and drop images here or click"
          />
        </div>
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

export default WarehouseMasterDataSKUForm;