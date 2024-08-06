import { JSDOM } from 'jsdom';

export function sanitizeHTML(html: string): string {
  const dom = new JSDOM(html);
  const { window } = dom;
  const { document } = window;

  // Remove script tags
  const scriptTags = document.getElementsByTagName('script');
  for (let i = scriptTags.length - 1; i >= 0; i--) {
    const scriptTag = scriptTags[i];
    scriptTag.parentNode?.removeChild(scriptTag);
  }

  // Remove inline event handlers
  const elementsWithEventHandlers = document.querySelectorAll('[onclick]');
  elementsWithEventHandlers.forEach((element) => {
    element.removeAttribute('onclick');
  });

  // Return the sanitized HTML
  return document.documentElement.outerHTML;
}