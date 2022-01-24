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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Functional component for warehouse overview
function WarehouseOverview(props) {
  const [open, setOpen] = React.useState(false);
  const [clientData, setClientData] = React.useState([]);
  const [routes, setRoutes] = React.useState([{ label: 'Client Management', path: '/client-management' }]);

  // Open success alert if edit warehouse pass a success props
  React.useEffect(() => {
    if (props.location.success) {
      console.log('success edit')
      setOpen(true);
      // fetchWarehouseById(props.match.params.id);
    }
  }, [props.location.success, props.match.params.id]);

  // Fetch warehouse by selected warehouse id and set warehouse data
  React.useEffect(() => {
    const id = props.match.params.id;
    if (!props.client) {
      props.fetchWarehouseClient({filter: id});
    } else {
      setClientData(props.client);
    }
  }, [props.client, props.match.params.id]);

  // Set new route for selected warehouse
  React.useEffect(() => {
    if (props.client && routes.length === 1) {
      setRoutes(routes => [...routes, {
        label: 'test',
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
              <Grid item xs={12} md={3}>
                  <label className="paper__label">Company Name</label>
                  <p className="paper__text">{clientData.client_name}</p>
                </Grid>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Address</label>
                  <p className="paper__text">test</p>
                </Grid>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Number of SKU</label>
                  <p className="paper__text">{clientData.total_sku}</p>
                </Grid>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Status</label>
                  <p className="paper__text">{clientData.status}</p>                  
                </Grid>
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