const Header = () => {
  return (
    <header 
      style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #e5e7eb'
      }}
    >
      <div 
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #15206c 0%, #2563EB 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 12 L16 6 L24 12 L16 18 Z" fill="white" fillOpacity="0.9"/>
              <path d="M8 20 L16 14 L24 20 L16 26 Z" fill="white" fillOpacity="0.7"/>
            </svg>
          </div>
          
          <div>
            <h1 
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                lineHeight: '1'
              }}
            >
              <span style={{ color: '#15206c' }}>Zenith</span>{' '}
              <span style={{ color: '#EB7C24' }}>Comp</span>
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;