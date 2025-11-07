import { useState } from 'react';
import Header from './components/Layout/Header';
import FileUpload from './components/Upload/FileUpload';
import SourceImage from './components/Layout/SourceImage';
import SimilarityFilter from './components/Filters/SimilarityFilter';
import ImageGrid from './components/Results/ImageGrid';
import './index.css';

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

function App() {
  const [sourceImage, setSourceImage] = useState<UploadedFile | null>(null);
  const [results, setResults] = useState<SimilarityResult[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const handleUploadComplete = (file: UploadedFile, mockResults: SimilarityResult[]) => {
    setSourceImage(file);
    setResults(mockResults);
  };

  const handleReset = () => {
    setSourceImage(null);
    setResults([]);
    setActiveFilter('all');
  };

  const filteredResults = results.filter(result => {
    if (activeFilter === 'all') return true;
    return result.category === activeFilter;
  });

  const getCounts = () => ({
    all: results.length,
    high: results.filter(r => r.category === 'high').length,
    medium: results.filter(r => r.category === 'medium').length,
    low: results.filter(r => r.category === 'low').length,
  });

  return (
    <>
      <Header />
      <main 
        style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '2rem 1.5rem',
          minHeight: 'calc(100vh - 80px)'
        }}
      >
        {!sourceImage ? (
          <FileUpload onUploadComplete={handleUploadComplete} />
        ) : (
          <div>
            <SourceImage
              imageUrl={sourceImage.preview}
              filename={sourceImage.file.name}
              onRemove={handleReset}
            />

            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}
            >
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#15206c',
                  marginBottom: '1.5rem'
                }}
              >
                Similar Images ({filteredResults.length})
              </h3>

              <SimilarityFilter
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={getCounts()}
              />

              {filteredResults.length > 0 ? (
                <ImageGrid 
                  results={filteredResults}
                  onImageClick={(result) => {
                    console.log('Clicked image:', result);
                  }}
                />
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: '#9CA3AF'
                  }}
                >
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    style={{ margin: '0 auto 1rem' }}
                  >
                    <path
                      d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24 24-10.7 24-24S45.3 8 32 8zm0 4c11 0 20 9 20 20s-9 20-20 20-20-9-20-20 9-20 20-20z"
                      fill="#D1D5DB"
                    />
                    <path
                      d="M24 24h16v4H24v-4zm0 8h16v4H24v-4z"
                      fill="#D1D5DB"
                    />
                  </svg>
                  <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    No images found
                  </p>
                  <p style={{ fontSize: '0.875rem' }}>
                    Try selecting a different filter
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default App;