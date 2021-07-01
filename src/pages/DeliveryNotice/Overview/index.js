import { connect } from 'react-redux';
import './style.scss';
import _ from 'lodash';
import history from 'config/history';
import React, { useEffect, useState } from 'react';
import { fetchDeliveryNoticeByName, fetchDeliveryNoticeById } from 'actions';
import WarehouseSideBar from 'components/WarehouseDeliveryNotice/SideBar';

import Badge from '@material-ui/core/Badge';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from 'components/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import EventIcon from "@material-ui/icons/Event";
import LabelIcon from '@material-ui/icons/Label';
import PhoneIcon from '@material-ui/icons/Phone';
import SmsIcon from '@material-ui/icons/Sms';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import PersonIcon from '@material-ui/icons/Person';
import Button from '@material-ui/core/Button';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import AllInboxIcon from '@material-ui/icons/AllInbox';

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
    console.log(obj)
    const pdfIcon = '/assets/images/pdfIcon.svg';
    const preview = obj.delivery_notice_files.map(file => {
      return (
        <div className="document-preview">
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

  useEffect(() => {
    if (deliveryNotice !== null && deliveryNotice.constructor.name === "Object") {
      if (Array.isArray(deliveryNotice.delivery_notice_document_file_type)) {
        let externalDocument;
        let appointmentConfirmation;
        deliveryNotice.delivery_notice_document_file_type.map(file => {
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
  }, []);

  console.log(history.location.data)
  console.log(props.notice)

  /**
   * Fetch and set delivery notice details 
   */
   useEffect(() => {
    if (props.notice) setDeliveryNotice(props.notice);
    if (history.location.data) setDeliveryNotice(history.location.data);
  }, [props.notice]);

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
  
console.log(props.notice)
console.log(deliveryNotice)
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


const mapStateToProps = (state, ownProps) => {
  return { 
    notice: state.notice.data[ownProps.match.params.id],
  }
}

export default connect(mapStateToProps, { fetchDeliveryNoticeByName, fetchDeliveryNoticeById } )(DeliveryNoticeOverview);