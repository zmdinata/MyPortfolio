import { useEffect } from 'react';

/**
 * Custom Hook for Dynamic SEO Titles & Meta Description
 * Enhances search indexing signals for Zacky Muhammad Dinata (zmdinata)
 */
export function useDocumentTitle(title, description) {
  useEffect(() => {
    const baseTitle = 'Zacky Muhammad Dinata (zmdinata)';
    document.title = title ? title + ' | ' + baseTitle : baseTitle + ' — AI Engineer & Multi-Agent Orchestrator';

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);
}
