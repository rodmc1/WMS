import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { fetchWarehouseById, updateUserById, uploadWarehouseFilesById, deleteWarehouseFilesById, updateWarehouseById } from 'actions/index';
import WarehouseSideBar from 'components/WarehouseSidebar';
import WarehouseForm from 'components/WarehouseForm';
import Breadcrumbs from 'components/Breadcrumbs';
import history from 'config/history';
import _ from 'lodash';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function WarehouseEdit(props) {
  const [openCancel, setOpenCancel] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(true);
  const [edited, setEdited] = React.useState(false);
  const [existingWarehouse, setExistingWarehouse] = React.useState('');
  const [resetWarehouse, setResetWarehouse] = React.useState('');
  const [newWarehouseId, setNewWarehouseId] = React.useState(null);
  const dispatch = useDispatch();
  const [alertConfig, setAlertConfig] = React.useState({
    severity: 'info',
    message: 'Loading...'
  });
  const [routes, setRoutes] = React.useState([
    {
      label: 'Warehouse List',
      path: '/warehouse-list'
    }
  ]);
  const { fetchWarehouseById } = props;
  const [status, setStatus] = React.useState({
    images: false,
    docs: false,
    userBroker: false,
    userContact: false,
    warehouse: false
  });

  const handleSubmit = data => {
    setAlertConfig({ severity: 'info', message: 'Saving changes...' });
    setOpenSnackBar(true);

    const warehouse = {
      id: existingWarehouse.warehouse_id,
      name: data.warehouseName,
      warehouse_type: data.warehouseType,
      building_type: data.buildingType,
      gps_coordinate: data.gpsCoordinates,
      address: data.address,
      country: data.country,
      year_top: Number(data.yearOfTop),
      min_lease_terms: Number(data.minLeaseTerms),
      psf: Number(data.psf),
      floor_area: Number(data.floorArea),
      covered_area: Number(data.coveredArea),
      mezzanine_area: Number(data.mezzanineArea),
      open_area: Number(data.openArea),
      office_area: Number(data.officeArea),
      battery_charging_area: Number(data.batteryChargingArea),
      loading_unloading_bays: Number(data.loadingUnloadingBays),
      remarks: data.remarks,
      facilities_amenities: data.selectedAmenities,
      nearby_station: data.nearbyStation,
      warehouse_status: data.warehouseStatus,
      users_details: []
    }

    //Handle warehouse update
    updateWarehouseById(existingWarehouse.warehouse_id, warehouse)
      .then(response => {
        if (response.status === 201) {
          setNewWarehouseId(warehouse.name);
          setStatus(prevState => { return {...prevState, warehouse: true }});
        }
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });

    //Images upload and delete
    if (data.images.length > 1) {
      handleImageUpdate(data);
    } else {
      setStatus(prevState => { return {...prevState, images: true }});
    }

    //Documents upload and delete
    if (data.docs.length > 1) {
      handleDocumentUpdate(data);
    } else {
      setStatus(prevState => { return {...prevState, docs: true }});
    }
    
    //Handle users update
    handleUsersUpdate(data);
  }

  const handleUsersUpdate = (data) => {
    let existingUserBroker = { data: null };
    let existingUserContactPerson = { data: null };

    const newBroker = {
      last_name: data.companyBrokerLastName,
      first_name: data.companyBrokerFirstName,
      middle_name: data.companyBrokerMiddleName,
      mobile_number: data.companyBrokerMobileNumber,
      email_address: data.companyBrokerEmailAddress,
      role: 'Broker'
    }

    const newContactPerson = {
      last_name: data.contactPersonLastName,
      first_name: data.contactPersonFirstName,
      middle_name: data.contactPersonMiddleName,
      mobile_number: data.contactPersonMobileNumber,
      email_address: data.contactPersonEmailAddress,
      role: 'Contact Person'
    }

    existingWarehouse.warehouse_users_details.forEach(user => {
      if (user.role === 'Broker') existingUserBroker.data = user; 
      if (user.role === 'Contact Person') existingUserContactPerson.data = user;
    });
    
    existingUserBroker.id = existingUserBroker.data.user_id;
    existingUserBroker.data = {
      last_name: existingUserBroker.data.last_name,
      first_name: existingUserBroker.data.first_name,
      middle_name: existingUserBroker.data.middle_name,
      mobile_number: existingUserBroker.data.mobile_number,
      email_address: existingUserBroker.data.email_address,
      role: 'Broker',
    }

    existingUserContactPerson.id = existingUserContactPerson.data.user_id;
    existingUserContactPerson.data = {
      last_name: existingUserContactPerson.data.last_name,
      first_name: existingUserContactPerson.data.first_name,
      middle_name: existingUserContactPerson.data.middle_name,
      mobile_number: existingUserContactPerson.data.mobile_number,
      email_address: existingUserContactPerson.data.email_address,
      role: 'Contact Person',
    }

    const hasBrokerChange = JSON.stringify(existingUserBroker.data) !== JSON.stringify(newBroker);
    const hasContactChange = JSON.stringify(existingUserContactPerson.data) !== JSON.stringify(newContactPerson);

    if (hasBrokerChange) {
      updateUserById(existingUserBroker.id, newBroker)
        .then(response => {
          if (response.status === 201) {
            setStatus(prevState => { return {...prevState, userBroker: true }});
          }
        })
        .catch(error => {
          if (error.response.data.type === '23505') {
            setAlertConfig({ severity: 'error', message: 'Broker email address already exists' });
          }
        })
    } else {
      setStatus(prevState => { return {...prevState, userBroker: true }});
    }

    if (hasContactChange) {
      updateUserById(existingUserContactPerson.id, newContactPerson)
        .then(response => {
          if (response.status === 201) {
            setStatus(prevState => { return {...prevState, userContact: true }});
          }
        })
        .catch(error => {
          if (error.response.data.type === '23505') {
            setAlertConfig({ severity: 'error', message: 'Contact Person email address already exists' });
          }
        })
    } else {
      setStatus(prevState => { return {...prevState, userContact: true }});
    }
  }

  const handleDocumentUpdate = (data) => {
    let existingDocuments = [];
    const docExtensions = ['doc', 'docx', 'pdf', 'txt', 'tex'];
    const newDocs = data.docs[data.docs.length - 1].map(i => { return i.name });
    
    if (existingWarehouse.warehouse_document_file) {
      existingDocuments = existingWarehouse.warehouse_document_file.map(i => { return i.warehouse_filename });
      
      existingWarehouse.warehouse_document_file.forEach(file => {
        if (docExtensions.includes(file.warehouse_filename.split('.').pop().toLowerCase()) && !newDocs.includes(file.warehouse_filename)) {
          deleteWarehouseFilesById(file.warehouse_documents_file_id);
        }
      });
    }

    data.docs[data.docs.length - 1].forEach(file => {
      if (!existingDocuments.includes(file.name)) {
        uploadWarehouseFilesById(existingWarehouse.warehouse_id, [file]);
      }
    });
    setStatus(prevState => { return {...prevState, docs: true }});
  }

  const handleImageUpdate = (data) => {
    let existingImages = [];
    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp'];
    const newImages = data.images[data.images.length - 1].map(i => { return  i.name }); 
    
    if (existingWarehouse.warehouse_document_file) {
      existingImages = existingWarehouse.warehouse_document_file.map(i => {
        return imageExtensions.includes(i.warehouse_filename.split('.').pop().toLowerCase()) && i.warehouse_filename;
      });

      existingWarehouse.warehouse_document_file.forEach(file => {
        if (imageExtensions.includes(file.warehouse_filename.split('.').pop().toLowerCase()) && !newImages.includes(file.warehouse_filename)) {
          deleteWarehouseFilesById(file.warehouse_documents_file_id);
        }
      });
    }

    let imageArr = [];
    data.images[data.images.length - 1].forEach(file => {
      if (!existingImages.includes(file.name)) {
        imageArr.push(uploadWarehouseFilesById(existingWarehouse.warehouse_id, [file]))
      }
    });

    Promise.all(imageArr)
      .then(response => {
        if (response) {
          setStatus(prevState => { return {...prevState, images: true }});
        }
      }).catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }

  const handleError = error => {
    console.log(error)
  }

  React.useEffect(() => {
    if (!_.isEmpty(props.error)) {
      if (props.error.status === 500) {
        setAlertConfig({ severity: 'error', message: props.error.data.type +': Something went wrong. Try again'});
      } else if (!props.error.status === 401) {
        setAlertConfig({ severity: 'error', message: props.error.data.type +': '+ props.error.data.message });
      }
    }
  }, [props.error]);
  
  React.useEffect(() => {
    if (!Object.values(status).includes(false)) {
      setEdited(true);
    }
  }, [status]);

  React.useEffect(() => {
    if (edited && newWarehouseId) {
      history.push({
        pathname: `/warehouse-list/overview/${newWarehouseId}`,
        success: 'Changes saved successfully'
      });
    } 
  }, [edited, newWarehouseId]);

  React.useEffect(() => {
    if (props.warehouse && routes.length === 1) {
      setRoutes(routes => [...routes, {
        label: props.warehouse.warehouse_client,
        path: `/warehouse-list/overview/${props.match.params.id}`
      }]);
    }
  }, [props.warehouse, props.match.params.id, routes.length]);

  React.useEffect(() => {
    const id = props.match.params.id;    
    if (id) fetchWarehouseById(id);
  }, [props.match.params.id, fetchWarehouseById]);

  React.useEffect(() => {
    if (props.warehouse) setOpenSnackBar(false);
    if (!existingWarehouse && props.warehouse) {
      setExistingWarehouse(props.warehouse);
    }
  }, [props.warehouse, existingWarehouse]);

  const handleDialogCancel = (hasFilesChange) => {
    setResetWarehouse(() => ({...existingWarehouse}));
    if (hasFilesChange) {
      setOpenCancel(true);
    }
  }

  const renderDialogCancel = () => {
    return (
      <Dialog
        open={openCancel}
        fullWidth
        keepMounted
        m={2}
        onClose={() => setOpenCancel(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Changes on images and documents won't be save, continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancel(false)} variant="outlined">
            No
          </Button>
          <Button onClick={() => window.location.reload()} variant="contained" color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <div className="container">
      <Breadcrumbs routes={routes} />
      <Grid container spacing={2}
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
        <Grid item xs={12} md={3}>
          <WarehouseSideBar id={props.match.params.id} deleteId={existingWarehouse.warehouse_id} editMode />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className="paper" elevation={0} variant="outlined" style={{position:'relative'}}>
            <Typography variant="subtitle1" className="paper__heading">Edit Warehouse</Typography>
            <div className="paper__divider"></div>
            <WarehouseForm handleDialogCancel={handleDialogCancel} onSubmit={handleSubmit} onError={handleError} warehouse={existingWarehouse} resetWarehouse={resetWarehouse} />
          </Paper>
        </Grid>
        <Snackbar open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
        {renderDialogCancel()}
      </Grid>
    </div>
  )
}
const mapStateToProps = (state, ownProps) => {
  return { 
    warehouse: state.warehouses.data[ownProps.match.params.id],
    error: state.error
  }
}

export default connect(mapStateToProps, { fetchWarehouseById })(WarehouseEdit);