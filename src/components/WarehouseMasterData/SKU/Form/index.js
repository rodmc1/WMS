import React from 'react';

import { Controller, useForm } from 'react-hook-form';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';

function WarehouseMasterDataSKUForm() {

  const { handleSubmit, errors, control, formState, setValue, reset } = useForm({
    shouldFocusError: false,
    mode: 'onChange'
  });

  return (
    // <form onSubmit={handleSubmit(__submit)}>
    <form>
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
              // onInput={() => setHasChanged(true)}
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
              // onInput={() => setHasChanged(true)}
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
              // onInput={() => setHasChanged(true)}
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
              // onInput={() => setHasChanged(true)}
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
              // onInput={() => setHasChanged(true)}
            />
            {/* {errors.warehouseName && <FormHelperText error>{errors.warehouseName.message}</FormHelperText>} */}
          </Grid>
        </Grid>

      </div>
    </form>
  )
}

export default WarehouseMasterDataSKUForm;