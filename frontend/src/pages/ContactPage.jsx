import WebsiteLayout from './WebsiteLayout';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: 'General Inquiry',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      // Send to your backend email endpoint
      const response = await fetch('http://localhost:8000/api/v1/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. We will contact you shortly.'
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: 'General Inquiry',
          message: ''
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.detail || 'Failed to send message. Please try again.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
      // Auto-hide success message after 5 seconds
      if (submitStatus.type === 'success') {
        setTimeout(() => setSubmitStatus({ type: '', message: '' }), 5000);
      }
    }
  };

  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contact <span className="text-orange-500">Peaknizer Logistics</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have questions about our 3PL services? Need a custom quote? Our team is here to help you scale your business.
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Column - Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Get in <span className="text-orange-500">Touch</span>
                </h2>
                <p className="text-gray-400">
                  Whether you're a small startup or an established brand, we're ready to discuss your fulfillment needs.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Email */}
                <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/30 hover:border-orange-500 transition group">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl text-orange-500 group-hover:scale-110 transition">📧</div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Email Us</h3>
                      <a 
                        href="mailto:info@peaknizerlogistics.com" 
                        className="text-orange-400 hover:text-orange-300 text-lg break-all"
                      >
                        info@peaknizerlogistics.com
                      </a>
                      <p className="text-gray-500 text-sm mt-1">We typically respond within 2-4 hours</p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/30 hover:border-orange-500 transition group">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl text-orange-500 group-hover:scale-110 transition">💬</div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">WhatsApp</h3>
                      <a 
                        href="https://wa.me/15713074461" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:text-orange-300 text-lg"
                      >
                        +1 (571) 307-4461
                      </a>
                      <p className="text-gray-500 text-sm mt-1">Instant messaging, 24/7</p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/30 hover:border-orange-500 transition group">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl text-orange-500 group-hover:scale-110 transition">📞</div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Phone</h3>
                      <a 
                        href="tel:+15713074461" 
                        className="text-orange-400 hover:text-orange-300 text-lg"
                      >
                        +1 (571) 307-4461
                      </a>
                      <p className="text-gray-500 text-sm mt-1">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>
                </div>

                {/* Office Location */}
                <div className="bg-gray-900 p-6 rounded-lg border border-orange-500/30">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl text-orange-500">📍</div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Warehouse Location</h3>
                      <p className="text-gray-300">
                        2503D N Harrison St,<br />
                        Arlington, VA 22207<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gray-900/50 p-6 rounded-lg border border-orange-500/20">
                <h3 className="text-white font-semibold mb-3">Business Hours</h3>
                <div className="space-y-2 text-gray-400">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="text-orange-400">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="text-orange-400">10:00 AM - 2:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="text-gray-500">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-gray-900 p-8 rounded-lg border-2 border-orange-500">
              <h2 className="text-2xl font-bold text-white mb-6">
                Send Us a <span className="text-orange-500">Message</span>
              </h2>

              {submitStatus.message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500 text-green-400' 
                    : 'bg-red-500/20 border border-red-500 text-red-400'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      placeholder="+1 (571) 307-4461"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Service Interested In</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option>General Inquiry</option>
                    <option>FBA Prep Services</option>
                    <option>FBM Fulfillment</option>
                    <option>Warehousing</option>
                    <option>Shipping & Delivery</option>
                    <option>Bundling Services</option>
                    <option>Quote Request</option>
                    <option>Partnership Opportunity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Tell us about your fulfillment needs, volume, and any specific requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 text-black py-4 rounded-lg font-bold text-lg hover:bg-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message →'}
                </button>

                <p className="text-gray-500 text-xs text-center mt-2">
                  By submitting this form, you agree to our privacy policy and consent to being contacted.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Visit Our <span className="text-orange-500">Warehouse</span>
          </h2>
          <div className="max-w-4xl mx-auto bg-gray-900 p-2 rounded-lg border border-orange-500/30">
            <div className="aspect-video w-full bg-gray-800 rounded-lg flex items-center justify-center">
              {/* Placeholder for actual map - you can embed Google Maps here */}
              <div className="text-center">
                <div className="text-6xl text-orange-500 mb-4">📍</div>
                <p className="text-gray-300">2503D N Harrison St, Arlington, VA 22207</p>
                <a 
                  href="https://maps.google.com/?q=2503D+N+Harrison+St+Arlington+VA+22207" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 mt-2 inline-block"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Frequently Asked <span className="text-orange-500">Questions</span>
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "How quickly do you respond to inquiries?",
                a: "We typically respond to all inquiries within 2-4 hours during business hours. For urgent matters, we recommend contacting us via WhatsApp for instant messaging."
              },
              {
                q: "Do you offer custom quotes for high-volume shippers?",
                a: "Yes! We provide custom pricing for businesses shipping 10,000+ orders per month. Contact us with your volume and requirements for a tailored quote."
              },
              {
                q: "Can I visit the warehouse before signing up?",
                a: "Absolutely! We welcome potential clients to schedule a tour of our Arlington facility. Please contact us to arrange a visit."
              },
              {
                q: "What information should I include in my inquiry?",
                a: "To help us serve you better, please include your estimated monthly order volume, product types, any special handling requirements, and which services you're interested in."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg border border-orange-500/20">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Streamline Your Fulfillment?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who trust us with their logistics. Get your free quote today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pricing"
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              View Pricing
            </Link>
            <a
              href="https://wa.me/15713074461"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              WhatsApp Us →
            </a>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default ContactPage;