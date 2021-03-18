import './style.scss';
import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';

function Dropzone(props) {

  return (
    <DropzoneArea
      { ...props }
      onChange={files => props.onChange(files)}
      acceptedFiles={props.type === 'image' ? ['image/*'] : []}
      dropzoneText={props.text}
      classes={{ root: 'dropzone', icon: 'dropzone__icon', text: 'dropzone__text' }}
    />
  )
}

export default Dropzone;