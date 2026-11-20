import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LanguageProvider } from '../context/LanguageContext';
import { Layout } from '../components/Layout';
import { PortfolioPage } from '../pages/Portfolio';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <Layout currentPage="portfolio">
        <PortfolioPage />
      </Layout>
    </LanguageProvider>
  </React.StrictMode>
);
