import React from 'react';
import history from 'config/history';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function WarehouseMasterDataSidebar(props) {
  return (
    <Paper elevation={0} variant="outlined" className="sidebar">
      <List>
        <ListItem button onClick={() => history.push(`/warehouse-master-data/${props.id}/overview`)} >
          <ListItemText primary="Warehouse Overview"/>
        </ListItem>
        <ListItem button onClick={() => history.push(`/warehouse-master-data/${props.id}/sku`)} >
          <ListItemText primary="SKU" />
        </ListItem>
      </List>
    </Paper>
  )
}

export default WarehouseMasterDataSidebar;