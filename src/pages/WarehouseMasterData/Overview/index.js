import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { fetchWarehouseById } from 'actions';
import WarehouseMasterDataSidebar from 'components/WarehouseMasterData/Sidebar';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Breadcrumbs from 'components/Breadcrumbs';
import Typography from '@mui/material/Typography';

function WarehouseMasterDataOverview(props) {
  const [warehouse, setWarehouse] = React.useState(null);
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
  
  // Fetch and set warehouse details 
  useEffect(() => {
    const id = props.match.params.id;
    if (!props.warehouse) {
      props.fetchWarehouseById(id);
    } else {
      setWarehouse(props.warehouse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
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