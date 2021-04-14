import './style.scss';
import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { Controller, useForm } from 'react-hook-form';
import { fetchFacilitiesAndAmenities, fetchBuildingTypes } from 'actions/picklist';
import { getWarehouseDetails } from './warehouseDetails';

import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import validator from 'validator';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Dropzone from 'components/Dropzone';
import GoogleMap from 'components/GoogleMap';
import ButtonGroup from 'components/ButtonGroup';
import FormHelperText from '@material-ui/core/FormHelperText';

function WarehouseForm(props) {
  const cookies = new Cookies();
  const [warehouse, setWarehouse] = React.useState(null);
  const [selectedAmenities, setSelectedAmenities] = React.useState([]);
  const [hasChanged, setHasChanged] = React.useState(false);
  const [addressField, setAddressField] = React.useState('');
  const [hasDefaultValue, setHasDefaultValue] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const [docs, setDocs] = React.useState([]);
  const [hasFilesChange, setHasFilesChange] = React.useState(false);
  const [errorAddress, setErrorAddress] = React.useState(false);

  // GOOGLE MAP
  const [marker, setMarker] = React.useState(new window.google.maps.Marker({ 
    draggable: true, 
    icon: {
      url: '/assets/images/location-marker.svg',
      anchor: new window.google.maps.Point(12, 27)
    },
    title: 'drag me'
  }));

  const googleAutoCompleteCountry = cookies.get('user-location') !== undefined ? cookies.get('user-location').iso.toLowerCase() : 'ph';
  
  /*
   * Get selected Facilities & Amenities
   * @args FacilitiesAndAmenities data
   * @args boolean availability
   * @setter setSelectedAmenities array of string
   */ 
  const handleSelectedFacilities = (data, availability) => {
    if (!selectedAmenities.includes(data) && availability) {
      setSelectedAmenities([...selectedAmenities, data]); 
      setHasChanged(true);
    }
    if (selectedAmenities.includes(data) && !availability) {
      setSelectedAmenities(selectedAmenities.filter(facility => facility !== data));
      setHasChanged(true);
    }
  }

  // FORMS
  const { handleSubmit, errors, control, formState, setValue, reset } = useForm({
    shouldFocusError: false,
    mode: 'onChange'
  });
  
  const { isDirty, isValid } = formState;
  const [address, setAddress] = React.useState(null);
  const [country, setCountry] = React.useState(null);
  const [centerMap, setCenterMap] = React.useState(null);
  const [gpsCoordinates, setGpsCoordinates] = React.useState(null);

  /*
   * Get and Set address field/state
   * @args address 
   */ 
  const handleGeocoder = address => {
    const geocodeAddress = address.description ? { address: address.description } : { address: address }
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(geocodeAddress, (response, status) => {
      if (status === window.google.maps.GeocoderStatus.OK) {
        const center = new window.google.maps.LatLng(response[0].geometry.location.lat(), response[0].geometry.location.lng());
        marker.setPosition(center);
        setCenterMap(center);
        setGpsCoordinates(`${response[0].geometry.location.lat()},${response[0].geometry.location.lng()}`);
      }
    });
    setAddress(address.description ? address.description : address);
    if (address.description) setAddressField(address.description);
    if (address.description) setCountry(address.terms[address.terms.length - 1].value);
  }
  const handleMarkerDrag = marker => {
    window.google.maps.event.addListener(marker, 'dragend', () => {
      const latlng = {
        lat: parseFloat(marker.getPosition().lat()),
        lng: parseFloat(marker.getPosition().lng()),
      }

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({location: latlng}, (response, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          const getAddressLevel = (array, level) => array.filter(a => a.types.includes(level))[0];

          setAddressField(response[0].formatted_address);
          setAddress(response[0].formatted_address);
          setCountry(getAddressLevel(response[0].address_components, 'country').long_name);
          setHasChanged(true);
          setErrorAddress(false);
        }
      });
    });
  }

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddressField(value);
    if (!value) setErrorAddress(false);
  }

  React.useEffect(() => {
    address && handleGeocoder(address);
  }, [address]);

  React.useEffect(() => {
    marker && handleMarkerDrag(marker);
  }, [marker]);

  React.useEffect(() => {
    if (props.warehouse) {
      setHasDefaultValue(true);
      setWarehouse(props.warehouse);
      setAddress(props.warehouse.address);
      setAddressField(props.warehouse.address);
      setCountry(props.warehouse.country);
      getWarehouseDetails(props.warehouse).forEach(w => {
        setValue(w[0], w[1]);
      });

      if (!selectedAmenities.length) {
        setSelectedAmenities(...selectedAmenities, props.warehouse.facilities_amenities);
      }
    }
  }, [props.warehouse]);

  React.useEffect(() => {
    if (props.resetWarehouse) {
      setWarehouse(props.resetWarehouse);
      setAddress(props.resetWarehouse.address);
      setAddressField(props.resetWarehouse.address);
      setCountry(props.resetWarehouse.country);
      getWarehouseDetails(props.resetWarehouse).forEach(w => {
        setValue(w[0], w[1]);
      });

      setSelectedAmenities(props.resetWarehouse.facilities_amenities);
    }
  }, [props.resetWarehouse]);

  React.useEffect(() => {
    props.fetchFacilitiesAndAmenities();
    props.fetchBuildingTypes();
  }, []);
  
  const __submit = data => {
    if (isValid || hasDefaultValue) {
      const newData = {
        ...data,
        selectedAmenities,
        address,
        country,
        gpsCoordinates,
        docs,
        images
      }
      props.onSubmit(newData);
    } else {
      props.onError(data);
    }
  }

  return (
    <form onSubmit={handleSubmit(__submit)}>
      <div className="paper__section">
        <Typography variant="subtitle1" className="paper__heading">General Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Warehouse Name</label>
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
              name="warehouseName"
              control={control}
              rules={{ required: "This field is required" }}
              defaultValue=""
              onInput={() => setHasChanged(true)}
            />
            {errors.warehouseName && <FormHelperText error>{errors.warehouseName.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Warehouse Type</label>
            <Controller
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  defaultValue=""
                  displayEmpty={true}>
                  <MenuItem value="Heated & Unheated General Warehouse">Heated and unheated general warehouses</MenuItem>
                  <MenuItem value="Refrigerated Warehouse">Refrigerated warehouses</MenuItem>
                  <MenuItem value="Controlled Humidity Warehouse">Controlled humidity (CH) warehouses</MenuItem>
                  <MenuItem value="Stockyard">Stockyard</MenuItem>
                </Select>
              }
              control={control}
              name="warehouseType"
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.warehouseType && <FormHelperText error>{errors.warehouseType.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Building Type</label>
            <Controller
              control={control}
              name="buildingType"
              defaultValue=""
              rules={{ required: "This field is required" }}
              as={
                <Select
                  variant="outlined"
                  fullWidth
                  displayEmpty={true}
                > 
                  {
                    !props.building_types ? null :
                    props.building_types.map(type => {
                      return <MenuItem key={type.Id} value={type.Description || ''}>{type.Description}</MenuItem>
                    })
                  } 
                </Select>
              }
            />
            {errors.buildingType && <FormHelperText error>{errors.buildingType.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={8}>
            <label className="paper__label">Address</label>
            <GooglePlacesAutocomplete 
              autocompletionRequest={{
                componentRestrictions: {
                  country: [googleAutoCompleteCountry]
                }
              }}
              onSelect={(addressInfo) => {handleGeocoder(addressInfo); setHasChanged(true); setErrorAddress(false)}}
              placeholder=""
              renderInput={props => (
                <TextField { ...props }
                  required
                  fullWidth
                  variant="outlined" type="text"
                  onChange={(e) => {
                    handleAddressChange(e);
                    props.onChange(e);
                  }}
                  onBlur={() => {
                    if ((!gpsCoordinates && !address) || addressField.length < 5) {
                      setErrorAddress(true);
                    } 
                    if (!addressField) setErrorAddress(false);
                  }} 
                  value={addressField}
                />
              )}
            />
            {errorAddress && <FormHelperText error>Invalid Address</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Warehouse Status</label>
            <Controller
              control={control}
              name="warehouseStatus"
              defaultValue=""
              rules={{ required: "This field is required" }}
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
            {errors.warehouseStatus && <FormHelperText error>{errors.warehouseStatus.message}</FormHelperText>}
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
              rules={{ required: "This field is required" }}
            />
            {errors.nearbyStation && <FormHelperText error>{errors.nearbyStation.message}</FormHelperText>}
          </Grid>
        </Grid>
        <div className="paper__map">
          <GoogleMap width={'100%'} height={287} markers={[marker]} centerMap={centerMap} />
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Years of TOP</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" />
              }
              name="yearOfTop"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.yearOfTop && <FormHelperText error>{errors.yearOfTop.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Min Lease Terms</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  endAdornment: <InputAdornment position="end">Months</InputAdornment>,
                }} />
              }
              name="minLeaseTerms"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.minLeaseTerms && <FormHelperText error>{errors.minLeaseTerms.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">PSF</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" />
              }
              name="psf"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.psf && <FormHelperText error>{errors.psf.message}</FormHelperText>}
          </Grid>
        </Grid>
      </div>
      <div className="paper__section">
        <Typography variant="subtitle1" className="paper__heading">Space Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Floor Area</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="number" 
                InputProps={{
                  endAdornment: <InputAdornment position="end">Sqm</InputAdornment>,
                }} />
              }
              name="floorArea"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.floorArea && <FormHelperText error>{errors.floorArea.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Covered Area</label>
            <Controller
              as={
                <TextField 
                  fullWidth 
                  variant="outlined"
                  type="number" 
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Sqm</InputAdornment>,
                  }} />
              }
              name="coveredArea"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.coveredArea && <FormHelperText error>{errors.coveredArea.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Mezzanine Area</label>
            <Controller
              as={
                <TextField 
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Sqm</InputAdornment>,
                  }} />
              }
              name="mezzanineArea"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.mezzanineArea && <FormHelperText error>{errors.mezzanineArea.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Open Area</label>
            <Controller
              as={
                <TextField 
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Sqm</InputAdornment>,
                  }} />
              }
              name="openArea"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.openArea && <FormHelperText error>{errors.openArea.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Office Area</label>
            <Controller
              as={
                <TextField 
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Sqm</InputAdornment>,
                  }} />
              }
              name="officeArea"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.officeArea && <FormHelperText error>{errors.officeArea.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Battery Charging Area</label>                  
            <Controller
              as={
                <TextField 
                  fullWidth
                  variant="outlined"
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Sqm</InputAdornment>,
                  }} />
              }
              name="batteryChargingArea"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.batteryChargingArea && <FormHelperText error>{errors.batteryChargingArea.message}</FormHelperText>}
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
            rules={{ required: "This field is required" }}
          />
          {errors.loadingUnloadingBays && <FormHelperText error>{errors.loadingUnloadingBays.message}</FormHelperText>}
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
              rules={{ required: "This field is required" }}
            />
            {errors.companyBrokerFirstName && <FormHelperText error>{errors.companyBrokerFirstName.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Middle Name</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="text" />
              }
              name="companyBrokerMiddleName"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.companyBrokerMiddleName && <FormHelperText error>{errors.companyBrokerMiddleName.message}</FormHelperText>}
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
              rules={{ required: "This field is required" }}
            />
            {errors.companyBrokerLastName && <FormHelperText error>{errors.companyBrokerLastName.message}</FormHelperText>}
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
              rules={{ 
                required: "This field is required", 
                validate: value => { return !validator.isEmail(value) ? 'Invalid email address' : true }
              }}
            />
            {errors.companyBrokerEmailAddress && <FormHelperText error>{errors.companyBrokerEmailAddress.message}</FormHelperText>}
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
              rules={{ 
                required: "This field is required", 
                validate: value => { return !validator.isMobilePhone(value) ? 'Invalid phone number' : true } 
              }}
            />
            {errors.companyBrokerMobileNumber && <FormHelperText error>{errors.companyBrokerMobileNumber.message}</FormHelperText>}
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
              rules={{ required: "This field is required" }}
            />
            {errors.contactPersonFirstName && <FormHelperText error>{errors.contactPersonFirstName.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={4}>
            <label className="paper__label">Middle Name</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="text" />
              }
              name="contactPersonMiddleName"
              control={control}
              defaultValue=""
              rules={{ required: "This field is required" }}
            />
            {errors.contactPersonMiddleName && <FormHelperText error>{errors.contactPersonMiddleName.message}</FormHelperText>}
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
              rules={{ required: "This field is required" }}
            />
            {errors.contactPersonLastName && <FormHelperText error>{errors.contactPersonLastName.message}</FormHelperText>}
          </Grid>
          <Grid item xs={12} md={6}>
            <label className="paper__label">Email Address</label>
            <Controller
              as={
                <TextField fullWidth variant="outlined" type="email" />
              }
              name="contactPersonEmailAddress"
              control={control}
              defaultValue=""
              rules={{ 
                required: "This field is required", 
                validate: value => { return !validator.isEmail(value) ? 'Invalid email address' : true} 
              }}
            />
            {errors.contactPersonEmailAddress && <FormHelperText error>{errors.contactPersonEmailAddress.message}</FormHelperText>}
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
              rules={{ 
                required: "This field is required", 
                validate: value => { return !validator.isMobilePhone(value) ? 'Invalid phone number' : true } 
              }}
            />
            {errors.contactPersonMobileNumber && <FormHelperText error>{errors.contactPersonMobileNumber.message}</FormHelperText>}
          </Grid>
        </Grid>
      </div>
      
      <div className="paper__section facilities__amenities">
        <Typography variant="subtitle1" className="paper__heading">Facilities &amp; Amenities</Typography>
        <Grid container spacing={2}>
          {
            !props.facilitiesAndAmenities ? null 
              : props.facilitiesAndAmenities.map(f => {
                return <ButtonGroup key={f.Id} data={f} handleSelectedFacilities={handleSelectedFacilities} warehouseFacilitiesAndAmenities={selectedAmenities} />
              })
          }
        </Grid>
      </div>
      <div className="paper__section image__dropzone">
      <Typography variant="subtitle1" className="paper__heading">Warehouse Photos</Typography>
        <Dropzone 
          imageCount={images[images.length - 1]}
          defaultFiles={warehouse}
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
      <div className="paper__section documents__dropzone">
      <Typography variant="subtitle1" className="paper__heading">Documents</Typography>
        <Dropzone
          documentCount={docs[docs.length - 1]}
          defaultFiles={warehouse}
          type="files"
          onDelete={() => {
            setHasChanged(true);
            setHasFilesChange(true);
          }}
          onDrop={() => {
            setHasChanged(true);
            setHasFilesChange(true);
          }}
          onChange={(files) => {
            setDocs([...docs, files])
          }}
          showPreviews
          showPreviewsInDropzone={false}
          text="Drag and drop a file here or click"
        />
      </div>
      { (isDirty || hasChanged) &&
        <div className="form__actions-container">
          <div className="form__actions">
            <p>Save this warehouse?</p>
            <div className="form__btn-group">
              <Button
                type="button"
                className="btn btn--invert"
                style={{ marginRight: 10 }}
                onClick={() => {
                  setHasChanged(false);
                  if (props.warehouse) reset();
                  props.handleDialogCancel(hasFilesChange);
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
    facilitiesAndAmenities: state.picklist.facilities_and_amenities,
    building_types: state.picklist.building_types,
  }
}

export default connect(mapStateToProps, { fetchFacilitiesAndAmenities, fetchBuildingTypes })(WarehouseForm);