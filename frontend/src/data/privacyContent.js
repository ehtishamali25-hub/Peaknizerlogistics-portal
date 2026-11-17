// Single source of truth for the Privacy Policy text (/privacy).
// Same structure as policyContent.js (the Terms of Service), so the same page layout shows both.
// Have a lawyer review any change before relying on it.
// Update this policy if the website starts using an analytics or tracking tool.

// Change this date whenever the policy below changes
export const PRIVACY_LAST_UPDATED = 'November 18, 2026';

export const PRIVACY_SECTIONS = [
  {
    num: 1,
    title: 'Introduction',
    body: 'This Privacy Policy explains how Peaknizer Logistics collects, uses, and protects personal information when you visit peaknizerlogistics.com, contact us, or use our customer portal and 3PL services.'
  },
  {
    num: 2,
    title: 'Information We Collect',
    list: [
      'Contact and quote requests: your name, email address, phone number, company name, the marketplaces you sell on, and anything you write in your message.',
      'Customer accounts: your name, business and contact details, the password you choose (stored only in encrypted form), and any documents you upload when you register.',
      'Service records: your inventory, shipments, invoices, the payment receipts you upload, and the order lists and shipping labels you upload for dropshipping.',
      'Technical information: like most websites, our hosting provider automatically records basic technical data such as IP address, browser type, and the pages requested, to keep the site running and secure.'
    ]
  },
  {
    num: 3,
    title: 'Information About Your Customers',
    body: "When you use our fulfillment or dropshipping services, the order lists and shipping labels you provide contain your customers' names and shipping addresses. We use this information only to pack and ship those orders for you. You are responsible for having the right to share it with us."
  },
  {
    num: 4,
    title: 'How We Use Information',
    list: [
      'To answer your questions and send you quotes',
      'To review registrations and create and manage customer accounts',
      'To receive, prep, store, and ship your inventory and orders',
      'To send invoices and account and service emails',
      'To keep our website and portal secure, prevent fraud, and meet legal requirements'
    ]
  },
  {
    num: 5,
    title: 'Cookies & Tracking',
    body: 'Our website does not use advertising or analytics cookies. When you log in to the customer portal, your browser stores a login token so you stay signed in. If we start using an analytics tool in the future, we will update this policy first.'
  },
  {
    num: 6,
    title: 'How We Share Information',
    body: 'We do not sell or rent your personal information. We share it only with:',
    list: [
      'Render, which hosts our website, customer portal, database, and uploaded files',
      'Our email provider, which delivers the emails sent from our website and portal',
      'Shipping carriers, which receive the delivery details needed to deliver orders',
      "WhatsApp, if you choose to message us there (WhatsApp's own privacy policy also applies)",
      'Authorities, when the law requires it or to protect our rights, as described in our Terms of Service'
    ]
  },
  {
    num: 7,
    title: 'How Long We Keep Information',
    body: 'We keep account and service records while your account is active, and afterwards for as long as needed for accounting, tax, and legal purposes. Messages from our contact and quote forms are kept as long as needed to respond and follow up. When a customer account is deleted, its login, registration documents, and uploaded dropshipping files are removed.'
  },
  {
    num: 8,
    title: 'How We Protect Information',
    body: 'Our website and portal use encrypted (HTTPS) connections, passwords are stored only in encrypted form, and portal access is limited by role, so each customer sees only their own information. No method of storage or transmission is completely secure, but we work to protect your information.'
  },
  {
    num: 9,
    title: 'Your Choices & Rights',
    body: 'You can ask us to see, correct, or delete the personal information we hold about you by emailing info@peaknizerlogistics.com. Some records, such as invoices, may need to be kept for legal or accounting reasons.'
  },
  {
    num: 10,
    title: "Children's Privacy",
    body: 'Our services are for businesses and are not directed to children under 16. We do not knowingly collect personal information from children.'
  },
  {
    num: 11,
    title: 'Changes to This Policy',
    body: 'We may update this Privacy Policy. The date at the top of this page shows when it last changed.'
  },
  {
    num: 12,
    title: 'Contact Information',
    body: 'For any questions about this Privacy Policy or your information, please contact us:',
    contact: [
      { icon: 'email', value: 'info@peaknizerlogistics.com' },
      { icon: 'phone', value: '+1 (571) 307-4461' },
      { icon: 'location', value: 'Arlington, VA (head office) · Houston, TX · New Jersey' }
    ]
  }
];