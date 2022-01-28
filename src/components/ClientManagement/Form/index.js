import './style.scss';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import validator from 'validator';
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
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import GroupIcon from '@mui/icons-material/Group';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Chip from '@mui/material/Chip';
import makeStyles from '@mui/styles/makeStyles';

function ClientForm(props) {
  const [hasChanged, setHasChanged] = useState(false);
  const [hasFilesChange, setHasFilesChange] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [SKU, setSKU] = React.useState([]);
  const [createOwner, setCreateOwner] = useState(false);
  const [createContactPerson, setCreateContactPerson] = useState(false);
  const [isClientFetched, setIsClientFetched] = useState(false);
  const [existingClientData, setExistingClientData] = useState([]);

  const { handleSubmit, errors, control, formState, setValue, getValues } = useForm({
    shouldFocusError: false,
    mode: 'onTouched'
  });

  const { isDirty } = formState;
  
  const __submit = data => {
    data.owner = createOwner;
    data.contactPerson = createContactPerson;

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
    if (existingClientData) {
      let SKUDetails = [
        ['companyName', existingClientData.client_name],
        ['address', existingClientData.client_address],
        ['country', existingClientData.country],
        ['ownerName', existingClientData.owner_firstname],
        ['ownerEmail', existingClientData.owner_email],
        ['ownerMobileNumber', existingClientData.owner_mobile],
        ['contactPersonName', existingClientData.contactperson_firstname],
        ['contactPersonEmail', existingClientData.contactperson_email],
        ['contactPersonMobileNumber', existingClientData.contactperson_mobile],
      ];

      setSKU(props.sku);
      SKUDetails.forEach(w => {
        if (w[1]) setValue(w[0], w[1]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [existingClientData]);

  /*
   * Get addional picklist data
   */
  React.useEffect(() => {
    if (props.warehouseClient) {
      setExistingClientData(props.warehouseClient);
      if (props.warehouseClient.owner_email) setCreateOwner(true);
      if (props.warehouseClient.contactperson_email) setCreateContactPerson(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.warehouseClient]);

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
    <form onSubmit={handleSubmit(__submit)} className="client-form">
      <div className="paper__section">
        <Grid container spacing={2}>
          <Grid item xs={3} md={1}>
            <ListItem style={{ paddingLeft: 0}}>
              <ListItemAvatar style={{ position: 'relative' }}>
                <Avatar style={{height: 64, width: 64}}>
                  <GroupIcon />
                </Avatar>
                <Avatar sx={{boxShadow: 2}} style={{top: 40, right: 0, height: 20, width: 20, position: 'absolute', backgroundColor: 'white'}}>
                  <CameraAltIcon style={{ height: 15, width: 15, color: 'gray'}} />
                </Avatar>
              </ListItemAvatar>
            </ListItem>
          </Grid>
          <Grid item xs={9} md={11}>
            <label className="paper__label">Company Name</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" />
              }
              name="companyName"
              control={control}
              required
              defaultValue=""
              rules={{ 
                required: "This field is required",
              }}
              onInput={() => setHasChanged(true)}
            />
            {errors.companyName && <FormHelperText error>{errors.companyName.message}</FormHelperText>}
          </Grid>
          {
            // Temporary hidden
            // <Grid item xs={12} md={4}>
            // <label className="paper__label">Status</label>
            // <Controller
            //   as={
            //     <Select
            //       variant="outlined"
            //       className="select-status"
            //       fullWidth
            //       required
            //       defaultValue=""
            //       displayEmpty={true}
            //       renderValue={
            //         getValues("status") !== "" ? undefined : () => <div style={{color: 'grey', paddingTop: 7, paddingBottom: 6}}>Select Status</div>
            //       }>
            //       <MenuItem value="Accredited" className="client-status">
            //         <Chip label="Accredited" className="status-chip blue" sx={{width: 1, paddingTop: 2, paddingBottom: 2}} />
            //       </MenuItem>
            //       <MenuItem value="Suspend" className="client-status">
            //         <Chip label="Suspend" className="status-chip " sx={{width: 1, paddingTop: 2, paddingBottom: 2}} />
            //       </MenuItem>
            //       <MenuItem value="Terminated" className="client-status">
            //         <Chip label="Terminated" className="status-chip " sx={{width: 1, paddingTop: 2, paddingBottom: 2}} />
            //       </MenuItem>
            //       <MenuItem value="Blacklist" className="client-status">
            //         <Chip label="Blacklist" className="status-chip " sx={{width: 1, paddingTop: 2, paddingBottom: 2}} />
            //       </MenuItem>
            //       <MenuItem value="Others" className="client-status">
            //         <Chip label="Others" className="status-chip " sx={{width: 1, paddingTop: 2, paddingBottom: 2}} />
            //       </MenuItem>
            //       <MenuItem value="Potential" className="client-status">
            //         <Chip label="Potential" className="status-chip green" sx={{width: 1, paddingTop: 2, paddingBottom: 2}} />
            //       </MenuItem>
            //       <MenuItem value="On Call" className="client-status">
            //         <Chip label="On Call" className="status-chip gold" sx={{width: 1, paddingTop: 2, paddingBottom: 2}} />
            //       </MenuItem>
            //       <MenuItem value="Lock in" className="client-status">
            //         <Chip label="Lock in" className="status-chip tangerine" sx={{width: 1, paddingTop: 2, paddingBottom: 2}} />
            //       </MenuItem>
            //       <MenuItem value="Regular" className="client-status">
            //         <Chip label="Regular" className="status-chip emerald" sx={{width: 1, paddingTop: 2, paddingBottom: 2}} />
            //       </MenuItem>
            //     </Select>
            //   }
            //   name="status"
            //   control={control}
            //   defaultValue=""
            //   required
            //   rules={{ required: "This field is required" }}
            // />
            // {errors.status && <FormHelperText error>{errors.status.message}</FormHelperText>}
            // </Grid>
          }
          <Grid item xs={12} md={8}>
            <label className="paper__label">Address</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" />
              }
              control={control}
              name="address"
              defaultValue=""
              required
              rules={{ required: "This field is required" }}
            />
            {errors.address && <FormHelperText error>{errors.address.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Country</label>
            <Controller
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  required
                  defaultValue=""
                  displayEmpty={true}>
                  <MenuItem value="Philippines">Philippines</MenuItem>
                  <MenuItem value="Thailand">Thailand</MenuItem>
                  <MenuItem value="Singapore">Singapore</MenuItem>
                </Select>
              }
              name="country"
              control={control}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.country && <FormHelperText error>{errors.country.message}</FormHelperText>}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Owner</label>
            {
              createOwner ? 
                <Controller
                  as={
                    <TextField fullWidth variant="outlined" />
                  }
                  name="ownerName"
                  control={control}
                  required
                  defaultValue=""
                  rules={{ 
                    required: "This field is required"
                  }}
                  onInput={() => setHasChanged(true)}
                /> :
                <Button className="member-btn" sx={{ display: 'block' }} fullWidth onClick={() => setCreateOwner(true)} variant="outlined">Create Owner</Button>
            }
            {errors.owner && <FormHelperText error>{errors.owner.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Email Address</label>
            <Controller
              as={
                <TextField
                  fullWidth
                  variant="outlined"
                  disabled={!createOwner}
                  type='email'
                  className={!createOwner ? 'member-field' : ''}
                />
              }
              name="ownerEmail"
              control={control}
              defaultValue=""
              required={createOwner}
              onInput={() => setHasChanged(true)}
            />
            {errors.ownerEmail && <FormHelperText error>{errors.ownerEmail.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Mobile Number</label>
            <Controller
              as={
                <TextField
                  fullWidth
                  variant="outlined"
                  disabled={!createOwner}
                  type="number"
                  className={!createOwner ? 'member-field input_mobile' : 'input_mobile'}
                  InputProps={{
                    inputProps: { min: 0, step: .01 },
                  }}
                />
              }
              name="ownerMobileNumber"
              required={createOwner}
              control={control}
              defaultValue=""
              rules={{ 
                validate: value => { return !validator.isMobilePhone(value) && createOwner ? 'Invalid phone number' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {errors.ownerMobileNumber && <FormHelperText error>{errors.ownerMobileNumber.message}</FormHelperText>}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
            <label className="paper__label">Contact Person</label>
            {
              createContactPerson ? 
                <Controller
                  as={
                    <TextField fullWidth variant="outlined" />
                  }
                  name="contactPersonName"
                  control={control}
                  required
                  defaultValue=""
                  rules={{ 
                    required: "This field is required"
                  }}
                  onInput={() => setHasChanged(true)}
                /> :
                <Button className="member-btn" fullWidth onClick={() => setCreateContactPerson(true)} variant="outlined">Create Contact Person</Button>
            }
            {errors.contactPerson && <FormHelperText error>{errors.contactPerson.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Email Address</label>
            <Controller
              as={
                <TextField 
                  className="member-field"
                  fullWidth
                  variant="outlined"
                  type='email'
                  disabled={!createContactPerson}
                  className={!createContactPerson ? 'member-field' : ''}
                />
              }
              name="contactPersonEmail"
              control={control}
              required={createContactPerson}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.contactPersonEmail && <FormHelperText error>{errors.contactPersonEmail.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Mobile Number</label>
            <Controller
              as={
                <TextField
                  fullWidth
                  variant="outlined" 
                  disabled={!createContactPerson}
                  type="number"
                  className={!createContactPerson ? 'member-field input_mobile' : 'input_mobile'}
                  InputProps={{
                    inputProps: { min: 0, step: .01 },
                  }}
                />
              }
              name="contactPersonMobileNumber"
              required={createContactPerson}
              control={control}
              defaultValue=""
              rules={{ 
                validate: value => { return !validator.isMobilePhone(value) && createContactPerson ? 'Invalid phone number' : true } 
              }}
              onInput={() => setHasChanged(true)}
            />
            {errors.contactPersonMobileNumber && <FormHelperText error>{errors.contactPersonMobileNumber.message}</FormHelperText>}
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

export default connect(mapStateToProps, { fetchClients, fetchUOM, fetchStorageType })(ClientForm);