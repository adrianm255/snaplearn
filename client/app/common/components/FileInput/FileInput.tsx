import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';

type FileInputProps = {
  onFileSelect: (files: FileList) => void;
  fileName?: string;
  label?: string;
  description?: string;
  [ propName: string ]: any;
};

export type FileInputHandle = {
  openFileDialog: () => void;
  clear: () => void;
};

const FileInput = forwardRef<FileInputHandle, FileInputProps>(({ onFileSelect, fileName = '', label, description, ...inputProps }, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>(fileName);
  const { name, style } = inputProps;

  useImperativeHandle(ref, () => ({
    openFileDialog: () => {
      fileInputRef.current?.click();
    },
    clear: () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        setSelectedFileName('');
      }
    },
  }));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFileName(file.name);
      onFileSelect(files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <fieldset style={style}>
      {label && <legend>
        <label className="top-level-label" htmlFor={name}>{label}</label>
      </legend>}

      <div className="file-input">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          { ...inputProps }
        />
        <button type="button" className="primary" onClick={handleButtonClick}>
          <span className="icon icon-upload-fill"></span>
          {selectedFileName ? 'Change File' : 'Upload File'}
        </button>
        <div>{description}</div>
        <div>Selected file: {selectedFileName || 'No file selected'}</div>
      </div>
    </fieldset>
  );
});

export default FileInput;
