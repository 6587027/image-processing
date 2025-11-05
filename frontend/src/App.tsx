import { useState } from 'react';
import Header from './components/Layout/Header';
import FileUpload from './components/Upload/FileUpload';
import './index.css';

function App() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 1rem' }}>
        <FileUpload />
      </main>
    </>
  );
}

export default App;