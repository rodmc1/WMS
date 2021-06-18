import './style.scss';
import React from 'react';
import history from 'config/history';

import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function WarehouseSideBar(props) {
  return (
    <Paper elevation={0} variant="outlined" className="sidebar">
      <List>
        <ListItem button >
          <ListItemText primary="Overview" />
        </ListItem>
        <ListItem button >
          <ListItemText primary="SKU" />
        </ListItem>
      </List>
    </Paper>
  )
}

export default WarehouseSideBar;