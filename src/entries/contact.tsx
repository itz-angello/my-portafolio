import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LanguageProvider } from '../context/LanguageContext';
import { Layout } from '../components/Layout';
import { ContactPage } from '../pages/Contact';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <Layout currentPage="contact">
        <ContactPage />
      </Layout>
    </LanguageProvider>
  </React.StrictMode>
);
