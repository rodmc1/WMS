import './style.scss';
import React from 'react';
import history from 'config/history';
import { deleteWarehouseById } from 'actions/index';

import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import ListItem from '@mui/material/ListItem';
import WarehouseDialog from 'components/WarehouseDialog';
import ListItemText from '@mui/material/ListItemText';

function WarehouseSideBar(props) {
  const [openDialog, setOpenDialog] = React.useState({ open: false });

  // Function for delete warehouse
  const handleDelete = () => {
    deleteWarehouseById(props.deleteId).then(response => {
      if (response.status === 204) {
        history.push({
          pathname: '/',
          success: 'Warehouse deleted successfully'
        });
      }
    });
  }

  // Show dialog confirmation if user click delete button
  const handleDialog = () => {
    setOpenDialog(state => ({...state, open: true}));
  }

  return (
    <Paper elevation={0} variant="outlined" className="warehouse-sidebar sidebar">
      <List>
        <ListItem button disabled={props.createMode} className={history.location.pathname.match('overview') ? 'active' : ''} onClick={() => history.push(`/warehouse-list/${props.id}/overview`)}>
          <ListItemText primary="Warehouse Overview" />
        </ListItem>
        <ListItem button disabled={props.createMode} className={history.location.pathname.match('warehouse-edit') ? 'active warehouse_edit' : 'warehouse_edit'}  onClick={() => history.push(`/warehouse-list/${props.id}/warehouse-edit`)}>
          <ListItemText primary="Warehouse Information" />
        </ListItem>
        {
          !props.createMode &&
          <ListItem className="delete_button" button onClick={handleDialog} >
            <ListItemText primary="Delete Warehouse" style={{ color: 'red' }} />
          </ListItem>
        }
      </List>
      <WarehouseDialog
        openDialog={openDialog.open}
        diaglogText="Are you sure you want to delete this Warehouse?"
        dialogTitle="Confirmation"
        buttonConfirmText="Delete"
        buttonCancelText="Cancel"
        dialogAction={handleDelete}
        style={{backgroundColor: '#EB5757', color: '#E9E9E9'}}
      />
    </Paper>
  )
}

export default WarehouseSideBar;