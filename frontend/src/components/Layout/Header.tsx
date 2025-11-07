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
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src="/zenithcomp_logo.png"
            alt="Zenith Comp Logo"
            style={{
              height: '48px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          
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
