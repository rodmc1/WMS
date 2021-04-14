import './style.scss';
import React from 'react';
import history from 'config/history';
import { deleteWarehouseById } from 'actions/index';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function WarehouseSideBar(props) {
  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    deleteWarehouseById(props.id).then(response => {
      if (response.status === 204) {
        history.push({
          pathname: '/',
          success: 'Warehouse deleted successfully'
        });
      }
    });
  }
  
  const renderDeleteDialog = () => {
    return (
      <Dialog
        open={open}
        fullWidth
        keepMounted
        m={2}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this Warehouse?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={() => handleDelete()} variant="contained" style={{ backgroundColor: '#EB5757', color: '#E9E9E9' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Paper elevation={0} variant="outlined" className="sidebar">
      <List>
        <ListItem button disabled={props.createMode} className={history.location.pathname.match('overview') ? 'active' : ''} onClick={() => history.push(`/warehouse-list/overview/${props.id}`)}>
          <ListItemText primary="Warehouse Overview" />
        </ListItem>
        <ListItem button disabled={props.createMode} className={history.location.pathname.match('warehouse-edit') ? 'active warehouse_edit' : 'warehouse_edit'}  onClick={() => history.push(`/warehouse-list/warehouse-edit/${props.id}`)}>
          <ListItemText primary="Warehouse Information" />
        </ListItem>
        {
          !props.createMode &&
          <ListItem className="delete_button" button onClick={() => setOpen(true)} >
            <ListItemText primary="Delete Warehouse" style={{ color: 'red' }} />
          </ListItem>
        }
      </List>
      {renderDeleteDialog()}
    </Paper>
  )
}

export default WarehouseSideBar;