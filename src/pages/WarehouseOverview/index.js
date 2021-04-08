// import './style.scss';
import React from 'react';
import { connect } from 'react-redux';
import { fetchWarehouseById, fetchFacilitiesAndAmenities } from 'actions/index';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from 'components/Breadcrumbs';
import WarehouseSideBar from 'components/WarehouseSidebar';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function WarehouseOverview(props) {
  const [open, setOpen] = React.useState(false);
  const [facilitiesAndAmenities, setFacilitiesAndAmenities] = React.useState([]);
  const [routes, setRoutes] = React.useState([
    {
      label: 'Warehouse List',
      path: '/warehouse-list'
    }
  ]);

  React.useEffect(() => {
    if (props.location.success) {
      setOpen(true);
    }
  },[]);

  const getContactInformation = () => {
    const broker = { name: null, number: null };
    const contactPerson = { name: null, number: null };
    if (props.warehouse) {
      props.warehouse.warehouse_users_details.forEach(user => {
        if (user.role === 'Broker') {
          broker.name = `${user.first_name} ${user.last_name}`;
          broker.number = user.mobile_number;
        } 
        if (user.role === 'Contact Person') {
          contactPerson.name = `${user.first_name} ${user.last_name}`;
          contactPerson.number = user.mobile_number;
        } 
      });
    }

    return { broker, contactPerson };
  }
  
  const renderInformation = () => {
    if (props.warehouse) {
      return (
        <React.Fragment>
          <Paper elevation={0} className="paper" variant="outlined">
            <Typography variant="subtitle1" className="paper__heading">General Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <label className="paper__label">Warehouse Name</label>
                <p className="paper__text">{props.warehouse.warehouse_client}</p>
              </Grid>
              <Grid item xs={12} md={3}>
                <label className="paper__label">Warehouse Type</label>
                <p className="paper__text">{props.warehouse.warehouse_type}</p>
              </Grid>
              <Grid item xs={12} md={3}>
                <label className="paper__label">Building Type</label>
                <p className="paper__text">{props.warehouse.building_type}</p>                  
              </Grid>
              <Grid item xs={12} md={3}>
                <label className="paper__label">Status</label>
                <p className="paper__text">{props.warehouse.remarks}</p>                  
              </Grid>
            </Grid>
            <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <label className="paper__label">Address</label>
              <p className="paper__text">{props.warehouse.address}</p>
            </Grid>
            <Grid item xs={12} md={3}>
              <label className="paper__label">Country</label>
              <p className="paper__text">{props.warehouse.country}</p>
            </Grid>
            <Grid item xs={12} md={3}>
              <label className="paper__label">Year of TOP</label>
              <p className="paper__text">{props.warehouse.year_top}</p>                  
            </Grid>
            <Grid item xs={12} md={3}>
              <label className="paper__label">Min Lease Terms</label>
              <p className="paper__text">{props.warehouse.min_lease_terms}</p>                  
            </Grid>
          </Grid>
          </Paper>
          <Paper elevation={0} className="paper" variant="outlined">
              <Typography variant="subtitle1" className="paper__heading">Space Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Floor Area</label>
                  <p className="paper__text">{props.warehouse.floor_area}</p>
                </Grid>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Covered Area</label>
                  <p className="paper__text">{props.warehouse.covered_area}</p>
                </Grid>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Mezzanine Area</label>
                  <p className="paper__text">{props.warehouse.mezzanine_area}</p>                  
                </Grid>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Open Area</label>
                  <p className="paper__text">{props.warehouse.open_area}</p>                  
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Office Area</label>
                  <p className="paper__text">{props.warehouse.office_area}</p>
                </Grid>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Battery Charging Area</label>
                  <p className="paper__text">{props.warehouse.battery_charging_area}</p>
                </Grid>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Loading &amp; Unloading Bays</label>
                  <p className="paper__text">{props.warehouse.loading_unloading_bays}</p>                  
                </Grid>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Remarks</label>
                  <p className="paper__text">{props.warehouse.remarks}</p>                  
                </Grid>
              </Grid>
          </Paper>
          <Paper elevation={0} className="paper" variant="outlined">
              <Typography variant="subtitle1" className="paper__heading">Contact Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Company Broker</label>
                  <p className="paper__text">{getContactInformation().broker.name}</p>
                </Grid>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Contact Broker Number</label>
                  <p className="paper__text">{getContactInformation().broker.number}</p>
                </Grid>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Contact Person</label>
                  <p className="paper__text">{getContactInformation().contactPerson.name}</p>                  
                </Grid>
                <Grid item xs={12} md={3}>
                  <label className="paper__label">Contact Person Number</label>
                  <p className="paper__text">{getContactInformation().contactPerson.number}</p>                  
                </Grid>
              </Grid>
          </Paper>
          <Paper elevation={0} className="paper" variant="outlined">
            <Typography variant="subtitle1" className="paper__heading">Facilities &amp; Amenities</Typography>
            <Grid container spacing={2}>
              {facilitiesAndAmenities.map(f => {
                let status = 'Unavailable';
                if (props.warehouse.facilities_amenities.includes(f.Description)) {
                  status = 'Available';
                }
                return (
                  <Grid item xs={12} md={3} key={f.Description}>
                    <label className="paper__label">{f.Description}</label>
                    <p className="paper__text">{status}</p>
                  </Grid>
                )
              })}
            </Grid>
          </Paper>
        </React.Fragment>
      )
    }
  }

  React.useEffect(() => {
    if (props.facilities_and_amenities.length) {
      setFacilitiesAndAmenities(props.facilities_and_amenities);
    } else {
      props.fetchFacilitiesAndAmenities();
    }
  }, [props.facilities_and_amenities])

  React.useEffect(() => {
    const id = props.match.params.id;    
    if (id) {
      props.fetchWarehouseById(id);
    }
  }, []);

  React.useEffect(() => {
    console.log(routes)
    if (props.warehouse && routes.length === 1) {
      setRoutes(routes => [...routes, {
        label: props.warehouse.warehouse_client,
        path: `/warehouse-list/overview/${props.match.params.id}`
      }]);
    }
  }, [props.warehouse]);
  
  return (
    <div className="container">
      <Breadcrumbs routes={routes} />
      <Grid container spacing={2} 
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
          <Grid item xs={3}>
            <WarehouseSideBar id={props.match.params.id} />
          </Grid>        
          <Grid item xs={9}>
            {renderInformation()}
          </Grid>
          <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
            <Alert severity="success">{props.location.success}</Alert>
          </Snackbar>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return { 
    warehouse: state.warehouses.data[ownProps.match.params.id],
    facilities_and_amenities: state.picklist.facilities_and_amenities
  }
}

export default connect(mapStateToProps, { fetchWarehouseById, fetchFacilitiesAndAmenities })(WarehouseOverview);