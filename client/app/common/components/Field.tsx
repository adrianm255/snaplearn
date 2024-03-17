import React, { Suspense, forwardRef, lazy, useImperativeHandle, useRef } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface FieldProps {
  type: FieldType;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  [ propName: string ]: any;
};

export enum FieldType {
  Text = 'text',
  Number = 'number',
  Email = 'email',
  Password = 'password',
  Textarea = 'textarea',
  RichText = 'rich_text',
  File = 'file',
};

export type FieldHandle = {
  openFileDialog: () => void;
  clear: () => void;
};

// TODO use helper
const ReactQuill = lazy(() => import('./RichText'));

const Field = forwardRef<FieldHandle, FieldProps>(({ type, name, label, description, placeholder, value, onChange, ...inputProps }, ref) => {
  const inputRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    openFileDialog: () => {
      inputRef.current?.click();
    },
    clear: () => {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
  }));
  
  const isInputField = (): boolean => {
    return [FieldType.Text, FieldType.Number, FieldType.Email, FieldType.Password, FieldType.File].includes(type);
  };

  const commonProps = {
    ref: inputRef,
    name,
    id: name,
    placeholder,
    value,
    onChange,
    className: "top-level-input",
    ...inputProps
  };

  return (
    <div className="flex flex-col gap-3">
      {label && <Label htmlFor={name}>{label}</Label>}

      {isInputField() && <Input type={type} { ...commonProps } />}

      {type === FieldType.Textarea && <Textarea { ...commonProps }></Textarea>}

      {type === FieldType.RichText &&
        <Suspense fallback={<div>Loading text editor...</div>}>
          <ReactQuill value={value} onChange={onChange} />
        </Suspense>
      }

      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
});

export default Field;
