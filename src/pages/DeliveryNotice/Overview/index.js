import { connect } from 'react-redux';
import './style.scss';
import React, { useEffect } from 'react';
import { fetchWarehouseById } from 'actions';
import WarehouseSideBar from 'components/WarehouseDeliveryNotice/SideBar';

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
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import AllInboxIcon from '@material-ui/icons/AllInbox';

function DeliveryNoticeOverview(props) {
  const [warehouse, setWarehouse] = React.useState(null);
  const routes = [
    {
      label: 'Delivery Notice',
      path: '/delivery-notice'
    },
    {
      label: 'test',
      path: `/delivery-notice/overview`
    }
  ];

  // Fetch and set warehouse details 
  useEffect(() => {
    const id = props.match.params.id;
    if (!props.warehouse) {
      props.fetchWarehouseById(id);
    } else {
      setWarehouse(props.warehouse);
    }
  }, [props.warehouse]);

  const renderInformation = () => {
    return (
      <Paper className="paper delivery-notice-overview" elevation={0} variant="outlined">
        <Typography variant="subtitle1" className="paper__heading">test id</Typography>
        <div className="paper__divider" />
        <Typography variant="subtitle1" className="paper__heading content-heading">General Information</Typography>
        <Grid container spacing={2} >
          <Grid item xs={5} >
            <ListItem>
              <HomeWorkIcon />
              <ListItemText primary="Warehouse Client" secondary={'Puratos Philippines'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <HomeWorkIcon />
              <ListItemText primary="Warehouse" secondary={'test'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="Transaction Type" secondary={'Inbound'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <EventIcon />
              <ListItemText primary="Booking Date" secondary={'ABC'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <AllInboxIcon />
              <ListItemText primary="Delivery Mode" secondary={'Batch'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <EventIcon />
              <ListItemText primary="Appointed Date" secondary={'test'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LocalShippingIcon />
              <ListItemText primary="Type of Trucks" secondary={'test'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LocalShippingIcon />
              <ListItemText primary="Quantity of Truck" secondary={'ABC'} />
            </ListItem>
          </Grid>
        </Grid>
        <Typography variant="subtitle1" className="paper__heading content-heading mt-3">External Information</Typography>
        <Grid container spacing={2} >
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="Booking Number" secondary={'Purator Philippines'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="Operation Type" secondary={'Inbound'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="External Reference Number" secondary={'Batch'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LocalShippingIcon />
              <ListItemText primary="Subcon/Forwarder/Supplier" secondary={'test'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="Project Team" secondary={'test'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <PersonIcon />
              <ListItemText primary="Created By" secondary={'ABC'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="WBS Code" secondary={'test'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <SmsIcon />
              <ListItemText primary="Remarks" secondary={'ABC'} />
            </ListItem>
          </Grid>
          <Grid item xs={5} >
            <ListItem>
              <LabelIcon />
              <ListItemText primary="CCID/WO/PO" secondary={'ABC'} />
            </ListItem>
          </Grid>
        </Grid>
        <Typography variant="subtitle1" className="paper__heading content-heading mt-3">External Documents</Typography>
        <Typography variant="subtitle1" className="paper__heading content-heading mt-3">Appointment Confirmation</Typography>
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
          <WarehouseSideBar id={props.match.params.id} />
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
    warehouse: state.warehouses.data[ownProps.match.params.id]
  }
}

export default connect(mapStateToProps, { fetchWarehouseById } )(DeliveryNoticeOverview);