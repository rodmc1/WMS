/* eslint-disable react/prop-types */
import './style.scss';
import _ from 'lodash';
import moment from 'moment';
import React, {  useState } from 'react';
import { THROW_ERROR } from 'actions/types';
import { dispatchError } from 'helper/error';
import { connect, useDispatch } from 'react-redux';
import { fetchDeliveryNotices, uploadDocument, fetchDocument, downloadDocuments } from 'actions';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import fileDownload from 'js-file-download';
import { saveAs } from 'file-saver';

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

function AttachedDocuments(props) {
  const [open, setOpen] = useState(false);
  const pdfIcon = '/assets/images/pdfIcon.svg';
  const docxIcon = '/assets/images/docIcon.svg';
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [currentPage, setCurrentPage] = useState(null);
  const [page, setPage] = useState(0);
  const [scale, setScale] = useState(0.5)
  const [rotate, setRotate] = useState(0);
  const [documents, setDocuments] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [deliveryNoticeData, setDeliveryNoticeData] = React.useState(null);
  function onDocumentLoadSuccess({ numPages }) {
    setScale(0.5);
    setNumPages(numPages);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
    setPage(prevPageNumber => prevPageNumber + offset)
  }

  function previousPage() {
    changePage(-1);
    setCurrentPage(documents[page - 1]);
  }

  function nextPage() {
    changePage(1);
    setCurrentPage(documents[page + 1]);
  }
  
  const handleDownload = () => {
    downloadDocuments(props.receivingAndReleasing.delivery_notice_id)
      .then(response => {
        const zipped = new File([response.data], 'filename');       
        fileDownload(zipped, props.receivingAndReleasing.unique_code + '.zip');
      });
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
    if (props) {
      setOpen(props.open);
      if (props.data) {
        console.log(props.data)
        const docs = props.data.map(fileData => extractFileUrl(fileData.file_path));
        setDocuments(docs);
        setDocumentData(props.data);
      }
    }
    if (props.receivingAndReleasing) setDeliveryNoticeData(props.receivingAndReleasing.delivery_notice_document_file_type)
  }, [props]);

  // Open dialog if props openDialog is true
  React.useEffect(() => {
    if (documents) {
      setCurrentPage(documents[0])
    }
  }, [documents]);

  /*
   * Customize Preview icon and label
   * @args file data
   * @return image and label with collapse button
   */
  const handlePreviewIcon = data => {
    let file = currentPage;

    return (
      <React.Fragment>
        <div className="preview-container attached-document-container" style={{border: '1px solid lightgrey', borderRadius: 4}}>
          <TransformWrapper>
            <TransformComponent>
              <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.apply(null, Array(numPages))
                  .map((x, i)=>i+1)
                  .map(page => <Page pageNumber={page} scale={scale} rotate={rotate}/>)}
              </Document>
            </TransformComponent>
          </TransformWrapper>
          <div className="flex justify-space-between align-center viewer-actions">
            <div className="align-center">
              <IconButton aria-label="previous page" disabled={pageNumber <= 1}>
                <KeyboardArrowLeftIcon style={{marginRight: 5}} onClick={previousPage}/>
              </IconButton>
              <Typography variant="body2">{pageNumber || (numPages ? 1 : "--")}/{documents.length || "--"}</Typography>
              <IconButton aria-label="next page" disabled={pageNumber === documents.length}>
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
          <Typography variant="body2"  style={{marginTop: 20, marginBottom: 8}}><small>Delivery Notice Document</small></Typography>
          {deliveryNoticeData && deliveryNoticeData.map(doc => {
            return (
              <ListItem style={{marginTop: 10, marginBottom: 8}} key={doc.delivery_notice_files[0].warehouse_filename}>
                <Badge><img className="doc-img" src={pdfIcon} alt={doc.delivery_notice_files[0].warehouse_filename} /></Badge>
                <ListItemText primary={doc.delivery_notice_files[0].warehouse_filename} className='attached-doc-typography with-existing-file' />
              </ListItem>
            )
          })}
          {/* <ListItem>
            <Badge><img className="doc-img" src={pdfIcon} alt={fileName} /></Badge>
            <ListItemText primary={fileName} secondary={!existingFile ? moment(file.lastModifiedDate).format('MMMM DD, YYYY') : moment(file.date_stamp).format('MMMM DD, YYYY')} className={!existingFile ? '' : 'with-existing-file'} />
          </ListItem> */}
          
          <Typography variant="body2" style={{marginTop: 20, marginBottom: 8}}><small>Delivery Documents</small></Typography>
          {documentData && documentData.map(doc => {
            return (
              <ListItem>
                <Badge><img className="doc-img" src={pdfIcon} alt={doc.file_name} key={doc.file_name} /></Badge>
                <ListItemText primary={doc.file_name} secondary={moment(doc.date_stamp).format('MMMM DD, YYYY')} className='attached-doc-typography with-existing-file' />
              </ListItem>
            )
          })}
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
          <Typography>Documents</Typography>
          <Tooltip title="Close">
            <IconButton aria-label="close" component="span" onClick={props.handleClose} >
              <ClearIcon style={{fontSize: 18}} />
            </IconButton>
          </Tooltip>
        </div>
      </DialogTitle>
      <DialogContent>
        {!documents && <Typography variant="body2" style={{marginTop: '15px'}}>No documents found.</Typography>}
        {documents && handlePreviewIcon()}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} variant="outlined">Cancel</Button>
        <Button variant="contained" onClick={handleDownload} disabled={!documents}>Download</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AttachedDocuments;