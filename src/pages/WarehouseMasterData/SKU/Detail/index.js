import React, { useEffect } from 'react';
import history from 'config/history';
import _ from 'lodash';
import WarehouseMasterDataSKUForm from 'components/WarehouseMasterData/SKU/Form';
import WarehouseMasterDataSidebar from 'components/WarehouseMasterData/Sidebar';
import WarehouseDialog from 'components/WarehouseDialog';
import { fetchSKUByName, fetchWarehouseSKUs, updateWarehouseSKU, uploadSKUFilesById, deleteSKUPhotosById } from 'actions';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import Breadcrumbs from 'components/Breadcrumbs';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { connect, useDispatch } from 'react-redux';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

// Alerts
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function WarehouseMasterDataSKUDetail (props) {
  const [images, setImages] = React.useState([]);
  const [sku, setSKU] = React.useState('');
  const [edited, setEdited] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [existingSKU, setExistingSKU] = React.useState('');
  const [openDialog, setOpenDialog] = React.useState({ open: false });
  const dispatch = useDispatch();

  // State for api responses
  const [status, setStatus] = React.useState({ images: false, sku: false });

  const routes = [
    {
      label: 'Warehouse Master Data',
      path: '/warehouse-master-data'
    },
    {
      label: props.match.params.id,
      path: `/warehouse-master-data/${props.match.params.id}/overview`
    }
  ];

  const onSubmit = data => {
    setAlertConfig({ severity: 'info', message: 'Saving Changes...' });
    setOpenSnackBar(true);

    const SKUData = {
      warehouse: props.match.params.id,
      product_name: data.productName,
      uom: data.uom,
      external_code: data.externalCode,
      code: data.code,
      min_quantity: Number(data.minQuantity),
      max_quantity: Number(data.maxQuantity),
      value_per_unit: Number(data.valuePerUnit),
      length: Number(data.length),
      width: Number(data.width),
      height: Number(data.height),
      weight: Number(data.weight),
      storage_type: data.storageType,
      batch_management: data.batchManagement,
      expiry_management: data.expiryManagement,
      remarks: data.remarks,
      company_id: "2fb2aca3-79c6-45db-8301-6403edb16288",
      id: props.match.params.item_id
    }

    console.log(data);
    
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
    let existingImages = [];
    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp', 'jfif'];
    const newImages = data.images[data.images.length - 1].map(i => { return  i.name }); 
    
    if (existingSKU.item_document_file_type) {
      existingImages = existingSKU.item_document_file_type.map(i => {
        return imageExtensions.includes(i.item_filename.split('.').pop().toLowerCase()) && i.item_filename;
      });

      existingSKU.item_document_file_type.forEach(file => {
        if (imageExtensions.includes(file.item_filename.split('.').pop().toLowerCase()) && !newImages.includes(file.item_filename)) {
          deleteSKUPhotosById(file.item_document_file_id);
        }
      });
    }

    let imageArr = [];
    data.images[data.images.length - 1].forEach(file => {
      if (!existingImages.includes(file.name)) {
        imageArr.push(uploadSKUFilesById(existingSKU.item_id, existingSKU.item_document_id, [file]))
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

  // Function for image upload
  // const handleImageUpload = data => {
  //   const documentId = props.location.data.item_document_id || null;
  //   const itemId = props.match.params.item_id
  //   uploadSKUFilesById(itemId, documentId, data.images[data.images.length - 1])
  //     .then(res => {
  //       if (res.status === 201) {
  //         setStatus(prevState => { return {...prevState, images: true }});
  //       };
  //     })
  //     .catch(error => {
  //       dispatchError(dispatch, THROW_ERROR, error);
  //     });
  // }

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
  }, [edited]);

  // Redirect to SKU list on page refresh
  useEffect(() => {
    if (props.location.data) {
      setSKU(props.location.data);
      if (!existingSKU) setExistingSKU(props.location.data);
    } else {
      window.location.href = `/warehouse-master-data/${props.match.params.id}/sku`
    }
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
            {/* <WarehouseMasterDataForm handleDialogCancel={handleDialogCancel} onSubmit={handleSubmit} onError={handleError} /> */}
            <WarehouseMasterDataSKUForm sku={sku} handleDialog={handleDialog} onSubmit={onSubmit} onError={handleError} />
          </Paper>
        </Grid>
        <Snackbar open={openSnackBar} onClose={() => setOpenSnackBar(false)}>
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
        {/* {renderDialogCancel()} */}
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