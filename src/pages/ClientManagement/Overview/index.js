import './style.scss';
import React from 'react';
import { connect } from 'react-redux';
import { fetchWarehouseById, fetchWarehouseClient } from 'actions/index';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MuiAlert from '@mui/material/Alert';
import Breadcrumbs from 'components/Breadcrumbs';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import ClientSideBar from 'components/ClientManagement/Sidebar';
import Chip from '@mui/material/Chip';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Functional component for warehouse overview
function WarehouseOverview(props) {
  const [open, setOpen] = React.useState(false);
  const [clientData, setClientData] = React.useState([]);
  const [routes, setRoutes] = React.useState([{ label: 'Client Management', path: '/client-management' }]);

  const renderStatus = data => {
    let jsx = <Chip label={data} className="status-chip" />
    if (data === 'ACCREDITED') jsx = <Chip label="Accredited" className="status-chip blue" />;
    if (data === 'POTENTIAL') jsx = <Chip label="Potential" className="status-chip green" />;
    if (data === 'ON CAll') jsx = <Chip label="On Call" className="status-chip gold" />;
    if (data === 'LOCK IN') jsx = <Chip label="Lock In" className="status-chip tangerine" />;
    if (data === 'REGULAR') jsx = <Chip label="Regular" className="status-chip emerald" />;
    if (data === 'OTHERS') jsx = <Chip label="Others" className="status-chip" />;
    return jsx
  }

  // Fetch warehouse by selected warehouse id and set warehouse data
  React.useEffect(() => {
    const id = props.match.params.id;
    if (!props.client) {
      props.fetchWarehouseClient({filter: id});
    } else {
      setClientData(props.client);
    }
    
  }, [props.client]);

  // Fetch warehouse by selected warehouse id and set warehouse data
  React.useEffect(() => {
    const id = props.match.params.id;
    if (props.location.success) {
      setOpen(true);
      props.fetchWarehouseClient({filter: id});
    }
  }, [props.location.success]);

  // Set new route for selected warehouse
  React.useEffect(() => {
    if (props.client && routes.length === 1) {
      setRoutes(routes => [...routes, {
        label: props.match.params.id,
        path: `/client-management/${props.match.params.id}/overview`
      }]);
    }
  }, [props.client, props.match.params.id, routes.length]);
  
  return (
    clientData &&
    <div className="container">
      <Breadcrumbs routes={routes} />
      <Grid container spacing={2} 
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
          <Grid item xs={3}>
            <ClientSideBar id={props.match.params.id} deleteId={clientData && clientData.id} />
          </Grid>        
          <Grid item xs={9}>
            <Paper elevation={0} className="paper" variant="outlined">
              <Typography variant="subtitle1" className="paper__heading">Client Information</Typography>
              <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                  <label className="paper__label">Company Name</label>
                  <p className="paper__text">{clientData.client_name}</p>
                </Grid>
                <Grid item xs={12} md={4}>
                  <label className="paper__label">Address</label>
                  <p className="paper__text">{clientData.client_address}</p>
                </Grid>
                <Grid item xs={12} md={4}>
                  <label className="paper__label">Number of SKU</label>
                  <p className="paper__text">{clientData.total_sku}</p>
                </Grid>
                {/* temporary remove */}
                {/* <Grid item xs={12} md={3}>
                  <label className="paper__label">Status</label>
                  <p className="paper__text">{renderStatus(clientData.status)}</p>                  
                </Grid> */}
              </Grid>
            </Paper>
          </Grid>
          <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}} open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
            <Alert severity="success">{props.location.success}</Alert>
          </Snackbar>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return { 
    client: state.client.data[ownProps.match.params.id],
  }
}

export default connect(mapStateToProps, { fetchWarehouseById, fetchWarehouseClient })(WarehouseOverview);