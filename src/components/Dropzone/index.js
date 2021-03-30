import './style.scss';
import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';

function Dropzone(props) {
  const [initialDocs, setInitialDocs] = React.useState([]);
  const [initialImages, setInitialImages] = React.useState([]);
  const extractImageUrl = (str) => {
    return str && str.replace(/\\/g,"/").replace("wwwroot",process.env.REACT_APP_INTELUCK_API_ENDPOINT);
  }

  React.useEffect(() => {
    if (props.initialFiles) {
      if (props.type === 'image' && props.initialFiles.warehouse_document_file !== null)  {
        const images = props.initialFiles.warehouse_document_file.map(e => extractImageUrl(e.warehouse_document_path));
        const allowedExtension = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp'];
        let newArrayImages = initialImages;

        images.forEach(image => {
          const extension = image.split('.').pop().toLowerCase();
          if (allowedExtension.includes(extension)) {
            newArrayImages.push(image);
          }
        });
        
        setInitialImages(newArrayImages);
      }
      if (props.type === 'files' && props.initialFiles.warehouse_document_file !== null) {
        const documents = props.initialFiles.warehouse_document_file.map(e => extractImageUrl(e.warehouse_document_path));
        const allowedExtension = ['doc', 'docx', 'pdf', 'txt', 'tex'];
        let newArrayDocuments = initialDocs;

        documents.forEach(document => {
          const extension = document.split('.').pop().toLowerCase();
          if (allowedExtension.includes(extension)) {
            newArrayDocuments.push(document);
          }
        });
        
        setInitialDocs(newArrayDocuments);
      }
    }
  },[props.initialFiles]);

  return (
    <React.Fragment>
      { 
        initialDocs.length || initialImages.length ? null :
        <DropzoneArea
          key={'create'}
          { ...props }
          onChange={files => props.onChange(files)}
          acceptedFiles={props.type === 'image' ? ['image/*'] : ['application/*']}
          dropzoneText={props.text}
          filesLimit={12}
          previewText=""
          classes={{ root: 'dropzone', icon: 'dropzone__icon', text: 'dropzone__text', zeroMinWidth: 'dropzone__img' }}
        />
      }

      { 
        !initialImages.length ? null : 
        <DropzoneArea
          key={props.type}
          { ...props }
          initialFiles={initialImages}
          onChange={files => props.onChange(files)}
          acceptedFiles={['image/*']}
          dropzoneText={props.text}
          filesLimit={12}
          classes={{ root: 'dropzone', icon: 'dropzone__icon', text: 'dropzone__text' }}
        />
      }

      { 
        !initialDocs.length ? null : 
        <DropzoneArea
          key={props.type}
          { ...props }
          initialFiles={initialDocs}
          onChange={files => props.onChange(files)}
          acceptedFiles={['application/*']}
          dropzoneText={props.text}
          filesLimit={12}
          classes={{ root: 'dropzone', icon: 'dropzone__icon', text: 'dropzone__text' }}
        />
      }
    </React.Fragment>
  )
}

export default Dropzone;