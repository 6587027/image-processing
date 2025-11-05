import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

const FileUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
    },
    multiple: true
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 
        style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#2563EB'
        }}
      >
        Upload Files
      </h2>

      <div
        {...getRootProps()}
        style={{
          border: '4px dashed',
          borderColor: isDragActive ? '#3B82F6' : '#60A5FA',
          borderRadius: '24px',
          padding: '4rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#EFF6FF' : '#FFFFFF',
          transition: 'all 0.3s ease'
        }}
      >
        <input {...getInputProps()} />
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <svg 
            width="80" 
            height="80" 
            viewBox="0 0 80 80" 
            fill="none"
          >
            <path 
              d="M20 50C20 45 22 40 26 37C26 28 32 20 40 20C48 20 54 28 54 37C58 40 60 45 60 50C60 58 54 65 45 65H35C26 65 20 58 20 50Z" 
              stroke="#EB7C24" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              fill="none"
            />
            <path 
              d="M40 45V65M40 45L33 52M40 45L47 52" 
              stroke="#EB7C24" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          
          <div>
            <p 
              style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '0.5rem'
              }}
            >
              {isDragActive ? 'Drop files here' : 'Drag & Drop files here or'}
            </p>
            <p 
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#2563EB'
              }}
            >
              click to select
            </p>
          </div>
          
          <p 
            style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              marginTop: '0.5rem'
            }}
          >
            Supported file type: PNG, JPG, SVG, GIF, WEBP
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <p 
            style={{
              fontSize: '0.875rem',
              color: '#4B5563',
              marginBottom: '1rem',
              fontWeight: '500'
            }}
          >
            {files.length} file(s) selected
          </p>
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '1rem'
            }}
          >
            {files.map((file) => (
              <div 
                key={file.id} 
                style={{
                  position: 'relative'
                }}
              >
                <img
                  src={file.preview}
                  alt={file.file.name}
                  style={{
                    width: '100%',
                    height: '7rem',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '2px solid #E5E7EB',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFiles(files.filter(f => f.id !== file.id));
                  }}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    backgroundColor: '#EF4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    fontWeight: '700',
                    fontSize: '1.125rem'
                  }}
                >
                  ×
                </button>
                <p 
                  style={{
                    fontSize: '0.75rem',
                    color: '#4B5563',
                    marginTop: '0.5rem',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {file.file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => {
            if (files.length > 0) {
              alert('Search functionality coming soon!');
            }
          }}
          disabled={files.length === 0}
          style={{
            padding: '0.875rem 3rem',
            borderRadius: '9999px',
            fontWeight: '600',
            fontSize: '1.125rem',
            color: 'white',
            background: files.length > 0 
              ? 'linear-gradient(135deg, #EB7C24 0%, #F59E0B 100%)' 
              : '#D1D5DB',
            border: 'none',
            cursor: files.length > 0 ? 'pointer' : 'not-allowed',
            boxShadow: files.length > 0 ? '0 10px 15px rgba(235, 124, 36, 0.3)' : 'none',
            transition: 'all 0.2s ease',
            opacity: files.length === 0 ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (files.length > 0) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 20px 25px rgba(235, 124, 36, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = files.length > 0 
              ? '0 10px 15px rgba(235, 124, 36, 0.3)' 
              : 'none';
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default FileUpload;