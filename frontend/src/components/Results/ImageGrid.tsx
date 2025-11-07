import React from 'react';

interface SimilarityResult {
  id: string;
  url: string;
  similarity: number;
  category: 'high' | 'medium' | 'low';
  filename: string;
}

interface ImageGridProps {
  results: SimilarityResult[];
  onImageClick?: (result: SimilarityResult) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ results, onImageClick }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'high':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'high':
        return '#D1FAE5';
      case 'medium':
        return '#FEF3C7';
      case 'low':
        return '#FEE2E2';
      default:
        return '#F3F4F6';
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginTop: '1rem'
      }}
    >
      {results.map((result) => (
        <div
          key={result.id}
          onClick={() => onImageClick?.(result)}
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            border: '2px solid transparent',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)';
            e.currentTarget.style.borderColor = getCategoryColor(result.category);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
        >
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <img
              src={result.url}
              alt={result.filename}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'contain',
                borderRadius: '12px',
                backgroundColor: '#F9FAFB'
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '0.5rem',
                right: '0.5rem',
                backgroundColor: getCategoryBg(result.category),
                color: getCategoryColor(result.category),
                padding: '0.375rem 0.75rem',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '1.25rem',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                border: `2px solid ${getCategoryColor(result.category)}`
              }}
            >
              {result.similarity}%
            </div>
          </div>
          
          <p
            style={{
              fontSize: '0.875rem',
              color: '#4B5563',
              textAlign: 'center',
              marginBottom: '0.25rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {result.filename}
          </p>
          
          <p
            style={{
              fontSize: '0.75rem',
              color: '#9CA3AF',
              textAlign: 'center',
              fontWeight: '500'
            }}
          >
            Similarity
          </p>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;