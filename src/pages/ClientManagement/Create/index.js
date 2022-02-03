import _ from 'lodash';
// import './style.scss';
import history from 'config/history';
import React, { useEffect } from 'react';
import WarehouseDialog from 'components/WarehouseDialog';
import ClientManagementForm from 'components/ClientManagement/Form';
import WarehouseSideBar from 'components/ClientManagement/Sidebar';

import { THROW_ERROR } from 'actions/types';
import { createWarehouseClient, fetchAllWarehouseSKUs, searchWarehouseSKUByName, tagSKU, uploadClientImageById } from 'actions';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Breadcrumbs from 'components/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import MenuList from "@mui/material/MenuList";
import TextField from '@mui/material/TextField';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// Alerts
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ClientManagementCreate (props) {
  const dispatch = useDispatch();
  const [created, setCreated] = React.useState(false);
  const [itemQuery, setItemQuery] = React.useState('');
  const [SKU, setSKU] = React.useState([]);
  const [alertConfig, setAlertConfig] = React.useState({severity: 'info', message: 'Loading...'});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState({ open: false });
  const [status, setStatus] = React.useState({ client: false, images: false });
  const [openSKUTag, setOpenSKUTag] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState([]);
  const [items, setItems] = React.useState([]);
  const [searchedItem, setSearchedItem] = React.useState(null);
  const [createdClientData, setCreatedClientData] = React.useState(null);
  const [clientSKUs, setClientSKUs] = React.useState([]);
  const isAllSelected = isChecked.length > 0 && isChecked.length === SKU.length;

  const routes = [
    { label: 'Client Management', path: '/client-management' },
    { label: 'Create Client', path: `/client-management/create` }
  ];

  // Form submit handler
  const onSubmit = data => {
    setOpenSKUTag(true);

    const clientData = {
      name: data.companyName,
      address: data.address,
      country: data.country,
      client_status: 'OTHERS',
      warehouse_client: 'Warehouse Client'
    }

    if (data.owner || data.contactPerson) {
      clientData.users_details = [];

      if (data.owner) {
        clientData.users_details.push(
          {
            last_name: null,
            first_name: data.ownerName,
            middle_name: null,
            mobile_number: data.ownerMobileNumber,
            password: "default",
            email_address: data.ownerEmail,
            role: "Owner",
            username: data.ownerEmail
          }
        )
      }

      if (data.contactPerson) {
        clientData.users_details.push(
          {
            last_name: null,
            first_name: data.contactPersonName,
            middle_name: null,
            mobile_number: data.contactPersonMobileNumber,
            password: "default",
            email_address: data.contactPersonEmail,
            role: "Contact Person",
            username: data.contactPersonEmail
          }
        )
      }
    }
    
    createWarehouseClient(clientData)
      .then(res => {
        if (res.status === 201) {
          clientData.id = res.data;
          if (data.images.length > 0) {
            handleImageUpload(clientData.id, data.images);
          } else {
            setStatus(prevState => { return {...prevState, images: true }});
          }
          setCreatedClientData(clientData);
        }
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }

  // Function for image upload
  const handleImageUpload = (clientId, images) => {
    uploadClientImageById(clientId, [images[0].file])
      .then(res => {
        if (res.status === 201) {
          setStatus(prevState => { return {...prevState, images: true }});
        };
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }

  const handleTagSKU = () => {
    setOpenSnackBar(true);
    setAlertConfig({ severity: 'info', message: 'Creating Client...' });

    tagSKU(createdClientData.id, isChecked, []);
    var delayInMilliseconds = 1000;

    setTimeout(function() {
      setAlertConfig({ severity: 'success', message: 'Successfuly saved' });
      setStatus(prevState => { return {...prevState, client: true }});
      setOpenSKUTag(false);
    }, delayInMilliseconds);
  }

  const handleClose = () => {
    setOpenSKUTag(false);
  }

  const handleSkip = () => {
    setOpenSnackBar(true);
    setAlertConfig({ severity: 'info', message: 'Creating Client...' });
    var delayInMilliseconds = 400;

    setTimeout(function() {
      setAlertConfig({ severity: 'success', message: 'Successfuly saved' });
      setStatus(prevState => { return {...prevState, client: true }});
      setOpenSKUTag(false);
    }, delayInMilliseconds);
    
    setOpenSKUTag(false);
  }

  const checkAll = () => {
    if (isAllSelected) {
      setItems([]);
      setIsChecked([]);
    } else {
      setIsChecked(SKU.map(sku => sku.item_id));
    }
  }

  const toggleCheckboxValue = (item, bool) => {
    if (!isChecked.includes(item.item_id)) {
      setIsChecked(oldArray => [...oldArray, item.item_id]);
    } else {
      setIsChecked(isChecked.filter(check => check !== item.item_id));
    }

    if (bool) {
      setItems(items.filter(sku => sku.item_id !== item.item_id));
    } else {
      setItems(oldArray => [...oldArray, item]);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps 
  const handleSearchItems = React.useCallback(_.debounce(() => {
    searchWarehouseSKUByName({
      filter: itemQuery,
    }).then(response => {
      setSearchedItem(response.data);
    })
  }, 510), [itemQuery]);

  // Call delayedQuery function when user search and set new warehouse data
  React.useEffect(() => {
    if (itemQuery) {
      handleSearchItems()
    } else if (!itemQuery) {
      setSKU(clientSKUs)
    }
    return handleSearchItems.cancel;
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [itemQuery]);

  // Set new warehouse data with searched items
  React.useEffect(() => {
    if (searchedItem) {
      setSKU(searchedItem);
    }
  }, [searchedItem]);

  // Set query state on input change
  const handleItemSearch = (e) => {
    setSearchedItem(null);
    setItemQuery(e.target.value);
  }

  React.useEffect(() => {
    if (!SKU.length) {
      if (!itemQuery) {
        fetchAllWarehouseSKUs()
        .then(response => {
          setSKU(response.data);
          setClientSKUs(response.data)
        })
        .catch(error => {
          dispatchError(dispatch, THROW_ERROR, error);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [searchedItem]);

  // Set created status to true if all api response is success
  useEffect(() => {
    if (!Object.values(status).includes(false)) {
      setCreated(true);
    }
  }, [status]);

  React.useEffect(() => {
    fetchAllWarehouseSKUs()
      .then(response => {
        setSKU(response.data);
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  // Set created status to true if all api response is success
  useEffect(() => {
    if (!_.isEmpty(props.error)) {
      if (props.error.status === 401) {
        setAlertConfig({ severity: 'error', message: 'Session Expired, please login again..' });
      } else if (props.error.status === 500) {
        setAlertConfig({ severity: 'error', message: 'Internal Server Error' });
      } else if (props.error === 'Network Error') {
        setAlertConfig({ severity: 'error', message: 'Network Error...' });
      } else {
        setAlertConfig({ severity: 'error', message: props.error.data.type +': '+ props.error.data.message });
      }
    }
  }, [props.error]);

  // Redirect to warehouse list with success message
  useEffect(() => {
    if (created) {
      history.push({
        pathname: `/client-management`,
        success: 'Successfuly saved'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [created])

  const handleError = error => {
    console.log(error)
  }

  // Show dialog confirmation if user click cancel in warehouse form
  const handleDialog = () => {
    setOpenDialog(state => ({...state, open: true}));
  }

  return (
    <div className="container sku">
      <Breadcrumbs routes={routes} />
      <Grid container spacing={2}
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
        <Grid item xs={12} md={3}>
          <WarehouseSideBar id={props.match.params.id} createMode />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className="paper create-sku" elevation={0} variant="outlined">
            <Typography variant="subtitle1" className="paper__heading form_title">Client Information</Typography>
            <div className="paper__divider" />
            <ClientManagementForm handleDialog={handleDialog} onSubmit={onSubmit} onError={handleError} />
          </Paper>
        </Grid>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
        <WarehouseDialog
          openDialog={openDialog.open}
          diaglogText="Changes won't be save, continue?"
          dialogTitle="Confirmation"
          buttonConfirmText="Yes"
          buttonCancelText="No"
          dialogAction={() => history.push(`/client-management`)}
        />
        
        <Dialog
          open={openSKUTag}
          fullWidth
          keepMounted
          m={2}
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          className="tag-sku-dialog"
        >
          <DialogTitle>
            <div className="flex justify-space-between align-center receiving-title">
              <Typography sx={{paddingLeft: 0.5}}>Tag SKU to {createdClientData && createdClientData.name}</Typography>
            </div>
          </DialogTitle>
          <TextField
            className="sku-search-items tag-sku"
            variant="outlined"
            type="text" 
            value={itemQuery}
            required
            fullWidth
            placeholder="Search"
            onChange={handleItemSearch}
          />
          
          <DialogContent>
            <MenuList id="menu-list-grow">
              {SKU.length ?
                <MenuItem value="all" onClick={checkAll}>
                  <Checkbox 
                    checked={isAllSelected}
                  />
                  <ListItemText primary="Select All"/>
                </MenuItem> : null
              }
              {SKU.map((item) => (
                <MenuItem key={item.item_id} value={item.product_name} onClick={() => toggleCheckboxValue(item, isChecked.includes(item.item_id))} >
                  <Checkbox checked={isChecked.includes(item.item_id)} />
                  <ListItemText primary={item.product_name} />
                </MenuItem>
              ))}
            </MenuList>
          </DialogContent>
          <hr />
          <DialogActions>
            <Button onClick={handleSkip} variant="outlined">Skip for now</Button>
            <Button variant="contained" onClick={handleTagSKU}>Save</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return { 
    error: state.error,
  }
}

export default connect(mapStateToProps)(ClientManagementCreate);