/* eslint-disable react/prop-types */
import './style.scss';
import _ from 'lodash';
import moment from 'moment';
import React, {  useState } from 'react';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { fetchDeliveryNotices, uploadDocument, fetchDocument } from 'actions';

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
import { borderRadius, padding } from '@mui/system';
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
import { jsPDF } from "jspdf";
import { DataSaverOffOutlined } from '@mui/icons-material';
const doc = new jsPDF();

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
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0);
  const [existingFile, setExistingFile] = React.useState(null);
  const [deliveryNoticeData, setDeliveryNoticeData] = React.useState(null);
  
  console.log(deliveryNoticeData)
  function onDocumentLoadSuccess({ numPages }) {
    setPageNumber(1);
    setNumPages(numPages);
  }

  function onRotate() {
    setRotate(rotate + 90);
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

  const fetchFileData = () => {
    fetchDocument(itemData.recieved_id)
      .then(response => {
        if (response.data[0].received_document_file_type) {
          const arrayDoc = response.data[0].received_document_file_type;
          setExistingFile(arrayDoc[arrayDoc.length - 1])
        }
      });
  }

  // Open dialog if props openDialog is true
  React.useEffect(() => {
    if (props) setOpen(props.open);
    if (props.data) setItemData(props.data);
    if (props.receivingAndReleasing) setDeliveryNoticeData(props.receivingAndReleasing)
  }, [props]);

  // Open dialog if props openDialog is true
  React.useEffect(() => {
    if (itemData) fetchFileData();
  }, [itemData]);

  // Open dialog if props openDialog is true
  React.useEffect(() => {
    if (existingFile) {

    }
    // if (existingFile) {
    //   const filePath = existingFile.file_path;
    //   fetch(filePath)
    //     .then(res => res.blob())
    //     .then(blob => {
    //       var reader = new FileReader();
    //       reader.readAsDataURL(blob);
    //       reader.onload =  function(e){
    //         console.log(e);
    //       };
          // console.log(reader)
        // })
      //   .then(blob => {
      //     let objectURL = URL.createObjectURL(blob);
      //     let myImage = new Image();
      //     myImage.src = objectURL;
      //     console.log(blob)
      // });
    // }
  }, [existingFile]);

  const handleUploadDocument = () => {
    if (itemData) {
      const id = itemData.delivery_noticeid;
      const recievedId = itemData.recieved_id;
      const type = props.receivedDocumentType;
      props.handleUploadDocument(id, recievedId, type, file);
      props.handleClose()
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

    if (existingFile) {
      file = extractFileUrl(existingFile.file_path);
      string = existingFile.file_name;
      fileName = string;
      previewIcon = string.split('.').pop().toLowerCase() === 'pdf' ? pdfIcon : docxIcon;
      documentTitle = 'Delivery Document';
    } else {
      string = file.name;
      length = 40;
      fileName = string.length > length ? `${string.substring(0, length - 3)}...` : string;
      previewIcon = string.split('.').pop().toLowerCase() === 'pdf' ? pdfIcon : docxIcon;
      documentTitle = 'Uploaded Document';
      setFile(file);
    }

    return (
      <React.Fragment>
        <div style={{border: '1px solid lightgrey', borderRadius: 4,overflow: "hidden"}}>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} scale={scale} rotate={rotate}/>
          </Document>
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
              <IconButton aria-label="zoom out" disabled={scale < 1}>
                <ZoomOutIcon onClick={() => setScale(scale - 0.5)}/>
              </IconButton>
              <IconButton aria-label="zoom out" disabled={scale === 3}>
                <ZoomInIcon onClick={() => setScale(scale + 0.5)} />
              </IconButton>
            </div>
          </div>
        </div>
        <div>
          { deliveryNoticeData.delivery_notice_document_file_type &&
            <>
              <Typography variant="body2" style={{marginTop: 20, marginBottom: 8}}><small>Delivery Notice Document</small></Typography>
              <ListItem>
                <Badge><img className="doc-img" src={previewIcon} alt={deliveryNoticeData.delivery_notice_document_file_type[0].delivery_notice_files[0].warehouse_filename} /></Badge>
                <ListItemText primary={deliveryNoticeData.delivery_notice_document_file_type[0].delivery_notice_files[0].warehouse_filename} className={!existingFile ? '' : 'with-existing-file'} />
              </ListItem>
            </>
          }
          <Typography variant="body2" style={{marginTop: 20, marginBottom: 8}}><small>{documentTitle}</small></Typography>
          <ListItem>
            <Badge><img className="doc-img" src={previewIcon} alt={fileName} /></Badge>
            <ListItemText primary={fileName} secondary={!existingFile ? moment(file.lastModifiedDate).format('MMMM DD, YYYY') : ''} className={!existingFile ? '' : 'with-existing-file'} />
          </ListItem>
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
      <DialogTitle>
        <div className="flex justify-space-between align-center receiving-title">
          <Typography>Upload Document</Typography>
          <Tooltip title="Close">
            <IconButton aria-label="close" component="span" onClick={props.handleClose} >
              <ClearIcon style={{fontSize: 18}} />
            </IconButton>
          </Tooltip>
        </div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description" className="slide-description">You've selected vehicle <b>{itemData && itemData.plate_number}</b></DialogContentText>
        {!existingFile &&
          <>
            <Typography variant="caption">Upload</Typography>
            <DropzoneArea
              className="receiving-upload-dropzone"
              sx={{marginTop: 50}}
              showAlerts={['error']}
              acceptedFiles={['application/*']}
              clearOnUnmount
              filesLimit={1}
              previewGridClasses={{ root: 'dropzone__list' }}
              getPreviewIcon={file => handlePreviewIcon(file.file)}
              previewText={false}
              showPreviews
              onChange={() => setPageNumber(1)}
              showPreviewsInDropzone={false}
              classes={{ root: 'dropzone', icon: 'dropzone__icon', text: 'dropzone__text' }}
            />
          </>
        }
        {existingFile && handlePreviewIcon()}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} variant="outlined">Cancel</Button>
        <Button variant="contained" onClick={handleUploadDocument}>Done</Button>
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