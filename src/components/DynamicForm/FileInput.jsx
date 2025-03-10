import React, { useState, useEffect } from 'react';
import { useField } from 'informed';

const FileInput = ({ field, validate }) => {
  const { id, label, accept, required } = field;
  const {
    fieldState: { value, error },
    fieldApi: { setValue },
    ref,
  } = useField({
    name: id,
    validate,
    validateOn: 'change',
  });

  const [preview, setPreview] = useState({ url: null, type: null });

  useEffect(() => {
    let newPreview = { url: null, type: null };

    if (value && value.length > 0) {
      const file = value[0];
      const extension = file.name.split('.').pop().toLowerCase();
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
      let fileType = 'unsupported';

      if (imageExtensions.includes(extension)) {
        fileType = 'image';
      } else if (extension === 'pdf') {
        fileType = 'pdf';
      }

      newPreview = {
        url: URL.createObjectURL(file),
        type: fileType,
      };
    }

    setPreview(newPreview);

    return () => {
      if (newPreview.url) {
        URL.revokeObjectURL(newPreview.url);
      }
    };
  }, [value]);

  const handleChange = (event) => {
    const files = event.target.files;
    setValue(files.length > 0 ? files : null);
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

      {/* Display Attached File Name(s) */}
      {value && value.length > 0 && (
        <div className="mt-2 text-sm text-gray-700">
          {value.length === 1 ? (
            <span>{value[0].name}</span>
          ) : (
            value.map((file, index) => (
              <span key={index}>
                {file.name}
                {index < value.length - 1 ? ', ' : ''}
              </span>
            ))
          )}
        </div>
      )}

      {/* Preview */}
      {preview.type && (
        <div className="mt-4">
          {preview.type === 'image' && (
            <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-lg border border-gray-200">
              <img src={preview.url} alt="Preview" className="object-cover" />
            </div>
          )}
          {preview.type === 'pdf' && (
            <iframe
              src={preview.url}
              title="PDF Preview"
              style={{ width: '100%', height: '500px', border: 'none' }}
            />
          )}
          {preview.type === 'unsupported' && (
            <p className="text-gray-500">
              Preview not available for this file type.
            </p>
          )}
        </div>
      )}

      {/* Error */}
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};

export default FileInput;
