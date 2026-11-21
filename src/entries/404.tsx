import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LanguageProvider } from '../context/LanguageContext';
import { Layout } from '../components/Layout';
import { NotFoundPage } from '../pages/NotFound';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <Layout currentPage="home" metadataPage="notFound">
        <NotFoundPage />
      </Layout>
    </LanguageProvider>
  </React.StrictMode>
);
