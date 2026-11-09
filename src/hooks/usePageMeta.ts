import { useEffect } from 'react';

interface PageMetaOptions {
  title: string;
  description: string;
  ogType?: string;
}

/**
 * Updates document.title, meta descriptions, and Open Graph tags per route.
 * Also shifts programmatic keyboard focus to the main h1 landmark and announces the title for screen readers.
 */
export function usePageMeta({ title, description, ogType = 'website' }: PageMetaOptions): void {
  useEffect(() => {
    // 1. Update Title (50-60 characters ideal)
    const formattedTitle = title.includes('Grantly') ? title : `${title} | Grantly`;
    document.title = formattedTitle;

    // 2. Update Meta Description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', description);

    // 3. Update Open Graph Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', formattedTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', formattedTitle);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', description);

    // 4. Focus management: move focus to page h1 for assistive technologies
    const h1 = document.querySelector('h1');
    if (h1) {
      h1.setAttribute('tabIndex', '-1');
      h1.focus({ preventScroll: false });
    } else {
      window.scrollTo(0, 0);
    }
  }, [title, description, ogType]);
}
