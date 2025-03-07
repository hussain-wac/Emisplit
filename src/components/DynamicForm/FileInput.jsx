import React, { useState, useRef } from 'react';
import { useField } from 'informed';

const FileInput = ({ field, validate }) => {
  const { id, label, accept, required } = field;
  const {
    fieldState: { value, error },
    fieldApi: { setValue },ref
  } = useField({
    name: id,
    validate,
    validateOn: 'change',
  });

 
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  // Ref to track the previous preview URL for cleanup
  const prevPreviewUrlRef = useRef(null);

  // Handle file selection and preview logic
  const handleChange = (event) => {
    const files = event.target.files;
  
    if (files.length === 0) {
      // Reset state if no file is selected
      setValue(null);
      setFileType(null);
      setPreviewUrl(null);
      
      if (prevPreviewUrlRef.current) {
        URL.revokeObjectURL(prevPreviewUrlRef.current);
        prevPreviewUrlRef.current = null;
      }
      return;
    }
  
    setValue(files);
  
    const file = files[0];
    const extension = file.name.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
  
    let newFileType = 'unsupported';
    if (imageExtensions.includes(extension)) {
      newFileType = 'image';
    } else if (extension === 'pdf') {
      newFileType = 'pdf';
    }
    setFileType(newFileType);
  
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
  
    if (prevPreviewUrlRef.current) {
      URL.revokeObjectURL(prevPreviewUrlRef.current);
    }
    prevPreviewUrlRef.current = newPreviewUrl;
  };
  
  return (
    <div className="space-y-4">
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* File Input */}
      <div className="relative flex items-center">
        <input
          name={id}
          ref={ref}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute left-0 right-0 top-0 bottom-0 opacity-0"
        />
        <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-sm text-gray-600 hover:bg-gray-50">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span>Drag and drop files or browse</span>
        </div>
      </div>

      {/* Preview */}
      {fileType && (
        <div className="mt-4">
          {fileType === 'image' && (
            <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg border border-gray-200">
              <img
                src={previewUrl}
                alt="Preview"
                className="object-cover"
              />
            </div>
          )}
          {fileType === 'pdf' && (
            <iframe
              src={previewUrl}
              title="PDF Preview"
              style={{ width: '100%', height: '500px', border: 'none' }}
            />
          )}
          {fileType === 'unsupported' && (
            <p className="text-gray-500">Preview not available for this file type.</p>
          )}
        </div>
      )}

      {/* Error */}
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default FileInput;