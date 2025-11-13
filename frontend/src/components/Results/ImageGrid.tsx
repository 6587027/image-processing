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
        return '#10B981'; // Green
      case 'medium':
        return '#F59E0B'; // Orange/Amber
      case 'low':
        return '#EF4444'; // Red
      default:
        return '#6B7280';
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'high':
        return '#D1FAE5'; // Light Green
      case 'medium':
        return '#FEF3C7'; // Light Orange/Amber
      case 'low':
        return '#FEE2E2'; // Light Red
      default:
        return '#F3F4F6';
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        // Updated: Adjusted minmax for slightly smaller cards if needed
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
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
            // Updated: Replaced shadow with border
            boxShadow: 'none',
            border: '1px solid #E5E7EB',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative',
            // Added flex layout to manage content order
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem' // Space between items
          }}
          // Updated: Simplified hover effect
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = getCategoryColor(result.category);
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E5E7EB';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* 1. Image */}
          <div style={{ position: 'relative', width: '100%' }}>
            <img
              src={result.url}
              alt={result.filename}
              style={{
                width: '100%',
                height: '180px', // Adjusted height
                objectFit: 'contain',
                borderRadius: '12px',
                backgroundColor: '#F9FAFB'
              }}
            />
          </div>
          
          {/* 2. Filename */}
          <p
            style={{
              fontSize: '0.875rem',
              color: '#4B5563',
              textAlign: 'center',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {result.filename}
          </p>

          {/* 3. Similarity Score Box (Moved) */}
          <div
            style={{
              backgroundColor: getCategoryBg(result.category),
              color: getCategoryColor(result.category),
              padding: '0.5rem',
              borderRadius: '8px', // Slightly less rounded than pill
              fontWeight: '700',
              fontSize: '1.125rem', // Slightly smaller
              textAlign: 'center',
              width: '100%'
            }}
          >
            {result.similarity}%
          </div>
          
          {/* 4. "Similarity" Text */}
          <p
            style={{
              fontSize: '0.75rem',
              color: '#9CA3AF',
              textAlign: 'center',
              fontWeight: '500',
              margin: 0 // Removed default margin
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