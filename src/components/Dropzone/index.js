import './style.scss';
import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';

const useStyles = makeStyles(theme => createStyles({
  previewChip: {
    minWidth: 160,
    maxWidth: 210
  },
}));

function Dropzone(props) {
  const [initialDocs, setInitialDocs] = React.useState([]);
  const [initialImages, setInitialImages] = React.useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const classes = useStyles();
  const extractImageUrl = (str) => {
    return str && str.replace(/\\/g,"/").replace("wwwroot",process.env.REACT_APP_INTELUCK_API_ENDPOINT);
  }
  
  const collapseText = expanded ? 'Hide Photos' : 'See Photos'

  const handleExpandClick = () => {
    setExpanded(!expanded);
    
    // console.log(initialImages.match(/warehouse_docs - \/(.*)/)[1]);
  };
  const pdfIcon = '/assets/images/pdfIcon.svg'
  const docxIcon = '/assets/images/docIcon.svg'

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

  const handlePreviewIcon = (file) => {
    console.log(file)
    return (
      <React.Fragment>
      {
        props.type === 'image' ? <img role="presentation" src={file.data} /> :
        <React.Fragment>
          <div className={classes.root}>
            <Badge>
              <img className="doc-img" src={pdfIcon} />
            </Badge>
            
            <Badge>
              <Typography variant='subtitle2' >{file.file.name} </Typography>
            </Badge>
             {/* <Badge color="secondary" variant="dot">
              <MailIcon />
            </Badge>
            <Badge color="secondary" variant="dot">
              <Typography>Typography</Typography>
            </Badge> */}
          </div>
        </React.Fragment>
      }
      </React.Fragment>
    )
  }

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
          previewGridProps={{container: { direction: 'row' }}}
          getPreviewIcon={file => handlePreviewIcon(file)}
          classes={{ root: 'dropzone', icon: 'dropzone__icon', text: 'dropzone__text' }}
        />
      }

      { 
        !initialImages.length ? null : 
        <React.Fragment>
          <DropzoneArea
            key={props.type}
            { ...props }
            initialFiles={initialImages}
            onChange={files => props.onChange(files)}
            acceptedFiles={['image/*']}
            dropzoneText={props.text}
            previewText=""
            filesLimit={12}
            getPreviewIcon={file => {
              return (
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <img role="presentation" src={file.data} />
                </Collapse>
              );
            }}
            classes={{ root: 'dropzone', icon: 'dropzone__icon', text: 'dropzone__text' }}
          />
          <Typography variant='subtitle2' style={{color: '#009688', cursor: 'pointer', marginLeft: '1%'}} onClick={handleExpandClick} aria-expanded={expanded} >
            {collapseText}
          </Typography>
        </React.Fragment>
      }

      { 
        !initialDocs.length ? null : 
        <React.Fragment>
          <DropzoneArea
            previewGridClasses={{ root: 'dropzone__list' }}
            key={props.type}
            { ...props }
            initialFiles={initialDocs}
            onChange={files => props.onChange(files)}
            acceptedFiles={['application/*']}
            dropzoneText={props.text}
            filesLimit={12}
            useChipsForPreview
            previewGridProps={{container: { spacing: 1, direction: 'row' }}}
            previewChipProps={{classes: { root: classes.previewChip } }}
            previewText="Selected files"
            // previewText=""
            // useChipsForPreview
            // getPreviewIcon={file => {
            //   console.log(file);
            //   return <img src={pdfIcon} />
            // }}
            classes={{ root: 'dropzone', icon: 'dropzone__icon', text: 'dropzone__text' }}
          />
          <Typography variant='subtitle2' style={{color: '#009688', cursor: 'pointer', marginLeft: '1%'}} onClick={handleExpandClick} aria-expanded={expanded} >
            {collapseText}
          </Typography>
        </React.Fragment>
      }
    </React.Fragment>
  )
}

export default Dropzone;