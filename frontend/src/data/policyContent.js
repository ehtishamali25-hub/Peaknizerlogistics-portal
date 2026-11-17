// Single source of truth for the Terms of Service text.
// Used by both the Policy page and the registration form on the Login page.
// Have a lawyer review any change before relying on it.

// Change this date whenever the terms below change
export const POLICY_LAST_UPDATED = 'November 18, 2026';

export const POLICY_SECTIONS = [
  {
    num: 1,
    title: 'Introduction',
    body: 'These Terms of Service govern the use of the Peaknizer Logistics website and our warehousing, prep, inventory management and order fulfillment services. By creating an account or using our services, you (the client) agree to these terms.'
  },
  {
    num: 2,
    title: 'Services Overview',
    body: 'We provide third-party logistics (3PL) services, including receiving, Amazon FBA and Walmart WFS prep, storage, order fulfillment, dropshipping fulfillment, kitting and bundling, and returns handling for ecommerce businesses selling on Amazon, Walmart, Shopify, eBay, TikTok Shop and other platforms.'
  },
  {
    num: 3,
    title: 'Client Responsibilities',
    list: [
      'Provide accurate product, SKU, and shipping information',
      'Ensure all products comply with U.S. laws and marketplace regulations',
      'Maintain valid business and contact information',
      'Ensure all inventory sent is properly labeled and documented',
      'Pay all invoices by the due date shown on each invoice'
    ]
  },
  {
    num: 4,
    title: 'Inventory Receiving',
    body: 'All inbound shipments must include proper labeling, packing lists, and prior notification. We check in and verify each shipment against its packing list. We are not responsible for supplier errors, including incorrect or missing items.'
  },
  {
    num: 5,
    title: 'Reporting Problems',
    body: 'Please report any missing, damaged, or incorrect item within 7 days from the date we received it or shipped it. Reports made after 7 days may not be accepted.'
  },
  {
    num: 6,
    title: 'Order Fulfillment',
    body: 'Orders received by 2 PM, our daily cutoff time, ship the same day. Once processed, orders cannot be modified or canceled.'
  },
  {
    num: 7,
    title: 'Fees & Payment',
    body: 'Storage, prep, fulfillment, and additional services are billed according to our current pricing. Invoices are available in your customer portal and are due by the due date shown on each invoice. If a payment is overdue, we will contact you and may agree on additional time. If the balance remains unpaid, we may pause services and hold your inventory until it is paid in full.'
  },
  {
    num: 8,
    title: 'Returns Handling',
    body: 'Returned items may be inspected, restocked, or disposed of based on their condition. Additional fees may apply for return processing.'
  },
  {
    num: 9,
    title: 'Shipping & Carriers',
    body: 'Once shipments are handed over to carriers, we are not responsible for delays, damages, or lost packages.'
  },
  {
    num: 10,
    title: 'Lost or Damaged Inventory',
    body: 'We are responsible for loss of or damage to your inventory that happens while it is in our care, after we have received and verified it. To make a claim, you must provide the purchase invoice for the affected items. Compensation is based on that invoice and agreed with you. We are not liable for indirect losses such as lost sales, account suspensions, or marketplace penalties.'
  },
  {
    num: 11,
    title: 'Distributor Shipments',
    body: 'Clients sourcing from distributors are responsible for ensuring shipment accuracy. We are not liable for supplier mistakes, shortages, or damages.'
  },
  {
    num: 12,
    title: 'Multi-Warehouse Operations',
    body: 'Inventory may be stored and fulfilled from any of our warehouse locations for operational efficiency. Transfers between warehouses may incur additional charges.'
  },
  {
    num: 13,
    title: 'Strict Compliance & Illegal Activities',
    highlight: true,
    body: 'Peaknizer Logistics maintains a zero-tolerance policy for illegal or fraudulent activities.',
    list: [
      'If any client uses our warehouse address for illegal activities, we reserve the full right to immediately hold all associated inventory and report the matter to relevant law enforcement authorities.',
      'If a client provides fake, misleading, or unauthorized shipping labels, we reserve the right to hold all inventory and suspend services without notice.',
      'If counterfeit products are identified, or if a client fails to provide valid invoices or proof of product authenticity, we reserve the right to hold inventory and initiate legal action.',
      'Any violation of these terms may result in immediate account termination and legal reporting.'
    ]
  },
  {
    num: 14,
    title: 'Prohibited Products',
    body: 'Clients may not store or ship illegal, hazardous, or restricted items through our warehouses, including:',
    list: [
      'Hazardous materials',
      'Illegal or counterfeit goods',
      'Weapons and ammunition',
      'Perishable or refrigerated food',
      'Live animals',
      'Products that violate marketplace policies'
    ]
  },
  {
    num: 15,
    title: 'Ending Service, Suspension & Termination',
    body: 'Clients who want to end our services must notify us at least 30 days in advance. We reserve the right to suspend or terminate accounts due to non-payment, policy violations, or suspicious activity. Clients must arrange inventory removal when the service ends.'
  },
  {
    num: 16,
    title: 'Governing Law',
    body: 'These Terms are governed by the laws of the Commonwealth of Virginia, United States.'
  },
  {
    num: 17,
    title: 'Policy Updates',
    body: 'We may update these Terms at any time. The date at the top of this page shows when they last changed. Continued use of our services constitutes acceptance of the updated terms.'
  },
  {
    num: 18,
    title: 'Contact Information',
    body: 'For any questions regarding these Terms, please contact us:',
    contact: [
      { icon: 'email', value: 'info@peaknizerlogistics.com' },
      { icon: 'phone', value: '+1 (571) 307-4461' },
      { icon: 'location', value: 'Arlington, VA (head office) · Houston, TX · New Jersey' }
    ]
  }
];