// src/seo/seoPages.js
// One entry per PUBLIC page: its Google title and description.
// Every title ends with "| Peaknizer Logistics" (or names it) and stays under 60 characters,
// so Google shows it in full.
// Any URL not listed here (login, portal pages, unknown URLs) gets "noindex" automatically
// from RouteSeo.jsx, so it stays out of Google.
//
// Add a page here ONLY when the page really exists on the site.
// (/faq, /terms, /blog and /careers will be added when their pages are built.)

export const SITE = 'https://peaknizerlogistics.com';
export const SITE_NAME = 'Peaknizer Logistics';
export const DEFAULT_IMAGE = `${SITE}/images/warehouse-wide.jpg`;

export const SEO_PAGES = {
  '/': {
    title: 'US 3PL Warehouse & Prep Services | Peaknizer Logistics',
    description:
      'Peaknizer Logistics is a US 3PL for product prep, warehousing and order fulfillment, serving Amazon, Walmart, eBay and Shopify sellers nationwide.',
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
  '/privacy': {
    title: 'Privacy Policy | Peaknizer Logistics',
    description:
      'How Peaknizer Logistics collects, uses and protects the information you share with us on this website.',
  },
};