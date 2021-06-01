import React from 'react';

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
import Radio from '@material-ui/core/Radio';

function WarehouseMasterDataSKUForm(props) {

  const { register, handleSubmit, errors, control, formState, setValue, reset } = useForm({
    shouldFocusError: false,
    mode: 'onChange'
  });
  const { isDirty, isValid } = formState;
  const [hasChanged, setHasChanged] = React.useState(false);
  const [hasFilesChange, setHasFilesChange] = React.useState(false);
  const [images, setImages] = React.useState([]);

  const __submit = data => {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(__submit)}>
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
                  required
                  inputProps={{ maxLength: 40 }}
                  fullWidth
                />
              }
              name="productName"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {/* {errors.warehouseName && <FormHelperText error>{errors.warehouseName.message}</FormHelperText>} */}
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="paper__label">UOM</label>
            <Controller
              as={
                <Select
                  variant="outlined"
                  fullWidth
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
            {/* {errors.warehouseType && <FormHelperText error>{errors.warehouseType.message}</FormHelperText>} */}
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
            {/* {errors.warehouseName && <FormHelperText error>{errors.warehouseName.message}</FormHelperText>} */}
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
            {/* {errors.warehouseName && <FormHelperText error>{errors.warehouseName.message}</FormHelperText>} */}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Min Quantity</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }} />
              }
              name="minQuantity"
              control={control}
              defaultValue=""
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {/* {errors.warehouseName && <FormHelperText error>{errors.warehouseName.message}</FormHelperText>} */}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Max Quantity</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }} />
              }
              name="maxQuantity"
              control={control}
              defaultValue=""
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {/* {errors.warehouseName && <FormHelperText error>{errors.warehouseName.message}</FormHelperText>} */}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Value Per Unit</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0 },
                  startAdornment: <InputAdornment position="start">&#8369;</InputAdornment>,
                }} />
              }
              name="maxQuantity"
              control={control}
              defaultValue=""
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {/* {errors.warehouseName && <FormHelperText error>{errors.warehouseName.message}</FormHelperText>} */}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <label className="paper__label">Length</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }} />
              }
              name="lenght"
              control={control}
              defaultValue=""
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {/* {errors.warehouseName && <FormHelperText error>{errors.warehouseName.message}</FormHelperText>} */}
          </Grid>
          <Grid item xs={12} md={3}>
            <label className="paper__label">Width</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }} />
              }
              name="width"
              control={control}
              defaultValue=""
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {/* {errors.warehouseName && <FormHelperText error>{errors.warehouseName.message}</FormHelperText>} */}
          </Grid>
          <Grid item xs={12} md={3}>
            <label className="paper__label">Height</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                }} />
              }
              name="height"
              control={control}
              defaultValue=""
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {/* {errors.warehouseName && <FormHelperText error>{errors.warehouseName.message}</FormHelperText>} */}
          </Grid>
          <Grid item xs={12} md={3}>
            <label className="paper__label">Weight</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  inputProps: { min: 0 },
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }} />
              }
              name="weight"
              control={control}
              defaultValue=""
              rules={{ 
                required: "This field is required",
                validate: value => { return value < 0 ? 'Invalid value' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {/* {errors.warehouseName && <FormHelperText error>{errors.warehouseName.message}</FormHelperText>} */}
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
                  {/* <MenuItem value="Refrigerated Warehouse">Refrigerated warehouses</MenuItem>
                  <MenuItem value="Controlled Humidity Warehouse">Controlled humidity (CH) warehouses</MenuItem>
                  <MenuItem value="Stockyard">Stockyard</MenuItem> */}
                </Select>
              }
              control={control}
              name="storageType"
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {/* {errors.warehouseType && <FormHelperText error>{errors.warehouseType.message}</FormHelperText>} */}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Batch Management</label>
            {/* <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
                  required
                  inputProps={{ maxLength: 40 }}
                  fullWidth
                />
              }
              name="batchManagement"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue=""
              onChange={() => setHasChanged(true)}
            /> */}
             <Radio
              checked={true}
              onChange={() => setHasChanged(true)}
              value="d"
              color="default"
              name="radio-button-demo"
              inputProps={{ 'aria-label': 'D' }}
            />
              
              {/* control={control}
              rules={{ required: "This field is required" }}
              defaultValue=""
              onChange={() => setHasChanged(true)} */}
            
            {/* {errors.warehouseType && <FormHelperText error>{errors.warehouseType.message}</FormHelperText>} */}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Expiry Management</label>
            {/* <Controller
              as={

              }
              control={control}
              name="storageType"
              defaultValue=""
              rules={{ required: "This field is required" }}
            /> */}
            {/* {errors.warehouseType && <FormHelperText error>{errors.warehouseType.message}</FormHelperText>} */}
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
                  required
                  inputProps={{ maxLength: 40 }}
                  fullWidth
                />
              }
              name="remarks"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {/* {errors.warehouseName && <FormHelperText error>{errors.warehouseName.message}</FormHelperText>} */}
          </Grid>
        </Grid>
      </div>
      <div className="paper__section">
        <div className="paper__section image__dropzone">
          <Typography variant="subtitle1" className="paper__heading">SKU Photos</Typography>
          <Dropzone 
            imageCount={images[images.length - 1]}
            // defaultFiles={warehouse}
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
}

export default WarehouseMasterDataSKUForm;