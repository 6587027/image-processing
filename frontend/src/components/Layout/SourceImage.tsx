import React from 'react';

interface SourceImageProps {
  imageUrl: string;
  filename: string;
  onRemove?: () => void;
}

const SourceImage: React.FC<SourceImageProps> = ({ imageUrl, filename, onRemove }) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <h3
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#15206c',
            margin: 0
          }}
        >
          Image Processing
        </h3>
        {onRemove && (
          <button
            onClick={onRemove}
            style={{
              backgroundColor: '#EF4444',
              color: 'white',
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#EF4444';
            }}
          >
            Try Again
          </button>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          padding: '1.5rem',
          backgroundColor: '#FFFBEB',
          border: '2px solid #EB7C24',
          borderRadius: '12px'
        }}
      >
        <img
          src={imageUrl}
          alt={filename}
          style={{
            width: '200px',
            height: '200px',
            objectFit: 'contain',
            borderRadius: '8px',
            backgroundColor: 'white'
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '1rem',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              maxWidth: '100%'
            }}
            title={filename}
          >
            {filename}
          </p>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap'
            }}
          >
            <span
              style={{
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                padding: '0.375rem 0.875rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              ทั้งหมด
            </span>
            <span
              style={{
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                padding: '0.375rem 0.875rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              สี
            </span>
            <span
              style={{
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                padding: '0.375rem 0.875rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              ขนาด
            </span>
            <span
              style={{
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                padding: '0.375rem 0.875rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              รูปร่าง
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceImage;