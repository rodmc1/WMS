import _ from 'lodash';
import history from 'config/history';
import React, { useEffect } from 'react';

import WarehouseDialog from 'components/WarehouseDialog';
import WarehouseMasterDataSidebar from 'components/WarehouseMasterData/Sidebar';
import WarehouseMasterDataSKUForm from 'components/WarehouseMasterData/SKU/Form';

import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { fetchSKUByName, fetchWarehouseSKUs, updateWarehouseSKU, uploadSKUFilesById, deleteSKUPhotosById } from 'actions';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Breadcrumbs from 'components/Breadcrumbs';
import Typography from '@mui/material/Typography';

// Alerts
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function WarehouseMasterDataSKUDetail (props) {
  const dispatch = useDispatch();
  const [sku, setSKU] = React.useState('');
  const [edited, setEdited] = React.useState(false);
  const [existingSKU, setExistingSKU] = React.useState('');
  const [alertConfig, setAlertConfig] = React.useState({severity: 'info', message: 'Loading...'});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState({ open: false });
  const [status, setStatus] = React.useState({ images: false, sku: false });

  const routes = [
    { label: 'Warehouse Master Data', path: '/warehouse-master-data' },
    { label: props.match.params.id, path: `/warehouse-master-data/${props.match.params.id}/overview` }
  ];

  // Form submit handler
  const onSubmit = data => {
    setAlertConfig({ severity: 'info', message: 'Saving Changes...' });
    setOpenSnackBar(true);
    
    const SKUData = {
      warehouse: props.match.params.id,
      product_name: data.productName,
      uoh: data.unitOfHandling,
      uom: data.uom,
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
      id: Number(props.match.params.item_id)
    }
    
    //Images upload and delete
    if (data.images.length > 1) {
      handleImageUpdate(data);
    } else {
      setStatus(prevState => { return {...prevState, images: true }});
    }

    updateWarehouseSKU(props.match.params.item_id, SKUData)
      .then(response => {
        if (response.status === 201) {
          setStatus(prevState => { return {...prevState, sku: true }});
        }
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
      });
  }

  // Function for image updates
  const handleImageUpdate = (data) => {
    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp', 'jfif'];
    const newImages = data.images[data.images.length - 1].map(i => { return  i.name }); 
    let existingSKUImages = [];
    
    if (existingSKU.item_document_file_type) {
      existingSKUImages = existingSKU.item_document_file_type.map(i => { return i.item_filename });
      existingSKU.item_document_file_type.forEach(file => {
        if (imageExtensions.includes(file.item_filename.split('.').pop().toLowerCase()) && !newImages.includes(file.item_filename)) {
          deleteSKUPhotosById(file.item_document_file_id);
        }
      });
    }
    
    data.images[data.images.length - 1].forEach(file => {
      if (!existingSKUImages.includes(file.name)) {
        uploadSKUFilesById(existingSKU.item_id, existingSKU.item_document_id, data.images[data.images.length - 1])
      }
    });
    setInterval(() => { 
      setStatus(prevState => { return {...prevState, images: true }});
    }, 700);
  }

  const handleError = error => {
    console.log(error);
  }

  // Set edit state to true if all api response is success
  useEffect(() => {
    if (!Object.values(status).includes(false)) {
      setEdited(true);
    }
  }, [status]);

  // Set new routes and path based on the selected warehouse
  useEffect(() => {
    if (edited) {
      history.push({
        pathname: `/warehouse-master-data/${props.match.params.id}/sku`,
        success: 'Successfuly saved'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [edited]);

  // Redirect to SKU list on page refresh
  useEffect(() => {
    if (props.location.data) {
      setSKU(props.location.data);
      if (!existingSKU) setExistingSKU(props.location.data);
    } else {
      window.location.href = `/warehouse-master-data/${props.match.params.id}/sku`
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  // Error Alert Configs
  useEffect(() => {
    if (!_.isEmpty(props.error)) {
      if (props.error.status === 401) {
        setAlertConfig({ severity: 'error', message: 'Session Expired, please login again..' });
      } else {
        setAlertConfig({ severity: 'error', message: props.error.data.type +': '+ props.error.data.message });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [props.error]);

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
          <WarehouseMasterDataSidebar id={props.match.params.id} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className="paper edit-sku" elevation={0} variant="outlined">
            <Typography variant="subtitle1" className="paper__heading">SKU</Typography>
            <div className="paper__divider"></div>
            <WarehouseMasterDataSKUForm sku={sku} handleDialog={handleDialog} onSubmit={onSubmit} onError={handleError} />
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
          dialogAction={() => history.push(`/warehouse-master-data/${props.match.params.id}/sku`)}
        />
      </Grid>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    sku: state.sku,
    error: state.error
  }
}

export default connect(mapStateToProps, { fetchWarehouseSKUs, fetchSKUByName })(WarehouseMasterDataSKUDetail);