import './style.scss';
import React from 'react';
import history from 'config/history';

import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import WarehouseDialog from 'components/WarehouseDialog';
import { deleteDeliveryNoticeById } from 'actions/index';

function WarehouseSideBar(props) {
  const [openDialog, setOpenDialog] = React.useState({ open: false });

  // Function for delete delivery notice
  const handleDelete = () => {
    deleteDeliveryNoticeById(props.deleteId).then(response => {
      if (response.status === 204) {
        history.push({
          pathname: '/delivery-notice',
          success: 'Delivery Notice deleted successfully'
        });
      }
    });
  }

  // Show dialog confirmation if user click delete button
  const handleDialog = () => {
    setOpenDialog(state => ({...state, open: true}));
  }

  return (
    <Paper elevation={0} variant="outlined" className="sidebar delivery-notice-sidebar">
      <List>
        <ListItem button onClick={() => history.push(`/delivery-notice/overview`)}>
          <ListItemText
            primary="Overview" 
            className={history.location.pathname.match('overview') ? 'active' : 'delivery-notice-overview'}
          />
        </ListItem>
        <ListItem button >
          <ListItemText primary="SKU" />
        </ListItem>
        {
          !history.location.pathname.match('create') &&
          <ListItem className="delete_button" button onClick={handleDialog} >
            <ListItemText primary="Delete Notice" />
          </ListItem>
        }
      </List>
      <WarehouseDialog
        openDialog={openDialog.open}
        diaglogText="Are you sure you want to delete this delivery notice?"
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