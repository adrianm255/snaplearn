import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichText = ({ value, onChange }) => {
  return <ReactQuill theme="snow" value={value} onChange={onChange} />
};

export default RichText;