// src/seo/RouteSeo.jsx
// Put <RouteSeo /> ONCE inside <BrowserRouter> (in App.jsx).
// On every page change it sets the title, description, canonical address,
// social-share tags and the robots tag. It shows nothing on the page.
//
// Public pages are the ones listed in seoPages.js. Every other URL
// (login, portal pages, unknown URLs) is marked "noindex" so it stays out of Google.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO_PAGES, SITE, SITE_NAME, DEFAULT_IMAGE } from './seoPages';

const SCHEMA_ID = 'page-schema';

// Update the tag if it is already in <head>, otherwise add it (never two of the same)
function setTag(selector, tagName, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(tagName);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

function removeTag(selector) {
  document.head.querySelectorAll(selector).forEach((el) => el.remove());
}

const meta = (name, content) => setTag(`meta[name="${name}"]`, 'meta', { name, content });
const prop = (property, content) => setTag(`meta[property="${property}"]`, 'meta', { property, content });

export default function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    // "/Services/" and "/services" are the same page
    const path = pathname.replace(/\/+$/, '').toLowerCase() || '/';
    const page = Object.prototype.hasOwnProperty.call(SEO_PAGES, path) ? SEO_PAGES[path] : null;

    // Structured data belongs to one page only
    const oldSchema = document.getElementById(SCHEMA_ID);
    if (oldSchema) oldSchema.remove();

    if (!page) {
      // Login, portal and unknown URLs: keep them out of Google.
      // The tags left over from the last public page must not stay on this one.
      document.title = SITE_NAME;
      meta('robots', 'noindex, nofollow');
      removeTag('link[rel="canonical"]');
      removeTag('meta[name="description"]');
      removeTag('meta[property="og:url"]');
      removeTag('meta[property="og:title"]');
      removeTag('meta[property="og:description"]');
      removeTag('meta[name="twitter:title"]');
      removeTag('meta[name="twitter:description"]');
      return;
    }

    const url = SITE + (path === '/' ? '/' : path);
    const image = page.image || DEFAULT_IMAGE;

    document.title = page.title;
    meta('description', page.description);
    meta('robots', 'index, follow');
    setTag('link[rel="canonical"]', 'link', { rel: 'canonical', href: url });

    // Link previews on Facebook, LinkedIn, WhatsApp and X
    prop('og:type', 'website');
    prop('og:site_name', SITE_NAME);
    prop('og:title', page.title);
    prop('og:description', page.description);
    prop('og:url', url);
    prop('og:image', image);
    meta('twitter:card', 'summary_large_image');
    meta('twitter:title', page.title);
    meta('twitter:description', page.description);
    meta('twitter:image', image);

    if (page.schema) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = SCHEMA_ID;
      script.textContent = JSON.stringify(page.schema);
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
}
