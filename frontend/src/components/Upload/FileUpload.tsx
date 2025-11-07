import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage, compareImages } from '../../services/api';

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

interface SimilarityResult {
  id: string;
  url: string;
  similarity: number;
  category: 'high' | 'medium' | 'low';
  filename: string;
}

interface FileUploadProps {
  onUploadComplete?: (file: UploadedFile, results: SimilarityResult[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024
  });

  const handleSearch = async () => {
    if (files.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadResponse = await uploadImage(files[0].file, false);
      
      console.log('Upload response:', uploadResponse);

      const compareResponse = await compareImages(uploadResponse.image_id);
      
      console.log('Compare response:', compareResponse);

      if (onUploadComplete) {
        onUploadComplete(
          {
            ...files[0],
            id: uploadResponse.image_id
          },
          compareResponse.results.map(result => ({
            ...result,
            url: `http://localhost:8000${result.url}`
          }))
        );
      }
      
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to process images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
    setError(null);
  };

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

      {error && (
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '2px solid #EF4444',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            color: '#DC2626',
            fontWeight: '500'
          }}
        >
          {error}
        </div>
      )}

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
          viewBox="0 0 256 256"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M244,127.98438a83.2842,83.2842,0,0,1-16.79932,50.40673,4,4,0,1,1-6.39648-4.80468A76.00191,76.00191,0,1,0,84,127.98438a4,4,0,0,1-8,0,83.60038,83.60038,0,0,1,4.57007-27.27344A51.9929,51.9929,0,1,0,72,203.98438H96a4,4,0,0,1,0,8H72A60,60,0,1,1,83.6106,93.11279,83.98155,83.98155,0,0,1,244,127.98438Zm-89.17139-2.82862c-.01587-.01587-.03491-.02612-.051-.0415a3.97671,3.97671,0,0,0-.55835-.45606c-.1001-.06689-.20825-.11279-.3125-.16943a3.87543,3.87543,0,0,0-.3772-.19849,3.9288,3.9288,0,0,0-.397-.12329c-.11695-.03467-.229-.07959-.3501-.10376a4.01456,4.01456,0,0,0-.73413-.074c-.0166-.00025-.03174-.00488-.04834-.00488s-.03174.00463-.04834.00488a4.01456,4.01456,0,0,0-.73413.074c-.12109.02417-.23315.06909-.3501.10376a3.9288,3.9288,0,0,0-.397.12329,3.98559,3.98559,0,0,0-.3772.19825c-.10425.05688-.2124.10278-.3125.16967a3.97671,3.97671,0,0,0-.55835.45606c-.01611.01538-.03515.02563-.051.0415l-33.94092,33.94092a4.00027,4.00027,0,1,0,5.65723,5.65723L148,137.64111v70.34327a4,4,0,0,0,8,0V137.64111l27.1123,27.1128a4.00027,4.00027,0,1,0,5.65723-5.65723Z" 
            fill="#EB7C24"
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '1rem'
            }}
          >
            {files.map((fileObj) => (
              <div 
                key={fileObj.id} 
                style={{
                  position: 'relative'
                }}
              >
                <img
                  src={fileObj.preview}
                  alt={fileObj.file.name}
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
                    removeFile(fileObj.id);
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
                  {fileObj.file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleSearch}
          disabled={uploading || files.length === 0}
          style={{
            padding: '0.875rem 3rem',
            borderRadius: '9999px',
            fontWeight: '600',
            fontSize: '1.125rem',
            color: 'white',
            background: (uploading || files.length === 0)
              ? '#D1D5DB'
              : 'linear-gradient(135deg, #EB7C24 0%, #F59E0B 100%)',
            border: 'none',
            cursor: (uploading || files.length === 0) ? 'not-allowed' : 'pointer',
            boxShadow: (uploading || files.length === 0) ? 'none' : '0 10px 15px rgba(235, 124, 36, 0.3)',
            transition: 'all 0.2s ease',
            opacity: (uploading || files.length === 0) ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            if (!uploading && files.length > 0) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 20px 25px rgba(235, 124, 36, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = (!uploading && files.length > 0)
              ? '0 10px 15px rgba(235, 124, 36, 0.3)' 
              : 'none';
          }}
        >
          {uploading ? (
            <>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  border: '3px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}
              />
              Processing...
            </>
          ) : (
            'Search'
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FileUpload;