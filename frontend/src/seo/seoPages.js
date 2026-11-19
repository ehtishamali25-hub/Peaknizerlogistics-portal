// src/seo/seoPages.js
// One entry per PUBLIC page: its Google title and description.
// Every title ends with "| Peaknizer Logistics" (or names it) and stays under 60 characters,
// so Google shows it in full.
// Any URL not listed here (login, portal pages, unknown URLs) gets "noindex" automatically
// from RouteSeo.jsx, so it stays out of Google.
//
// Add a page here ONLY when the page really exists on the site.
// (/careers will be added when its page is built.)
// Every page listed here is also pre-rendered (scripts/prerender.mjs). On Render, each one
// needs its own Rewrite rule ( /page -> /page/index.html ) above the "/*" rule.
//
// Blog articles are added at the bottom of this file automatically, one for every post in
// src/data/blogPosts.js. The Render rule /blog/:slug -> /blog/:slug/index.html covers all of them.

import { FAQS, answerText } from '../data/faqContent.js';
import { BLOG_POSTS } from '../data/blogPosts.js';

export const SITE = 'https://peaknizerlogistics.com';
export const SITE_NAME = 'Peaknizer Logistics';
export const DEFAULT_IMAGE = `${SITE}/images/warehouse-wide.jpg`;

export const SEO_PAGES = {
  '/': {
    title: 'US 3PL Warehouse & Prep Services | Peaknizer Logistics',
    description:
      'US 3PL for product prep, warehousing and fulfillment, serving small and growing brands on Amazon, Walmart, Shopify, eBay and TikTok Shop nationwide.',
  },
  '/services': {
    title: '3PL Prep, Storage & Fulfillment | Peaknizer Logistics',
    description:
      'Product prep, storage and order fulfillment for ecommerce sellers. See every 3PL service Peaknizer Logistics offers and how each one works.',
  },
  '/pricing': {
    title: '3PL Prep, Storage & Shipping Rates | Peaknizer Logistics',
    description:
      'See Peaknizer Logistics rates for prep, storage and shipping, what each fee covers, and how to get a custom quote for your order volume.',
  },
  '/about': {
    title: 'About Peaknizer Logistics | 3PL Based in Arlington, VA',
    description:
      'Peaknizer Logistics is a 3PL based in Arlington, Virginia, serving ecommerce sellers and brands across the USA. Meet the team and see how we work.',
  },
  '/contact': {
    title: 'Contact Peaknizer Logistics | Get a 3PL Quote',
    description:
      'Get a 3PL quote or ask a question. Contact Peaknizer Logistics about prep, warehousing and fulfillment for your store, anywhere in the USA.',
  },
  '/faq': {
    title: '3PL FAQ: Prep, Pricing & Shipping | Peaknizer Logistics',
    description:
      'Answers about our 3PL services: prices, no minimum volume, same-day shipping, the marketplaces we support, onboarding, dropshipping and online tracking.',
    // FAQ structured data for Google and AI assistants, built from the same text as the page
    schema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: answerText(faq) },
      })),
    },
  },
  '/terms': {
    title: 'Terms of Service | Peaknizer Logistics',
    description:
      'The terms for using our 3PL services: receiving, prep, fulfillment, fees and payment, lost or damaged inventory, prohibited products and ending service.',
  },
  '/privacy': {
    title: 'Privacy Policy | Peaknizer Logistics',
    description:
      'How Peaknizer Logistics collects, uses and protects the information you share with us on this website.',
  },
  '/blog': {
    title: '3PL & Ecommerce Fulfillment Blog | Peaknizer Logistics',
    description:
      'Guides on Amazon FBA prep, Walmart WFS, TikTok Shop, multichannel fulfillment and shipping for small and growing ecommerce brands in the USA.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Peaknizer Logistics Blog',
      url: `${SITE}/blog`,
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE },
      blogPost: BLOG_POSTS.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: `${SITE}/blog/${post.slug}`,
        datePublished: post.date,
        image: `${SITE}${post.image}`,
      })),
    },
  },
};

// ---------------------------------------------------------------------------
// Blog articles: /blog/<slug> for every post in blogPosts.js
// ---------------------------------------------------------------------------

// Shorter titles for Google (the full title still shows on the page).
// A post that is not listed here uses "<its full title> | Peaknizer Logistics".
const BLOG_SEO_TITLES = {
  'what-is-a-3pl': 'What Is a 3PL? A Simple Guide | Peaknizer Logistics',
  'how-to-choose-a-3pl-warehouse': 'How to Choose a 3PL Warehouse | Peaknizer Logistics',
  'amazon-fba-prep-guide': 'Amazon FBA Prep Guide for 2026 | Peaknizer Logistics',
  'fba-vs-fbm': 'FBA vs FBM: Which Should You Use? | Peaknizer Logistics',
  'walmart-wfs-prep-guide': 'Walmart WFS Prep Requirements | Peaknizer Logistics',
  'tiktok-shop-fulfillment': 'TikTok Shop Fulfillment Guide | Peaknizer Logistics',
  'multichannel-fulfillment': 'Multichannel Fulfillment Guide | Peaknizer Logistics',
  'kitting-and-bundling': 'Kitting & Bundling for Ecommerce | Peaknizer Logistics',
  'same-day-shipping-cutoff-times': 'Same-Day Shipping & Cutoff Times | Peaknizer Logistics',
  'dropshipping-from-a-us-warehouse': 'Dropshipping From a US Warehouse | Peaknizer Logistics',
};

for (const post of BLOG_POSTS) {
  const url = `${SITE}/blog/${post.slug}`;
  const image = `${SITE}${post.image}`;

  SEO_PAGES[`/blog/${post.slug}`] = {
    title: BLOG_SEO_TITLES[post.slug] || `${post.title} | ${SITE_NAME}`,
    description: post.description,
    image,
    // Article structured data for Google and AI assistants, plus the Home > Blog > article path
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BlogPosting',
          '@id': `${url}#article`,
          headline: post.title,
          description: post.description,
          image: [image],
          datePublished: post.date,
          dateModified: post.updated || post.date,
          articleSection: post.category,
          inLanguage: 'en-US',
          mainEntityOfPage: url,
          author: { '@type': 'Organization', name: SITE_NAME, url: SITE },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE,
            logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: url },
          ],
        },
      ],
    },
  };
}