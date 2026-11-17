// src/data/faqContent.js
// The questions and answers on the FAQ page (/faq).
// The same text is also sent to Google and AI assistants as FAQ structured data,
// so the page and the structured data always match.
//
// Each answer starts with a one-sentence direct answer, then the details.
// Keep prices and facts the same as on the Pricing, Services and Contact pages.
// "link" (optional) adds a link under the answer to another page of the site.

export const FAQ_INTRO =
  'Answers to the questions small and growing brands ask us most about our 3PL warehouse, prep and fulfillment services in the USA.';

export const FAQS = [
  {
    question: 'What is a 3PL, and does my store need one?',
    answer: [
      'A 3PL (third-party logistics provider) is a company that stores your inventory, preps it and ships your orders for you.',
      'Most online sellers start by packing orders at home. A 3PL starts to make sense when packing takes more time than growing the business, when your stock no longer fits where you keep it, when you need Amazon FBA or Walmart WFS prep done to the rules, or when you sell on more than one marketplace and want one stock pool for all of them.',
    ],
  },
  {
    question: 'Where is Peaknizer Logistics located, and do you serve my state?',
    answer: [
      'Our head office is in Arlington, Virginia, with warehouses in Houston, Texas and New Jersey, and we work with sellers in every US state.',
      'You send your inventory to our warehouse, and we prep it, store it and ship your orders to customers anywhere in the USA. You manage everything online through your customer portal, so you do not need to be near the warehouse.',
    ],
  },
  {
    question: 'Which marketplaces do you prep and ship for?',
    answer: [
      'We work with sellers on Amazon, Walmart, Shopify, eBay, TikTok Shop, Etsy and WooCommerce.',
      'For Amazon FBA and Walmart WFS we prep and label your inventory to marketplace requirements and send it to their fulfillment centers. For Shopify, eBay, TikTok Shop, Etsy, WooCommerce and seller-fulfilled Amazon (FBM) orders, we pick, pack and ship each order to your customer. Selling on several channels? We fulfill all of them from one stock pool.',
    ],
    link: { to: '/services', label: 'See all our 3PL services' },
  },
  {
    question: 'Which prep services do you offer?',
    answer: [
      'We offer inspection, FNSKU labeling, poly-bagging, bubble wrap, bundling and box changes, all done to current Amazon requirements.',
      'Add-on services include sticker and tag removal, expiry date labels, promo inserts, liquid induction seals and product photos. For bundling we make multi-packs of the same product and variety packs of different products, for standard and oversized items. Every shipment is checked against your packing list when it arrives.',
    ],
    link: { to: '/pricing', label: 'See prices for every prep service' },
  },
  {
    question: 'How much do your services cost, and is there a minimum volume?',
    answer: [
      'There is no minimum volume: FBA prep starts at $0.60 per unit and FBM order fulfillment starts at $3.00 per order.',
      'FBA prep is $0.55 per unit for 100 to 500 units. FBM fulfillment drops to $2.50 per order at 1,000+ orders a month and $2.00 at 10,000+. Bundling starts at $1.00, and pallet storage is $30 per pallet per month, with no storage fees for the first 30 days. There are no long-term contracts and no hidden charges.',
    ],
    link: { to: '/pricing', label: 'See our full 3PL price list' },
  },
  {
    question: 'How fast do you receive inventory and ship orders?',
    answer: [
      'We check in your inventory on the day it arrives, and orders received by 2 PM ship the same day.',
      'When a shipment reaches our warehouse, we count it and inspect it against your packing list the same day, so the stock is available to sell quickly. Orders are picked, packed and quality-checked before they leave, and we send them with the most cost-effective carrier.',
    ],
  },
  {
    question: 'How does onboarding work, and how do I send my first shipment?',
    answer: [
      'Register for an account through our Client portal, we review and approve it, and then you send your inventory to our warehouse in Arlington, Virginia.',
      'Once your account is approved, you receive an email with your customer code and login details. Send us your packing list with your first shipment. We check the stock in the day it arrives, and you can follow it in your portal from that point on.',
    ],
    link: { to: '/login', label: 'Open the Client portal' },
  },
  {
    question: 'Can I track my inventory and invoices online?',
    answer: [
      'Yes. Every customer gets their own login to our customer portal.',
      'In the portal you can see received, shipped and remaining units for every product, follow every inbound shipment, download your prep and shipping invoices as PDF files with their paid or unpaid status, upload payment receipts against an invoice, and download shipping detail sheets at any time.',
    ],
  },
  {
    question: 'Do you support dropshipping orders?',
    answer: [
      'Yes. We offer dropshipping fulfillment, managed through your customer portal.',
      'You send your inventory to our warehouse, then upload your order list and shipping labels in the portal. We pack and ship each order with your labels and update the status in the portal, so you can see which orders have shipped and when your inventory has arrived.',
    ],
  },
  {
    question: 'How do I get a quote?',
    answer: [
      'Fill in the quote form on our homepage or contact page, and we reply with pricing within one business day.',
      'You can also email info@peaknizerlogistics.com, or call or message us on WhatsApp at +1 (571) 307-4461. Tell us what you sell, which marketplaces you sell on, your rough monthly order volume and any special requirements, and we will put together a plan and price for you.',
    ],
    link: { to: '/contact', label: 'Contact us for a quote' },
  },
];

// Plain text of an answer (used for the structured data)
export const answerText = (faq) => faq.answer.join(' ');