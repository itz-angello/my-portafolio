import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Loader } from './Loader';
import { CursorOrb } from './CursorOrb';
import { content } from '../content';
import { MetadataPage, PageMetadata } from './PageMetadata';

type Page = 'home' | 'about' | 'portfolio' | 'contact';

interface LayoutProps {
  currentPage: Page;
  metadataPage?: MetadataPage | null;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentPage, metadataPage, children }) => {
  const resolvedMetadataPage = metadataPage === undefined ? currentPage : metadataPage;
  return (
    <>
      {resolvedMetadataPage && <PageMetadata page={resolvedMetadataPage} />}
      <Loader />
      <CursorOrb />
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-full focus:font-semibold"
        style={{ background: 'var(--color-text)', color: 'var(--color-ink)' }}
      >
        Skip to content
      </a>
      <Navbar currentPage={currentPage} />
      <main id="main-content">
        {children}
      </main>
      <Footer githubUrl={content.github} />
    </>
  );
};
