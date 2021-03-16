import './style.scss';
import React from 'react';
import { connect } from 'react-redux';
import history from 'config/history';
import Cookies from 'universal-cookie';
import { Controller, useForm } from 'react-hook-form';
import { fetchFacilitiesAndAmenities } from 'actions/picklist';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Dropzone from 'components/Dropzone';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import GoogleMap from 'components/GoogleMap';


function WarehouseForm(props) {
  const cookies = new Cookies();
  const [warehouse, setWarehouse] = React.useState(null);

  // GOOGLE MAP
  const [marker, setMarker] = React.useState(new window.google.maps.Marker({ 
    draggable: true, 
    icon: {
      // url: icon,
      anchor: new window.google.maps.Point(12, 27)
    }
  }));
  const googleAutoCompleteCountry = cookies.get('user-location') !== undefined ? cookies.get('user-location').iso.toLowerCase() : 'ph';

  // FORMS
  const { handleSubmit, control, register, formState } = useForm({
    shouldFocusError: false,
    mode: 'onChange'
  });

  const { isDirty, isValid } = formState;
  const [address, setAddress] = React.useState(null);
  const [files, setFiles] = React.useState([]);

  const handleChange = files => {
    setFiles(files);
  }

  const handleGeocoder = address => {
    console.log(address);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(address.description, (response, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        let marker;
      }
    });
  }

  React.useEffect(() => {
    if (address) {
      handleGeocoder(address);
    }
  }, [address])

  React.useEffect(() => {

    props.fetchFacilitiesAndAmenities();
  }, [])

  return (
    <form onSubmit={handleSubmit(props.onSubmit, props.onError)}>
      <div className="paper__section">
        <Typography variant="subtitle1" className="paper__heading">General Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Warehouse Name</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="text" />
              }
              name="warehouseName"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Warehouse Type</label>
            <Controller
              control={control}
              name="warehouseType"
              defaultValue=""
              rules={{ required: true }}
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  displayEmpty={true}
                >
                  <MenuItem value="Heated and unheated general warehouses">Heated and unheated general warehouses</MenuItem>
                  <MenuItem value="Refrigerated warehouses">Refrigerated warehouses</MenuItem>
                  <MenuItem value="Controlled humidity (CH) warehouses">Controlled humidity (CH) warehouses</MenuItem>
                  <MenuItem value="Stockyard">Stockyard</MenuItem>
                </Select>
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Building Type</label>
            <Controller
              control={control}
              name="buildingType"
              defaultValue=""
              rules={{ required: true }}
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  displayEmpty={true}
                >
                  <MenuItem value="Duplex">Duplex</MenuItem>
                  <MenuItem value="Stand Alone">Stand Alone</MenuItem>
                  <MenuItem value="Stockyard">Stockyard</MenuItem>
                </Select>
              }
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <label className="paper__label">Address</label>
            <GooglePlacesAutocomplete 
              autocompletionRequest={{
                componentRestrictions: {
                  country: [googleAutoCompleteCountry]
                }
              }}
              onSelect={(addressInfo) => {handleGeocoder(addressInfo)}}     
              placeholder=""
              renderInput={props => (
                <TextField { ...props } fullWidth variant="outlined" type="text" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Warehouse Status</label>
            <Controller
              control={control}
              name="warehouseStatus"
              defaultValue=""
              rules={{ required: true }}
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  displayEmpty={true}
                >
                  <MenuItem value="Listed">Listed</MenuItem>
                  <MenuItem value="Reserved">Reserved</MenuItem>
                  <MenuItem value="Locked">Locked</MenuItem>
                </Select>
              }
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <label className="paper__label">Nearby Station</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="text" />
              }
              name="nearbyStation"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
        </Grid>
        <div className="paper__map">
          <GoogleMap width={'100%'} height={287} markers={[marker]} />
        </div>
      </div>
      <div className="paper__section">
        <Typography variant="subtitle1" className="paper__heading">Space Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Floor Area</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" />
              }
              name="floorArea"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Covered Area</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" />
              }
              name="coveredArea"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Mezzanine Area</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" />
              }
              name="mezzanineArea"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Open Area</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" />
              }
              name="openArea"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Office Area</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" />
              }
              name="officeArea"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Battery Charging Area</label>                  
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" />
              }
              name="batteryChargingArea"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
        
        <Grid item xs={12} md={4}>
          <label className="paper__label">Loading &amp; Unloading Bays</label>
          <Controller
            as={
              <TextField fullWidth variant="outlined" type="number" />
            }
            name="loadingUnloadingBays"
            control={control}
            defaultValue=""
            rules={{ required: true }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <label className="paper__label">Remarks</label>
          <Controller
            as={
              <TextField fullWidth variant="outlined" type="text" />
            }
            name="remarks"
            control={control}
            defaultValue=""
            rules={{ required: true }}
          />
        </Grid>
      </Grid>
      </div>
      <div className="paper__section">
        <Typography variant="subtitle1" className="paper__heading">Company Broker</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <label className="paper__label">First Name</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="text" />
              }
              name="companyBrokerFirstName"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Miiddle Name</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="text" />
              }
              name="companyBrokermiddleName"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Last Name</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="text" />
              }
              name="companyBrokerLastName"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="paper__label">Email Address</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="text" />
              }
              name="companyBrokerEmailAddress"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="paper__label">Mobile Number</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" />
              }
              name="companyBrokerMobileNumber"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
        </Grid>
      </div>
      <div className="paper__section">
        <Typography variant="subtitle1" className="paper__heading">Contact Person</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <label className="paper__label">First Name</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="text" />
              }
              name="contactPersonFirstName"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Miiddle Name</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="text" />
              }
              name="contactPersonmiddleName"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Last Name</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="text" />
              }
              name="contactPersonLastName"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="paper__label">Email Address</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" />
              }
              name="contactPersonEmailAddress"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="paper__label">Mobile Number</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" />
              }
              name="contactPersonMobileNumber"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </Grid>
        </Grid>
      </div>
      
      <div className="paper__section">
        <Typography variant="subtitle1" className="paper__heading">Family &amp; Amenities</Typography>
        <Grid container spacing={2}>
          {
            props.facilitiesAndAmenities.map(f => {
              console.log(f.Id)
              return (
                <Grid item xs={12} md={4} key={f.Id}>
                  <Controller
                    as={
                      <ToggleButtonGroup
                        exclusive
                        value="Unavailable"
                        className="btn-group"
                      >
                        <ToggleButton className="btn-group--emerald" value="Available">
                          Available
                        </ToggleButton>
                        <ToggleButton className="btn-group--disabled" value="Unavailable">
                          Unavailable
                        </ToggleButton>
                      </ToggleButtonGroup>
                    }
                    name={`facilities-${f.Id}`}
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                  />
                </Grid>
              )
            })
          }
        </Grid>
      </div>
      <div className="paper__section">
        <Dropzone onChange={handleChange} showPreviews={true} showPreviewsInDropzone={false} />
        {
          files.map(f => {
            console.dir(f);
            return <img src={f.preview} />
          })
        }
      </div>
      <div className="paper__section">
        <Dropzone onChange={handleChange} showPreviews={true} showPreviewsInDropzone={false} />
        {
          files.map(f => {
            console.dir(f);
            return <img src={f.preview} />
          })
        }
      </div>
      { isDirty && 
        <div className="form__actions-container">
          <div className="form__actions">
            <p>Save this warehouse?</p>
            <div className="form__btn-group">
              <Button type="button" className="btn btn--invert" style={{ marginRight: 10 }} onClick={() => history.push('/warehouse-list')}>Cancel</Button>
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
    facilitiesAndAmenities: state.picklist.facilities_and_amenities
  }
}

export default connect(mapStateToProps, { fetchFacilitiesAndAmenities })(WarehouseForm);