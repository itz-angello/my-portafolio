import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LanguageProvider } from '../context/LanguageContext';
import { Layout } from '../components/Layout';
import { ProjectPage } from '../pages/Project';

const routeParts = window.location.pathname.split('/').filter(Boolean);
const slug = routeParts[routeParts.length - 1] ?? '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <Layout currentPage="portfolio" metadataPage={null}>
        <ProjectPage slug={slug} />
      </Layout>
    </LanguageProvider>
  </React.StrictMode>
);
