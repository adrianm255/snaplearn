import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Label } from './ui/label';

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
    <div style={style} className="flex flex-col gap-3">
      {label && <Label htmlFor={name}>{label}</Label>}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        { ...inputProps }
      />

      <div onClick={handleButtonClick} className="cursor-pointer flex h-12 w-full rounded-md border border-input bg-input-background px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 top-level-input">
        <div className="truncate">Choose file: {selectedFileName || 'No file chosen'}</div>
      </div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
});

export default FileInput;
