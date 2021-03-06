import _ from 'lodash';
import history from 'config/history';
import React, { useEffect, useState } from 'react';
import WarehouseDialog from 'components/WarehouseDialog';
import WarehouseMasterDataSKUForm from 'components/WarehouseSKU/SKU/Form';

import { THROW_ERROR } from 'actions/types';
import { createWarehouseSKU, tagSKU } from 'actions';
import { dispatchError } from 'helper/error';
import { uploadSKUFilesById } from 'actions';
import { connect, useDispatch } from 'react-redux';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Breadcrumbs from 'components/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Spinner from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

// Alerts
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function WarehouseMasterDataSKUCreate (props) {
  const dispatch = useDispatch();
  const [created, setCreated] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({severity: 'info', message: 'Loading...'});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState({ open: false });
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [status, setStatus] = React.useState({ images: false, sku: false });

  const routes = [
    { label: 'SKU Management', path: '/sku-management' },
    { label: 'Creating SKU', path: `/sku-management/sku/create` }
  ];

  // Form submit handler
  const onSubmit = data => {
    setAlertConfig({ severity: 'info', message: 'Creating SKU...' });
    setOpenSnackBar(true);

    const SKUData = {
      warehouse: props.match.params.id,
      product_name: data.productName,
      project_type: data.projectType,
      uoh: data.unitOfHandling,
      uom: data.unitOfMeasurement,
      external_code: data.externalCode,
      code: data.code,
      value_per_unit: Number(data.valuePerHandling),
      length: Number(data.length),
      width: Number(data.width),
      height: Number(data.height),
      weight: Number(data.weight),
      storage_type: data.storageType,
      batch_management: data.batchManagement,
      expiry_management: data.expiryManagement,
      remarks: data.remarks,
    }

    createWarehouseSKU(SKUData)
      .then(res => {
        const skuId = res.data.id;
        tagSKU(data.client, [skuId], [], [])
          .then(res => {
            let delayInMilliseconds = 500;
            setTimeout(function() {
              setOpenSnackBar(true);
              setAlertConfig({ severity: 'success', message: 'Successfuly saved' });
              setStatus(prevState => { return {...prevState, sku: true }});
              setOpenBackdrop(false);
            }, delayInMilliseconds);
          });
        if (data.images.length > 1) {
          handleImageUpload(res.data.id, data);
        } else {
          setStatus(prevState => { return {...prevState, images: true }});
        }
        // if (res.status === 201) setStatus(prevState => { return {...prevState, sku: true }});
      })
      .catch(error => {
        if (error.response.data.type === '23505') {
          setAlertConfig({ severity: 'error', message: `Product code already exists.` });
        } else {
          dispatchError(dispatch, THROW_ERROR, error);
        }
      });
  }

  // Function for image upload
  const handleImageUpload = (warehouseId, data) => {
    uploadSKUFilesById(warehouseId, null, data.images[data.images.length - 1])
      .then(res => {
        if (res.status === 201) {
          setStatus(prevState => { return {...prevState, images: true }});
        };
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }

  // Set created status to true if all api response is success
  useEffect(() => {
    if (!Object.values(status).includes(false)) {
      setCreated(true);
    }
  }, [status]);

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
        pathname: `/sku-management`,
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
        <Grid item xs={12} md={12}>
          <Paper className="paper create-sku" elevation={0} variant="outlined">
            <Typography variant="subtitle1" className="paper__heading">Creating SKU</Typography>
            <div className="paper__divider" />
            <WarehouseMasterDataSKUForm handleDialog={handleDialog} onSubmit={onSubmit} onError={handleError} />
          </Paper>
        </Grid>
        <Snackbar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1000 }}  anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
          <Alert severity={alertConfig.severity}>{alertConfig.message}</Alert>
        </Snackbar>
        <Spinner sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }} open={openBackdrop}>
          <CircularProgress color="inherit" />
        </Spinner>
        <WarehouseDialog
          openDialog={openDialog.open}
          diaglogText="Changes won't be save, continue?"
          dialogTitle="Confirmation"
          buttonConfirmText="Yes"
          buttonCancelText="No"
          dialogAction={() => history.push(`/sku-management`)}
        />
      </Grid>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return { 
    error: state.error
  }
}

export default connect(mapStateToProps)(WarehouseMasterDataSKUCreate);