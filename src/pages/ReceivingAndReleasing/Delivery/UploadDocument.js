/* eslint-disable react/prop-types */
import './style.scss';
import _ from 'lodash';
import React, {  useState } from 'react';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { fetchDeliveryNotices } from 'actions';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

/*
 * @props string { diaglogText, dialogTitle, buttonConfirmText, buttonCancelText}
 * @props dialogAction invoke props function when user click confirm button
 * Return Dialog modal
 */
const UploadDocuments = props => {
  const [open, setOpen] = React.useState(false);
  const [itemData, setItemData] = React.useState(false);

  // Open dialog if props openDialog is true
  React.useEffect(() => {
    if (props) setOpen(props.open);
    if (props.data) setItemData(props.data);
  }, [props]);

  return (
    <Dialog
      open={open}
      fullWidth
      keepMounted
      m={2}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      className="document-upload-dialog"
    >
      <DialogTitle>Upload Document</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">You've selected vehicle</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} variant="outlined">Cancel</Button>
        <Button variant="contained">Done</Button>
      </DialogActions>
    </Dialog>
  )
}

/**
 * Redux states to component props
 */
 const mapStateToProps = (state, ownProps) => {
  return { 
    error: state.error,
    searched: state.notice.searchedSKU,
    sku: state.notice.sku
  }
};

export default connect(mapStateToProps, { fetchDeliveryNotices })(UploadDocuments);