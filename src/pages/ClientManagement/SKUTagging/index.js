/* eslint-disable react/prop-types */
import './style.scss';
import _ from 'lodash';
import moment from 'moment';
import React, {  useState } from 'react';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { fetchDeliveryNotices, uploadDocument, fetchDocument } from 'actions';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import IconButton from '@mui/material/IconButton';
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import ClearIcon from '@mui/icons-material/Clear';
import Tooltip from '@mui/material/Tooltip';

/*
 * @props string { diaglogText, dialogTitle, buttonConfirmText, buttonCancelText}
 * @props dialogAction invoke props function when user click confirm button
 * Return Dialog modal
 */
const UploadDocuments = props => {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [itemData, setItemData] = React.useState(null);
  const pdfIcon = '/assets/images/pdfIcon.svg';
  const docxIcon = '/assets/images/docIcon.svg';
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(0.5)
  const [rotate, setRotate] = useState(0);
  const [existingFile, setExistingFile] = React.useState(null);
  const [deliveryNoticeData, setDeliveryNoticeData] = React.useState(null);
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [hasChanged, setHasChanged] = useState(false)
  
  const contentText = existingFile ? 'Delivery Documents of ' : "You've selected vehicle ";
  const dialogTitleText = existingFile ? 'Documents' : "Upload Document";

  function onDocumentLoadSuccess({ numPages }) {
    setPageNumber(1);
    setScale(0.5);
    setNumPages(numPages);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  /*
    * @args str url
    * @return formatted image src
    */
  const extractFileUrl = (str) => {
    return str && str.replace(/\\/g,"/").replace("/files",process.env.REACT_APP_INTELUCK_API_ENDPOINT);
  }

  // Open dialog if props openDialog is true
  React.useEffect(() => {
    if (props) setOpen(props.open);
    if (props.data) setItemData(props.data);
    if (props.receivingAndReleasing) setDeliveryNoticeData(props.receivingAndReleasing)
  }, [props]);

  // Open dialog if props openDialog is true
  React.useEffect(() => {
    if (itemData) {
      if (itemData.received_document_file) {
        const existingDocuments = itemData.received_document_file.map(item => item);
        setExistingFiles(existingDocuments);
      }
    }
  }, [itemData]);

  const handleUploadDocument = () => {
    if (itemData && hasChanged) {
      let id = itemData.delivery_noticeid;
      const recievedId = itemData.recieved_id;
      const type = props.receivedDocumentType;
      
      if (!existingFiles.length) id = null;
      if (itemData.received_document_file) {
        id = itemData.received_document_file[0].received_document_id;
      }
      if (!existingFiles.length && !files.length) {
        props.handleClose();
      } else {
        props.handleUploadDocument(id, recievedId, type, files, existingFiles);
        props.handleClose();
      }
    } else {
      props.handleClose();
    }
  }

  /*
   * Customize Preview icon and label
   * @args file data
   * @return image and label with collapse button
   */
  const handlePreviewIcon = data => {
    let file = data;
    let string;
    let length = 40;
    let fileName;
    let previewIcon;
    let documentTitle;

    string = file.name;
    length = 40;
    fileName = string.length > length ? `${string.substring(0, length - 3)}...` : string;
    previewIcon = string.split('.').pop().toLowerCase() === 'pdf' ? pdfIcon : docxIcon;
    documentTitle = 'Uploaded Document';

    return (
      <React.Fragment>
        <div className="preview-container" style={{border: '1px solid lightgrey', borderRadius: 4}}>
          <TransformWrapper>
            <TransformComponent>
              <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} scale={scale} rotate={rotate}/>
              </Document>
            </TransformComponent>
          </TransformWrapper>
          <div className="flex justify-space-between align-center viewer-actions">
            <div className="align-center">
              <IconButton aria-label="previous page" disabled={pageNumber <= 1}>
                <KeyboardArrowLeftIcon style={{marginRight: 5}} onClick={previousPage}/>
              </IconButton>
              <Typography variant="body2">{pageNumber || (numPages ? 1 : "--")}/{numPages || "--"}</Typography>
              <IconButton aria-label="next page" disabled={pageNumber >= numPages}>
                <KeyboardArrowRightIcon style={{marginLeft: 5}} onClick={nextPage} />
              </IconButton>
            </div>
            <div className="button-group align-center">
              <IconButton aria-label="rotate left">
                <RotateLeftIcon onClick={() => setRotate(rotate - 90)}/>
              </IconButton>
              <IconButton aria-label="rotate right">
                <RotateRightIcon onClick={() => setRotate(rotate + 90)}/>
              </IconButton>
              <IconButton aria-label="zoom out" disabled={scale < 0.8}>
                <ZoomOutIcon onClick={() => setScale(scale - 0.4)}/>
              </IconButton>
              <IconButton aria-label="zoom out" disabled={scale === 3}>
                <ZoomInIcon onClick={() => setScale(scale + 0.4)} />
              </IconButton>
            </div>
          </div>
        </div>
        <div>
          <Typography variant="body2" style={{marginTop: 20, marginBottom: 8}}><small>{documentTitle}</small></Typography>
          <ListItem>
            <Badge><img className="doc-img" src={previewIcon} alt={fileName} /></Badge>
            <ListItemText primary={fileName} secondary={!existingFile ? moment(file.lastModifiedDate).format('MMMM DD, YYYY') : moment(file.date_stamp).format('MMMM DD, YYYY')} className={!existingFile ? '' : 'attached-doc-typography with-existing-file'} />
          </ListItem>
        </div>
      </React.Fragment>
    )
  }

  const handleDelete = (props) => {
    setHasChanged(true);
  }

  const handleFileChange = (file) => {
    setFiles(file);
    setPageNumber(1);
  }

  const getInitialFiles = () => {
    const initialFiles = itemData.received_document_file.map(fileData => extractFileUrl(fileData.file_path));
    return initialFiles.length ? initialFiles : [];
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
      <DialogTitle>
        <div className="flex justify-space-between align-center receiving-title">
          <Typography>{dialogTitleText}</Typography>
          <Tooltip title="Close">
            <IconButton aria-label="close" component="span" onClick={props.handleClose} >
              <ClearIcon style={{fontSize: 18}} />
            </IconButton>
          </Tooltip>
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description" className="slide-description">{contentText}<b>{itemData && itemData.plate_number}</b></DialogContentText>
          <Typography variant="caption">Upload</Typography>
          {itemData &&
            <DropzoneArea
              className="receiving-upload-dropzone"
              sx={{marginTop: 50}}
              initialFiles={(itemData && itemData.received_document_file) && getInitialFiles()}
              showAlerts={['error']}
              acceptedFiles={['application/pdf']}
              clearOnUnmount
              filesLimit={3}
              previewGridClasses={{ root: 'dropzone__list' }}
              getPreviewIcon={file => handlePreviewIcon(file.file)}
              previewText={false}
              showPreviews
              onChange={handleFileChange}
              showPreviewsInDropzone={false}
              onDelete={handleDelete}
              onDrop={() => setHasChanged(true)}
              classes={{ root: 'dropzone', icon: 'dropzone__icon', text: 'dropzone__text' }}
            />
          }
          {/* {existingFile && handlePreviewIcon()} */}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} variant="outlined">Cancel</Button>
        <Button variant="contained" onClick={hasChanged ? handleUploadDocument : props.handleClose}>Done</Button>
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
    sku: state.notice.sku,
    receivedDocumentType: state.picklist.received_document_type.Description
  }
};

export default connect(mapStateToProps, { fetchDeliveryNotices })(UploadDocuments);