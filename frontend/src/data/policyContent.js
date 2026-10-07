// Single source of truth for the Terms of Service text.
// Used by both the Policy page and the registration form on the Login page.

export const POLICY_SECTIONS = [
  {
    num: 1,
    title: 'Introduction',
    body: "These Terms of Service govern the use of Peaknizer Logistics' warehousing, inventory management, and order fulfillment services. By using our services, you agree to comply with all terms outlined below."
  },
  {
    num: 2,
    title: 'Services Overview',
    body: 'We provide third-party logistics (3PL) services including storage, order fulfillment, shipping, and returns handling for eCommerce businesses operating on platforms such as Amazon, Walmart, and Shopify.'
  },
  {
    num: 3,
    title: 'Client Responsibilities',
    list: [
      'Provide accurate product, SKU, and shipping information',
      'Ensure all products comply with U.S. laws and marketplace regulations',
      'Maintain valid business and contact information',
      'Ensure all inventory sent is properly labeled and documented'
    ]
  },
  {
    num: 4,
    title: 'Inventory Receiving',
    body: 'All inbound shipments must include proper labeling, packing lists, and prior notification. We are not responsible for supplier errors, including incorrect or missing items.'
  },
  {
    num: 5,
    title: 'Order Fulfillment',
    body: 'Orders are processed based on our daily cutoff times. Once processed, orders cannot be modified or canceled.'
  },
  {
    num: 6,
    title: 'Storage & Fees',
    body: 'Storage, fulfillment, and additional services are billed according to our pricing structure. Late payments may result in service suspension or account termination.'
  },
  {
    num: 7,
    title: 'Returns Handling',
    body: 'Returned items may be inspected, restocked, or disposed of based on their condition. Additional fees may apply for return processing.'
  },
  {
    num: 8,
    title: 'Shipping & Carriers',
    body: 'Once shipments are handed over to carriers, we are not responsible for delays, damages, or lost packages.'
  },
  {
    num: 9,
    title: 'Liability Limitation',
    body: 'Our liability is limited to the declared value of goods or a predefined cap per incident. We are not liable for indirect losses such as lost sales, account suspensions, or marketplace penalties.'
  },
  {
    num: 10,
    title: 'Distributor Shipments',
    body: 'Clients sourcing from distributors are responsible for ensuring shipment accuracy. We are not liable for supplier mistakes, shortages, or damages.'
  },
  {
    num: 11,
    title: 'Multi-Warehouse Operations',
    body: 'Inventory may be stored and fulfilled from any of our warehouse locations for operational efficiency. Transfers between warehouses may incur additional charges.'
  },
  {
    num: 12,
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
    num: 13,
    title: 'Prohibited Products',
    body: 'Clients are strictly prohibited from storing or shipping illegal, hazardous, or restricted items, including counterfeit goods or products that violate marketplace policies.'
  },
  {
    num: 14,
    title: 'Account Suspension & Termination',
    body: 'We reserve the right to suspend or terminate accounts due to non-payment, policy violations, or suspicious activity. Clients must arrange inventory removal upon termination.'
  },
  {
    num: 15,
    title: 'Policy Updates',
    body: 'We may update these Terms at any time. Continued use of our services constitutes acceptance of the updated terms.'
  },
  {
    num: 16,
    title: 'Contact Information',
    body: 'For any questions regarding these Terms, please contact us:',
    contact: [
      { icon: 'email', value: 'contact@peaknizerlogistics.com' },
      { icon: 'phone', value: '+1 (571) 518-2791' },
      { icon: 'location', value: 'Arlington, VA & Houston, TX' }
    ]
  }
];