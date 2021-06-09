import React, { useEffect } from 'react';
import _ from 'lodash';
import history from 'config/history';
import WarehouseMasterDataSKUForm from 'components/WarehouseMasterData/SKU/Form';
import WarehouseMasterDataSidebar from 'components/WarehouseMasterData/Sidebar';
import WarehouseDialog from 'components/WarehouseDialog';
import Breadcrumbs from 'components/Breadcrumbs';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { connect, useDispatch } from 'react-redux';
import { createWarehouseSKU } from 'actions';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { uploadSKUFilesById } from 'actions';

import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

// Alerts
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function WarehouseMasterDataSKUCreate (props) {
  const [status, setStatus] = React.useState({ images: false, sku: false });
  const [created, setCreated] = React.useState(false);
  const [alertConfig, setAlertConfig] = React.useState({});
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState({ open: false });
  const dispatch = useDispatch();
  const routes = [
    {
      label: 'Warehouse Master Data',
      path: '/warehouse-master-data'
    },
    {
      label: props.match.params.id,
      path: `/warehouse-master-data/${props.match.params.id}/overview`
    },
    {
      label: 'Creating SKU',
      path: `/warehouse-master-data/${props.match.params.id}/sku/create`
    }
  ];

  console.log(status)

  const onSubmit = (data) => {
    setAlertConfig({ severity: 'info', message: 'Creating SKU...' });
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
      company_id: "2fb2aca3-79c6-45db-8301-6403edb16288"
    }
    createWarehouseSKU(SKUData)
      .then(res => {
        console.log(res.data);
        if (data.images.length > 1) {
          handleImageUpload(res.data.id, data);
        } else {
          setStatus(prevState => { return {...prevState, images: true }});
        }

        if (res.status === 201) setStatus(prevState => { return {...prevState, sku: true }});
      })
      .catch(error => {
        dispatchError(dispatch, THROW_ERROR, error);
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
      }
      if (props.error === 'Network Error') {
        setAlertConfig({ severity: 'error', message: 'Network Error...' });
      }
      // else {
      //   setAlertConfig({ severity: 'error', message: props.error.data.type +': '+ props.error.data.message });
      // }
    }
  }, [props.error]);

  // Redirect to warehouse list with success message
  useEffect(() => {
    if (created) {
      history.push({
        pathname: `/warehouse-master-data/${props.match.params.id}/sku`,
        success: 'Successfuly saved'
      });
    }
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
          <WarehouseMasterDataSidebar id={props.match.params.id} />
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper className="paper create-sku" elevation={0} variant="outlined">
            <Typography variant="subtitle1" className="paper__heading">Creating SKU</Typography>
            <div className="paper__divider" />
            {/* <WarehouseMasterDataForm  onSubmit={handleSubmit} onError={handleError} /> */}
            <WarehouseMasterDataSKUForm handleDialog={handleDialog} onSubmit={onSubmit} onError={handleError} />
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

const mapStateToProps = (state, ownProps) => {
  return { 
    error: state.error
  }
}

export default connect(mapStateToProps)(WarehouseMasterDataSKUCreate);