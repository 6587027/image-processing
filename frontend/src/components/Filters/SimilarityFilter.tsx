import React from 'react';

interface FilterOption {
  label: string;
  value: 'all' | 'high' | 'medium' | 'low';
  color: string;
  bgColor: string;
  range: string;
}

interface SimilarityFilterProps {
  activeFilter: 'all' | 'high' | 'medium' | 'low';
  onFilterChange: (filter: 'all' | 'high' | 'medium' | 'low') => void;
  counts?: {
    all: number;
    high: number;
    medium: number;
    low: number;
  };
}

const SimilarityFilter: React.FC<SimilarityFilterProps> = ({
  activeFilter,
  onFilterChange,
  counts
}) => {
  const filters: FilterOption[] = [
    {
      label: 'ทั้งหมด',
      value: 'all',
      color: '#6B7280',
      bgColor: '#F3F4F6',
      range: 'All'
    },
    {
      label: 'สีเขียว',
      value: 'high',
      color: '#10B981',
      bgColor: '#D1FAE5',
      range: '70-100%'
    },
    {
      label: 'สีส้ม',
      value: 'medium',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      range: '40-69%'
    },
    {
      label: 'สีแดง',
      value: 'low',
      color: '#EF4444',
      bgColor: '#FEE2E2',
      range: '0-39%'
    }
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        marginBottom: '2rem'
      }}
    >
      {filters.map((filter) => {
        const count = counts ? counts[filter.value] : 0;
        const isActive = activeFilter === filter.value;
        
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '20px',
              border: '2px solid',
              borderColor: isActive ? filter.color : '#E5E7EB',
              backgroundColor: isActive ? filter.bgColor : 'white',
              color: isActive ? filter.color : '#6B7280',
              fontWeight: '600',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = filter.color;
                e.currentTarget.style.backgroundColor = filter.bgColor;
                e.currentTarget.style.color = filter.color;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#6B7280';
              }
            }}
          >
            <span>{filter.label}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
              {filter.range}
            </span>
            {counts && (
              <span
                style={{
                  backgroundColor: isActive ? 'rgba(0, 0, 0, 0.15)' : '#F3F4F6',
                  color: isActive ? filter.color : '#6B7280',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  minWidth: '24px',
                  textAlign: 'center'
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SimilarityFilter;