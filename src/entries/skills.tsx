import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { LanguageProvider } from '../context/LanguageContext';
import { Layout } from '../components/Layout';
import { SkillsPage } from '../pages/SkillsPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <Layout currentPage="skills">
        <SkillsPage />
      </Layout>
    </LanguageProvider>
  </React.StrictMode>
);
