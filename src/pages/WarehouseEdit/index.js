import React from 'react';
import { connect } from 'react-redux';
import { fetchWarehouseById, deleteWarehouseById, updateUserById, uploadWarehouseFilesById, deleteWarehouseFilesById, updateWarehouseById } from 'actions/index';
import WarehouseSideBar from 'components/WarehouseSidebar';
import WarehouseForm from 'components/WarehouseForm';
import Breadcrumbs from 'components/Breadcrumbs';
import { SnackbarContext } from 'context/Snackbar';
import { ERROR, SNACKBAR } from 'config/constants';
import history from 'config/history';

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
  const [snackbarConfig, setSnackbarConfig] = React.useContext(SnackbarContext);
  const [open, setOpen] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [edited, setEdited] = React.useState(false);
  const [existingWarehouse, setExistingWarehouse] = React.useState(null);
  const [routes, setRoutes] = React.useState([
    {
      label: 'Warehouse List',
      path: '/warehouse-list'
    },
    {
      label: 'Edit Warehouse',
      path: '/warehouse-list'
    }
  ]);

  const [status, setStatus] = React.useState({
    images: false,
    docs: false,
    userBroker: false,
    userContact: false,
    warehouse: false
  });

  const handleSubmit = data => {
    setOpenSnackBar(true);

    const warehouse = {
      id: props.match.params.id,
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

    //Images upload and delete
    if (data.images.length) {
      handleImageUpdate(data);
    } else {
      setStatus(prevState => { return {...prevState, images: true }});
    }

    //Documents upload and delete
    if (data.docs.length) {
      handleDocumentUpdate(data);
    } else {
      setStatus(prevState => { return {...prevState, docs: true }});
    }
    
    //Handle users update
    handleUsersUpdate(data);

    //Handle warehouse update
    updateWarehouseById(props.match.params.id, warehouse).then(response => {
      if (response.statusText === 'Created') setStatus(prevState => { return {...prevState, warehouse: true }});
    });
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
    
    existingUserBroker.data = {
      last_name: existingUserBroker.data.last_name,
      first_name: existingUserBroker.data.first_name,
      middle_name: existingUserBroker.data.middle_name,
      mobile_number: existingUserBroker.data.mobile_number,
      email_address: existingUserBroker.data.email_address,
      role: 'Broker',
    }

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
  
    if (hasBrokerChange) updateUserById(existingUserBroker.data.user_id, newBroker);
    if (hasContactChange) updateUserById(existingUserContactPerson.data.user_id, newContactPerson);
    
    setStatus(prevState => { return {...prevState, userBroker: true, userContact: true }});
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
        uploadWarehouseFilesById(props.match.params.id, [file]);
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
    let testupload = [];
    data.images[data.images.length - 1].forEach(file => {
      if (!existingImages.includes(file.name)) {
        imageArr.push(file)
        testupload.push(uploadWarehouseFilesById(props.match.params.id, [file]))
      }
    });

    console.log(imageArr)

    // if (imageArr.length) {
    //   uploadWarehouseFilesById(props.match.params.id, imageArr).then(response => {
    //     if (response.statusText === 'Created') {
    //       setStatus(prevState => { return {...prevState, images: true }});
    //     }
    //   });
    // } else {
    //   setStatus(prevState => { return {...prevState, images: true }});
    // }

    Promise.all(testupload).then(response => {
      console.log(response);
      setStatus(prevState => { return {...prevState, images: true }});
    })
  }

  const handleDelete = (id) => {
    deleteWarehouseById(id).then(response => {
      if (response.status === 204) {
        history.push({
          pathname: '/warehouse-list',
          success: 'Warehouse deleted successfully'
        });
      }
    });
  }

  const handleError = error => {
    console.log(error)
  }

  React.useEffect(() => {
    if (edited) {
      history.push({
        pathname: '/warehouse-list',
        success: 'Changes saved successfully'
      });
    }
  }, [edited]);

  React.useEffect(() => {
    if (!Object.values(status).includes(false)) {
      setEdited(true);
    }
  }, [status]);

  React.useEffect(() => {
    if (props.warehouse) {
      setRoutes(routes => [...routes, {
        label: props.warehouse.warehouse_client,
        path: `/warehouse-list/overview/${props.match.params.id}`
      }]);
    }
  }, []);

  React.useEffect(() => {
    const id = props.match.params.id;    
    if (id) props.fetchWarehouseById(id);
  }, []);

  React.useEffect(() => {
    if (!existingWarehouse && props.warehouse) {
      setExistingWarehouse(props.warehouse);
    }
  }, [props.warehouse]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const renderDeleteDialog = () => {
    return (
      <Dialog
        open={open}
        fullWidth="sm"
        maxWidth="sm"
        keepMounted
        m={2}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this Warehouse?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={() => handleDelete(props.match.params.id)} variant="contained" color="secondary">
            Delete
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
          <WarehouseSideBar id={props.match.params.id} editMode handleClickOpen={handleClickOpen} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className="paper" elevation={0} variant="outlined">
            <Typography variant="subtitle1" className="paper__heading">Edit Warehouse</Typography>
            <div className="paper__divider"></div>
            <WarehouseForm onSubmit={handleSubmit} onError={handleError} warehouse={props.warehouse} />
          </Paper>
        </Grid>
        <Snackbar open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
          <Alert severity="info">Savings Changes...</Alert>
        </Snackbar>
        {renderDeleteDialog()}
      </Grid>
    </div>
  )
}
const mapStateToProps = (state, ownProps) => {
  return { 
    warehouse: state.warehouses.data[ownProps.match.params.id]
  }
}

export default connect(mapStateToProps, { fetchWarehouseById })(WarehouseEdit);