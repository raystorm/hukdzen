import React from 'react';
import { IInputProps } from 'react-dropzone-uploader';
import PropTypes from 'prop-types';


/*
 *  Copied from default Input component for Dropzone.
 *  https://github.com/fortana-co/react-dropzone-uploader/blob/2.10.0/src/Input.js 
 *  
 *   Modified with:
 *     + data-testId for input
 *     * js -> tsx
 *     * formatting
 */

const Input = (props: IInputProps) => {
  const {
    className,
    labelClassName, labelWithFilesClassName,
    style, labelStyle, labelWithFilesStyle,
    getFilesFromEvent,
    accept, multiple, disabled,
    content, withFilesContent,
    onFiles, files,
  } = props

  return (
    <label
      className={files.length > 0 ? labelWithFilesClassName : labelClassName}
      style={files.length > 0 ? labelWithFilesStyle : labelStyle}
      htmlFor='dzu-input-id'
    >
      {files.length > 0 ? withFilesContent : content}
      <input data-testId='dzu-input-id' id='dzu-input-id'
        className={className} style={style} type="file"
        accept={accept} multiple={multiple} disabled={disabled}
        onChange={async e => {
          const chosenFiles = await getFilesFromEvent(e);
          onFiles(chosenFiles);
          e.target.value = ''; //should this line use null && ts-ignore?
        }}
      />
    </label>
  )
}

Input.propTypes = {
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  labelWithFilesClassName: PropTypes.string,
  style: PropTypes.object,
  labelStyle: PropTypes.object,
  labelWithFilesStyle: PropTypes.object,
  getFilesFromEvent: PropTypes.func.isRequired,
  accept: PropTypes.string.isRequired,
  multiple: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  content: PropTypes.node,
  withFilesContent: PropTypes.node,
  onFiles: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.any).isRequired,
  extra: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    reject: PropTypes.bool.isRequired,
    dragged: PropTypes.arrayOf(PropTypes.any).isRequired,
    accept: PropTypes.string.isRequired,
    multiple: PropTypes.bool.isRequired,
    minSizeBytes: PropTypes.number.isRequired,
    maxSizeBytes: PropTypes.number.isRequired,
    maxFiles: PropTypes.number.isRequired,
  }).isRequired,
}

export default Input
