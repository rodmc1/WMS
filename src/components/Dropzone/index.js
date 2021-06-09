import './style.scss';
import React from 'react';
import Badge from '@material-ui/core/Badge';
import Collapse from '@material-ui/core/Collapse';
import { DropzoneArea } from 'material-ui-dropzone';
import Typography from '@material-ui/core/Typography';

/*
 * @args str url
 * @return formatted image src
 */
const extractImageUrl = (str) => {
  return str && str.replace(/\\/g,"/").replace("wwwroot",process.env.REACT_APP_INTELUCK_API_ENDPOINT);
}

/*
 * Handles dropzone for images and documents
 * @args props {defaultFiles, type, text, onDelete, onDrop, onChange, imageCount, documentCount}
 * @return dropzone field
 */
function Dropzone(props) {
  const [expanded, setExpanded] = React.useState(true);
  const [initialDocs, setInitialDocs] = React.useState([]);
  const [initialImages, setInitialImages] = React.useState([]);
  const [showPreviewText, setShowPreviewText] = React.useState(false);
  
  const pdfIcon = '/assets/images/pdfIcon.svg';
  const docxIcon = '/assets/images/docIcon.svg'  ;
  let collapseText = expanded ? 'Hide Photos' : 'See Photos';
  const allowedDocuments = ['doc', 'docx', 'pdf', 'txt', 'tex', 'csv'];
  const allowedImages = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp', 'jfif'];
  if (props.data === 'SKU') {
    collapseText = expanded ? 'Hide Photo' : 'See Photo';
  }
  
  // Handler for expanding photo list
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  // Set default collapse state and handle initial files
  React.useEffect(() => {
    if (props.defaultFiles) {
      if (props.data !== 'SKU' && props.type === 'image' && props.defaultFiles.warehouse_document_file !== null) {
        
        setExpanded(false);
        let images = props.defaultFiles.warehouse_document_file.map(e => extractImageUrl(e.warehouse_document_path));
        console.log(images)
        let newArrayImages = initialImages;

        images.forEach(image => {
          const extension = image.split('.').pop().toLowerCase();
          if (allowedImages.includes(extension)) {
            newArrayImages.push(image);
          }
        });
        
        setInitialImages(() => newArrayImages);
      }
      if (props.data !== 'SKU' && props.type === 'files' && props.defaultFiles.warehouse_document_file !== null) {
        
        setExpanded(false);
        const documents = props.defaultFiles.warehouse_document_file.map(e => extractImageUrl(e.warehouse_document_path));
        let newArrayDocuments = initialDocs;

        documents.forEach(document => {
          const extension = document.split('.').pop().toLowerCase();
          if (allowedDocuments.includes(extension)) {
            newArrayDocuments.push(document);
          }
        });
        
        setInitialDocs(newArrayDocuments);
      }
      if (props.data === 'SKU' && props.type === 'image' && props.defaultFiles.item_document_file_type) {
        let images = props.defaultFiles.item_document_file_type.map(e => extractImageUrl(e.item_filepath));
        console.log(images)
        let newArrayImages = initialImages;

        images.forEach(image => {
          const extension = image.split('.').pop().toLowerCase();
          if (allowedImages.includes(extension)) {
            newArrayImages.push(image);
          }
        });

        setInitialImages(() => newArrayImages);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultFiles]);

  /*
   * Customize Preview icon and label
   * @args file data
   * @return image and label with collapse button
   */
  const handlePreviewIcon = (file) => {
    const string = file.file.name;
    const length = 40;
    const fileName = string.length > length ? `${string.substring(0, length - 3)}...` : string;
    const previewIcon = string.split('.').pop().toLowerCase() === 'pdf' ? pdfIcon : docxIcon;

    return (
      props.type === 'image' ? 
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <img role="presentation" src={file.data} alt={file.file.name} />
      </Collapse> :
      <React.Fragment>
        <div>
          <Badge><img className="doc-img" src={previewIcon} alt={file.file.name} /></Badge>
          <Badge><Typography variant='subtitle2'>{fileName}</Typography></Badge>
        </div>
      </React.Fragment>
    )
  }
  
  // Render image type dropzone area
  const imageDropzone = () => {
    return (
      !initialImages.length ? null :
      <React.Fragment>
        <DropzoneArea
          key={props.type}
          { ...props }
          initialFiles={initialImages}
          onChange={files => props.onChange(files)}
          onDelete={props.onDelete}
          onDrop={props.onDrop}
          acceptedFiles={['image/*']}
          dropzoneText={props.text}
          previewText=""
          showAlerts={['error']}
          filesLimit={props.filesLimit ? props.filesLimit : 12}
          getPreviewIcon={file => handlePreviewIcon(file)}
          classes={{ root: 'dropzone', icon: 'dropzone__icon', text: 'dropzone__text' }}
        />
        <Typography
          variant='subtitle2'
          style={{color: '#009688', cursor: 'pointer', marginLeft: '1%'}}
          onClick={handleExpandClick}
          className={(props.imageCount && !props.imageCount.length) ? 'hidden' : ''}
          aria-expanded={expanded}>
            {collapseText}
        </Typography>
      </React.Fragment>
    )
  }

  // Render document type dropzone area
  const documentDropzone = () => {
    return (
      !initialDocs.length ? null :
      <React.Fragment>
        <DropzoneArea
          showAlerts={['error']}
          className={(props.imageCount && !props.documentCount.length) ? 'hidden' : ''}
          previewGridClasses={{ root: 'dropzone__list' }}
          key={props.type}
          { ...props }
          onDelete={props.onDelete}
          initialFiles={initialDocs}
          onChange={files => props.onChange(files)}
          acceptedFiles={['application/*']}
          dropzoneText={props.text}
          filesLimit={12}
          onDrop={props.onDrop}
          getPreviewIcon={file => handlePreviewIcon(file)}
          previewText="Selected files"
          classes={{ root: 'dropzone', icon: 'dropzone__icon', text: 'dropzone__text' }}
        />
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      { 
        initialDocs.length || initialImages.length ? null :
        <React.Fragment>
          <DropzoneArea
            key={'create'}
            { ...props }
            showAlerts={['error']}
            onChange={files => {
              setShowPreviewText(true);
              props.onChange(files);
            }}
            onDrop={props.onDrop}
            acceptedFiles={props.type === 'image' ? ['image/*'] : ['application/*']}
            dropzoneText={props.text}
            filesLimit={props.filesLimit ? props.filesLimit : 12}
            onDelete={props.onDelete}
            previewText={props.type === 'image' ? '' : 'Uploaded Files'}
            getPreviewIcon={file => handlePreviewIcon(file)}
            classes={{ root: 'dropzone', icon: 'dropzone__icon', text: 'dropzone__text' }}
          />
          {
            (props.type === 'image' && showPreviewText) &&
            <Typography
              className={!props.imageCount.length ? 'hidden' : ''}
              variant='subtitle2'
              style={{color: '#009688', cursor: 'pointer', marginLeft: '1%'}}
              onClick={handleExpandClick}
              aria-expanded={expanded}>
                {collapseText}
            </Typography>
          }
        </React.Fragment>
      }

      { !initialImages.length ? null : imageDropzone() }
      { !initialDocs.length ? null : documentDropzone() }
    </React.Fragment>
  )
}

export default Dropzone;