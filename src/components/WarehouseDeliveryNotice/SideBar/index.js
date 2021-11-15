import './style.scss';
import React from 'react';
import history from 'config/history';

import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@mui/material/ListItemText';
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
        <ListItem button disabled={history.location.pathname.match('create')} onClick={() => history.push(`/delivery-notice/${props.id}/overview`)}>
          <ListItemText
            primary="Overview" 
            className={history.location.pathname.match('overview') ? 'active' : 'delivery-notice-overview'}
          />
        </ListItem>
        <ListItem disabled={history.location.pathname.match('create')} button onClick={() => history.push(`/delivery-notice/${props.id}/sku`)} >
          <ListItemText primary="SKU" className={history.location.pathname.match('sku') ? 'active' : 'delivery-notice-overview'} />
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