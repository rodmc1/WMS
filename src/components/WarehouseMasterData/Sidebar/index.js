import React from 'react';
import history from 'config/history';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@mui/material/ListItemText';

function WarehouseMasterDataSidebar(props) {
  return (
    <Paper elevation={0} variant="outlined" className="sidebar">
      <List>
        <ListItem button onClick={() => history.push(`/warehouse-master-data/${props.id}/overview`)} className={history.location.pathname.match('overview') ? 'active' : 'warehouse-overview'} >
          <ListItemText primary="Warehouse Overview"/>
        </ListItem>
        <ListItem button onClick={() => history.push(`/warehouse-master-data/${props.id}/sku`)} className={history.location.pathname.match('sku') ? 'active' : 'warehouse-sku'} >
          <ListItemText primary="SKU" />
        </ListItem>
      </List>
    </Paper>
  )
}

export default WarehouseMasterDataSidebar;