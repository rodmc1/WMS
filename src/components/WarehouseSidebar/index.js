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
        <ListItem button disabled={props.createMode}  onClick={() => history.push(`/warehouse-list/overview/${props.id}`)}>
          <ListItemText primary="Warehouse Overview" />
        </ListItem>
        <ListItem button disabled={props.createMode} onClick={() => history.push(`/warehouse-edit/${props.id}`)}>
          <ListItemText primary="Warehouse Information" />
        </ListItem>
        <ListItem button disabled={props.createMode} onClick={() => console.log('Members')}>
          <ListItemText primary="Members" />
        </ListItem>
        <ListItem button disabled={props.createMode} onClick={() => console.log('Audit Log')}>
          <ListItemText primary="Audit Log" />
        </ListItem>
        {
          props.editMode &&
          <ListItem button onClick={() => props.handleClickOpen()}>
            <ListItemText primary="Delete Warehouse" style={{color: 'red'}} />
          </ListItem>
        }
      </List>
    </Paper>
  )
}

export default WarehouseSideBar;