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

import Badge from '@mui/material/Badge';
import Collapse from '@mui/material/Collapse';
import { DropzoneArea } from 'material-ui-dropzone';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

/*
 * @props string { diaglogText, dialogTitle, buttonConfirmText, buttonCancelText}
 * @props dialogAction invoke props function when user click confirm button
 * Return Dialog modal
 */
const UploadDocuments = props => {
  const [open, setOpen] = React.useState(false);
  const [itemData, setItemData] = React.useState(false);
  const pdfIcon = '/assets/images/pdfIcon.svg';
  const docxIcon = '/assets/images/docIcon.svg';

  // Open dialog if props openDialog is true
  React.useEffect(() => {
    if (props) setOpen(props.open);
    if (props.data) setItemData(props.data);
  }, [props]);

  /*
   * Customize Preview icon and label
   * @args file data
   * @return image and label with collapse button
   */
  const handlePreviewIcon = file => {
    const string = file.file.name;
    const length = 40;
    const fileName = string.length > length ? `${string.substring(0, length - 3)}...` : string;
    const previewIcon = string.split('.').pop().toLowerCase() === 'pdf' ? pdfIcon : docxIcon;

    return (
      <React.Fragment>
        <div>
          <Badge><img className="doc-img" src={previewIcon} alt={file.file.name} /></Badge>
          <Badge><Typography variant='subtitle2'>{fileName}</Typography></Badge>
        </div>
      </React.Fragment>
    )
  }

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
        <Typography variant="caption">Upload</Typography>
        <DropzoneArea
          className="receiving-upload-dropzone"
          sx={{marginTop: 50}}
          showAlerts={['error']}
          acceptedFiles={['application/*']}
          filesLimit={1}
          previewGridClasses={{ root: 'dropzone__list' }}
          getPreviewIcon={file => handlePreviewIcon(file)}
          previewText="Uploaded file"
          showPreviews
          showPreviewsInDropzone={false}
          classes={{ root: 'dropzone', icon: 'dropzone__icon', text: 'dropzone__text' }}
        />
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