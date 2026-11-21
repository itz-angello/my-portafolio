import React, { useEffect } from 'react';
import { content } from '../content';
import { Project } from '../content/projects';
import { useLanguage } from '../context/LanguageContext';

export type MetadataPage = 'home' | 'about' | 'portfolio' | 'contact' | 'notFound' | 'project';

interface PageMetadataProps {
  page: MetadataPage;
  project?: Project;
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = value;
}

export const PageMetadata: React.FC<PageMetadataProps> = ({ page, project }) => {
  const { lang } = useLanguage();
  const staticMetadata = content.texts[lang].metadata;
  const metadata = page === 'project' && project
    ? {
        title: `${project.name[lang]} — Angel Chacón, ${lang === 'es' ? 'Desarrollador web en Guatemala' : 'Web Developer in Guatemala'}`,
        description: `${project.shortDescription[lang]} ${lang === 'es' ? 'Angel Chacón, desarrollador web en Guatemala.' : 'Angel Chacón, web developer in Guatemala.'}`,
      }
    : staticMetadata[page === 'project' ? 'notFound' : page];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = metadata.title;
    setMeta('meta[name="description"]', 'name', 'description', metadata.description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', metadata.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', metadata.description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[property="og:url"]', 'property', 'og:url', new URL(window.location.pathname, window.location.origin).href);
    setMeta('meta[property="og:image"]', 'property', 'og:image', new URL('/og-image.png', window.location.origin).href);
    setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', metadata.title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', metadata.description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', new URL('/og-image.png', window.location.origin).href);
  }, [lang, metadata.description, metadata.title]);

  return null;
};
