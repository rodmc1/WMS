import { connect } from 'react-redux';
import './style.scss';
import history from 'config/history';
import React, { useEffect, useState } from 'react';
import { fetchDeliveryNoticeByName, fetchDeliveryNoticeById } from 'actions';
import WarehouseSideBar from 'components/WarehouseDeliveryNotice/SideBar';
import Breadcrumbs from 'components/Breadcrumbs';

import Grid from '@mui/material/Grid';
import Badge from '@mui/material/Badge';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ListItem from "@mui/material/ListItem";
import Typography from '@mui/material/Typography';
import EventIcon from "@mui/icons-material/Event";
import LabelIcon from '@mui/icons-material/Label';
import PersonIcon from '@mui/icons-material/Person';
import ListItemText from "@mui/material/ListItemText";
import AllInboxIcon from '@mui/icons-material/AllInbox';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

function DeliveryNoticeOverview(props) {
  const [deliveryNotice, setDeliveryNotice] = React.useState([]);
  const [externalDocument, setExternalDocument] = useState(null);
  const [appointmentDocument, setAppointmentDocument] = useState(null);

  const routes = [
    {
      label: 'Delivery Notice',
      path: '/delivery-notice'
    },
    {
      label: props.match.params.id,
      path: `/delivery-notice/${props.match.params.id}/overview`
    },
    {
      label: `Overview`,
      path: `/delivery-notice/${props.match.params.id}/overview`
    }
  ];

  const renderDocuments = (obj) => {
    const pdfIcon = '/assets/images/pdfIcon.svg';
    const preview = obj.delivery_notice_files.map(file => {
      return (
        <div className="document-preview" key={file.warehouse_filename}>
          <Badge ><img className="doc-img" src={pdfIcon} alt={file.warehouse_filename} /></Badge>
          <Badge><Typography variant='subtitle2'>{file.warehouse_filename}</Typography></Badge>
        </div>
      )
    });

    return preview;
  }

  /**
   * Redirect to edit delivery notice page
   */
  const handleEditWarehouse = () => {
    history.push(`/delivery-notice/${props.match.params.id}/edit`);
  }

  /**
   * set initial files for documents
   */
  useEffect(() => {
    if (deliveryNotice !== null && deliveryNotice.constructor.name === "Object") {
      if (Array.isArray(deliveryNotice.delivery_notice_document_file_type)) {
        let externalDocument;
        let appointmentConfirmation;
        deliveryNotice.delivery_notice_document_file_type.forEach(file => {
          if (file.description === 'External Document' && file.delivery_notice_files !== null) externalDocument = file;
          if (file.description === 'Appointment Confirmation' && file.delivery_notice_files !== null) appointmentConfirmation = file;
        })
        setExternalDocument(externalDocument);
        setAppointmentDocument(appointmentConfirmation);
      }
    }
  }, [deliveryNotice]);

  /**
   * Fetch and set delivery notice details 
   */
  useEffect(() => {
    if (!history.location.data && !props.notice) props.fetchDeliveryNoticeById(props.match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  /**
   * Fetch and set delivery notice details 
   */
  useEffect(() => {
    if (props.notice) setDeliveryNotice(props.notice);
    if (history.location.data) setDeliveryNotice(history.location.data);
  }, [props.notice]);

  /**
   * JXS for delivery notice details
   */
  const renderInformation = () => {
    return (
      <Paper className="paper delivery-notice-overview" elevation={0} variant="outlined">
        <div className="flex justify-space-between align-center">
          <Typography variant="subtitle1" className="paper__heading">{deliveryNotice.unique_code}</Typography>
          <div className="button-group">
            <Button variant="contained" className="btn btn--emerald" onClick={handleEditWarehouse} disableElevation>Edit</Button>
          </div>
        </div>
        <div className="paper__divider" />
        <Typography variant="subtitle1" className="paper__heading content-heading">General Information</Typography>
        <Grid container spacing={2} >
          <Grid item xs={5} >
            <ListItem>
              <HomeWorkIcon />
              <ListItemText primary="Warehouse Client" secondary={deliveryNotice.warehouse_client} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <HomeWorkIcon />
              <ListItemText primary="Warehouse" secondary={deliveryNotice.warehouse_name} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="Transaction Type" secondary={deliveryNotice.transaction_type} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <EventIcon />
              <ListItemText primary="Booking Date" secondary={deliveryNotice.appointment_datetime && deliveryNotice.booking_datetime.slice(0, 10)} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <AllInboxIcon />
              <ListItemText primary="Delivery Mode" secondary={deliveryNotice.delivery_mode} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <EventIcon />
              <ListItemText primary="Appointed Date" secondary={deliveryNotice.appointment_datetime && deliveryNotice.appointment_datetime.slice(0, 10)} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LocalShippingIcon />
              <ListItemText primary="Type of Trucks" secondary={deliveryNotice.asset_type} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LocalShippingIcon />
              <ListItemText primary="Quantity of Truck" secondary={deliveryNotice.qty_of_trucks} />
            </ListItem>
          </Grid>
        </Grid>
        <Typography variant="subtitle1" className="paper__heading content-heading mt-3">External Information</Typography>
        <Grid container spacing={2} >
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="Booking Number" secondary={deliveryNotice.job_order_number} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="Operation Type" secondary={deliveryNotice.operation_type} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="External Reference Number" secondary={deliveryNotice.external_reference_number} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LocalShippingIcon />
              <ListItemText primary="Subcon/Forwarder/Supplier" secondary={deliveryNotice.subcon_forwarder_supplier} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="Project Team" secondary={deliveryNotice.project_team} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <PersonIcon />
              <ListItemText primary="Created By" secondary={deliveryNotice.created_by} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="WBS Code" secondary={deliveryNotice.wbs_code} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="CCID/WO/PO" secondary={deliveryNotice.ccid_wo_po} />
            </ListItem>
          </Grid>
        </Grid>
        <Typography variant="subtitle1" className="paper__heading content-heading mt-3">External Documents</Typography>
        { externalDocument ? renderDocuments(externalDocument) :<Typography variant="body2" className="mt-1">No document uploaded</Typography> }
        <Typography variant="subtitle1" className="paper__heading content-heading mt-3">Appointment Confirmation</Typography>
        { appointmentDocument ? renderDocuments(appointmentDocument) : <Typography variant="body2" className="mt-1">No document uploaded</Typography> }
      </Paper>
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
          <WarehouseSideBar id={props.match.params.id} deleteId={deliveryNotice && deliveryNotice.delivery_notice_id} />
        </Grid>
        <Grid item xs={9}>
          {renderInformation()}
        </Grid>
      </Grid>
    </div>
  )
}

/**
 * Redux states to component props
 */
const mapStateToProps = (state, ownProps) => {
  return { 
    notice: state.notice.data[ownProps.match.params.id],
  }
}

export default connect(mapStateToProps, { fetchDeliveryNoticeByName, fetchDeliveryNoticeById } )(DeliveryNoticeOverview);