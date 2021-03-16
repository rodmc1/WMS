import React from 'react';
import history from 'config/history';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function WarehouseSideBar(props) {
  return (
    <Paper elevation={0} variant="outlined">
      <List>
        <ListItem button onClick={() => history.push(`/warehouse-list/overview/${props.id}`)}>
          <ListItemText primary="Warehouse Overview" />
        </ListItem>
        <ListItem button onClick={() => history.push(`/warehouse-edit/${props.id}`)}>
          <ListItemText primary="Warehouse Information" />
        </ListItem>
        <ListItem button onClick={() => console.log('Members')}>
          <ListItemText primary="Members" />
        </ListItem>
        <ListItem button onClick={() => console.log('Audit Log')}>
          <ListItemText primary="Audit Log" />
        </ListItem>
      </List>
    </Paper>
  )
}

export default WarehouseSideBar;