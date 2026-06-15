// src/components/shared/FileUpload.jsx
import { useState } from 'react';
import clsx from 'clsx';
import { validateFile } from '@utils/validators';
import { formatFileSize } from '@utils/formatters';
import { VIDEO_EXTENSIONS } from '@utils/constants';

export const FileUpload = ({
  onChange,
  accept = 'image/*,video/*',
  multiple = false,
  maxFiles = 5,
  label,
  error,
  className = '',
}) => {
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      e.target.value = '';
      setPreview([]);
      return;
    }

    // Validate each file
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        alert(validation.message);
        e.target.value = '';
        setPreview([]);
        return;
      }
    }

    // Update preview
    const previews = files.map((file) => ({
      name: file.name,
      size: formatFileSize(file.size),
      isVideo: VIDEO_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext)),
    }));

    setPreview(previews);
    onChange?.(files);
  };

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {label && (
        <label className="font-manrope text-xs font-bold text-text-3 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div
        className={clsx(
          'border-2 border-dashed border-border2 rounded-lg p-6 text-center cursor-pointer',
          'hover:border-brand hover:bg-brand-light transition-all duration-200',
          error && 'border-danger'
        )}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="text-brand text-3xl mb-2">
          <i className="fas fa-cloud-upload-alt"></i>
        </div>
        <p className="font-manrope text-sm text-text-3 mb-1">
          Click to upload {multiple ? 'photos/videos' : 'a photo/video'}
        </p>
        <p className="font-manrope text-xs text-brand">
          JPEG / PNG · Max 2MB {multiple && `· Up to ${maxFiles} files`}
        </p>
        <input
          id="file-input"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {preview.length > 0 && (
        <div className="space-y-2">
          {preview.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-sm font-manrope font-semibold text-green-2"
            >
              <span>{file.isVideo ? '🎥' : '🖼️'}</span>
              <span className="flex-1">{file.name}</span>
              <span className="text-muted">({file.size})</span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <span className="text-xs text-danger font-manrope font-semibold">
          {error}
        </span>
      )}
    </div>
  );
};
export default FileUpload;