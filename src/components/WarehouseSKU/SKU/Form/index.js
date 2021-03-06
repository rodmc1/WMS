import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import './style.scss';
import { connect } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { fetchUOM, fetchStorageType, fetchProjectType, fetchWarehouseClients } from 'actions';
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
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Spinner from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function WarehouseMasterDataSKUForm(props) {
  const [hasChanged, setHasChanged] = React.useState(false);
  const [hasFilesChange, setHasFilesChange] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [batchManagement, setBatchManagement] = React.useState(false);
  const [expiryManagement, setExpiryManagement] = React.useState(false);
  const [code, setCode] = React.useState('')
  const [SKU, setSKU] = React.useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [openBackdrop, setOpenBackdrop] = React.useState(true);
  const [initialClients, setInitialClients] = React.useState([]);
  const [removedClients, setRemovedClients] = useState([]);
  const isAllSelected = props.clients.length > 0 && selected.length === props.clients.length;

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
    data.removedClients = removedClients;

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
        ['projectType', props.sku.project_type],
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

    if (props.skuClients.length) {
      const taggedClients = props.skuClients.filter(client => client.isactive);
      setSelectedClients(props.skuClients.filter(client => client.isactive));
      setSelected(taggedClients.map(client => client.client_id));
      setInitialClients(taggedClients.map(client => client.client_id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.sku, props.skuClients]);

  React.useEffect(() => {
    if (SKU) {
      setBatchManagement(SKU.batch_management);
      setExpiryManagement(SKU.expiry_management);
    }
  }, [SKU]);

  React.useEffect(() => {
    if (selected) {
      let removedItems = [];
      initialClients.forEach(id => {
        if (!selected.includes(id)) {
          removedItems.push(id)
        }
      });

      setRemovedClients(removedItems)
    }
  }, [selected]);

  /*
   * Get addional picklist data
   */
  React.useEffect(() => {
    props.fetchUOM();
    props.fetchStorageType();
    props.fetchProjectType();
    setTimeout(function() {
      props.fetchWarehouseClients();
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  /*
   * Get addional picklist data
   */
  React.useEffect(() => {
    if (props.clients) {
      setOpenBackdrop(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.clients]);

  React.useEffect(() => {
    onChangeHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const onChangeHandler = event => {
    setInterval(function(){ setCode(getValues('productName') + '-' + getValues('externalCode'))  }, 1000);
  };

  const handleChange = (event) => {
    setHasChanged(true)
    let value = event.target.value;
    let selectedData = [];

    props.clients.forEach(client => {
      if(value.includes(client.id)) {
        selectedData.push(client)
      }
    });

    if (value[value.length - 1] === "all") {
      selectedData = selected.length === props.clients.length ? [] : props.clients;
      setSelected(selected.length === props.clients.length ? [] : props.clients.map(client => client.id));
      value = selected.length === props.clients.length ? [] : props.clients.map(client => client.id);
    } else {
      setSelected(value);
      setSelectedClients([])
    }

    setSelectedClients(selectedData);
    setValue('client', value);
  };

  const MenuProps = {
    variant: "menu",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left"
    },
    getContentAnchorEl: null
  };

  return (
    <form onSubmit={handleSubmit(__submit)} className="sku-form">
      <Spinner sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openBackdrop} >
        <CircularProgress color="inherit" />
      </Spinner>
      <div className="paper__section sku-create-form">
        <Typography variant="subtitle1" className="paper__heading">General Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <label className="paper__label">Client</label>
              <Controller
              render={({value}) => {
                return (
                  <Select
                    labelId="mutiple-select-label"
                    variant="outlined"
                    fullWidth
                    required
                    value={selected}
                    multiple
                    onChange={handleChange}
                    MenuProps={MenuProps}
                    renderValue={() => {
                      return (
                        selectedClients.map((client) => client.client_name).join(", ")
                      );
                    }}
                    >
                      <MenuItem
                        value="all"
                        classes={{
                          root: ""
                        }}
                      >
                        <Checkbox
                          className="sku-form-checkbox"
                          checked={isAllSelected}
                          indeterminate={
                            selected.length > 0 && selected.length < props.clients.length
                          }
                        />
                        <ListItemText
                          primary="Select All"
                        />
                      </MenuItem>
                    {props.clients.map((client) => (
                      <MenuItem key={client.id} value={client.id}>
                        <Checkbox checked={selected.includes(client.id)} className="sku-form-checkbox" />
                        <ListItemText primary={client.client_name} />
                      </MenuItem>
                    ))}
                  </Select>
                )
              }}
              name="client"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue=""
            />
            {errors.client && <FormHelperText error>{errors.client.message}</FormHelperText>}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <label className="paper__label">Product Name</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
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
            <label className="paper__label">Project Type</label>
            <Controller
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  required
                  defaultValue=""
                  displayEmpty={true}
                  renderValue={
                    getValues("projectType") !== "" ? undefined : () => <div style={{color: 'grey'}}>Select Project Type</div>
                  }>
                  {
                    !props.project_type ? null :
                    props.project_type.map(type => {
                      return <MenuItem key={type.Id} value={type.Description}>{type.Description}</MenuItem>
                    })
                  }
                </Select>
              }
              name="projectType"
              control={control}
              defaultValue=""
              required
              rules={{ required: "This field is required" }}
            />
            {errors.projectType && <FormHelperText error>{errors.projectType.message}</FormHelperText>}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <label className="paper__label">External Code</label>
            <Controller
              as={
                <TextField
                  variant="outlined"
                  type="text"
                  required
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
          <Grid item xs={12} md={6}>
            <label className="paper__label">Code</label>
              <TextField
                variant="outlined"
                style={{backgroundColor: '#F2F2F2'}}
                type="text"
                disabled
                value={code}
                required
                fullWidth
              />
            {errors.code && <FormHelperText error>{errors.code.message}</FormHelperText>}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <label className="paper__label">Unit of Handling</label>
            <Controller
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  required
                  defaultValue=""
                  displayEmpty={true}
                  renderValue={
                    getValues("unitOfHandling") !== "" ? undefined : () => <div style={{color: 'grey'}}>Select Unit of Handling</div>
                  }>
                  <MenuItem value="Cubic Meter">Cubic Meter</MenuItem>
                  <MenuItem value="Pallet">Pallet</MenuItem>
                </Select>
              }
              name="unitOfHandling"
              control={control}
              defaultValue=""
              required
              rules={{ required: "This field is required" }}
            />
            {errors.unitOfHandling && <FormHelperText error>{errors.unitOfHandling.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="paper__label">Value per Handling</label>
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

const mapStateToProps = state => {
  return {
    clients: Object.values(state.client.data),
    uom: state.picklist.uom,
    storage_type: state.picklist.storage_type,
    project_type: state.picklist.project_type,
    skuClients: state.client.sku
  }
}

export default connect(mapStateToProps, { fetchUOM, fetchStorageType, fetchProjectType, fetchWarehouseClients })(WarehouseMasterDataSKUForm);