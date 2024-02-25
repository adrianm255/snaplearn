import React, { Suspense, lazy } from 'react';

interface FieldProps {
  type: FieldType;
  name: string;
  label?: string;
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
  RichText = 'rich_text'
};

const ReactQuill = lazy(() => import('../../components/RichText/RichText'));

const Field: React.FC<FieldProps> = ({ type, name, label, placeholder, value, onChange, ...inputProps }) => {
  const isInputField = (): boolean => {
    return [FieldType.Text, FieldType.Number, FieldType.Email, FieldType.Password].includes(type);
  };

  const commonProps = {
    name,
    id: name,
    placeholder,
    value,
    onChange,
    className: "top-level-input",
    ...inputProps
  };

  return (
    <fieldset>
      {label && <legend>
        <label className="top-level-label" htmlFor={name}>{label}</label>
      </legend>}

      {isInputField() && <input type={type} { ...commonProps } />}

      {type === FieldType.Textarea && <textarea { ...commonProps }></textarea>}

      {type === FieldType.RichText &&
        <Suspense fallback={<div>Loading text editor...</div>}>
          <ReactQuill value={value} onChange={onChange} />
        </Suspense>
      }
    </fieldset>
  );
};

export default Field;
