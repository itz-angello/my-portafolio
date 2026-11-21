import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LanguageProvider } from '../context/LanguageContext';
import { Layout } from '../components/Layout';
import { CertificatesPage } from '../pages/CertificatesPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <Layout currentPage="certificates">
        <CertificatesPage />
      </Layout>
    </LanguageProvider>
  </React.StrictMode>
);
