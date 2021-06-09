import React from 'react';
import WarehouseMasterDataSidebar from 'components/WarehouseMasterData/Sidebar';
import { connect } from 'react-redux';
import { fetchWarehouseById } from 'actions';
import Breadcrumbs from 'components/Breadcrumbs';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';

function WarehouseMasterDataOverview (props) {

  const [warehouse, setWarehouse] = React.useState(null);

  // const routes = [
  //   {
  //     label: 'Warehouse Master Data',
  //     path: '/warehouse-master-data'
  //   }
  // ];
  console.log(props.warehouse);

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
  console.log(props)

  React.useEffect(() => {
    const id = props.match.params.id;
    if (!props.warehouse) {
      props.fetchWarehouseById(id);
    } else {
      setWarehouse(props.warehouse);
    }
  }, [props.warehouse]);

  const renderInformation = () => {
    if (warehouse) {
      return (
        <React.Fragment>
          <Paper className="paper" elevation={0} variant="outlined">
            <Typography variant="subtitle1" className="paper__heading">General Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <label className="paper__label">Warehouse</label>
                <p className="paper__text">{warehouse.warehouse_client}</p>
              </Grid>
              <Grid item xs={12} md={5}>
                <label className="paper__label">Address</label>
                <p className="paper__text">{warehouse.address}</p>
              </Grid>
              <Grid item xs={12} md={3}>
                <label className="paper__label">Country</label>
                <p className="paper__text">{warehouse.country}</p>                  
              </Grid>
              {/* <Grid item xs={12} md={3}>
                <label className="paper__label">Clients</label>
                <p className="paper__text">{warehouse.remarks}</p>                  
              </Grid> */}
            </Grid>
          </Paper>
        </React.Fragment>
      )
    }
  }

  return (
    <div className="container">
      <Breadcrumbs routes={routes} />
      <Grid container spacing={2}
        direction="row"
        justify="space-evenly"
        alignItems="stretch">
        <Grid item xs={12} md={3}>
          <WarehouseMasterDataSidebar id={props.match.params.id} />
        </Grid>
        <Grid item xs={9}>
            {renderInformation()}
        </Grid>
        {/* <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}> */}
          {/* <Alert severity="success">{props.location.success}</Alert> */}
        {/* </Snackbar> */}
      </Grid>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return { 
    warehouse: state.warehouses.data[ownProps.match.params.id]
  }
}

export default connect(mapStateToProps, { fetchWarehouseById } )(WarehouseMasterDataOverview);