// ContactPage.jsx – TOTALLY NEW DESIGN (light theme, blue accent, no 3D)
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
      const response = await fetch('http://localhost:8000/api/v1/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      if (submitStatus.type === 'success') {
        setTimeout(() => setSubmitStatus({ type: '', message: '' }), 5000);
      }
    }
  };

  useEffect(() => {
    // Animate contact cards
    ScrollTrigger.create({
      trigger: '.contact-cards',
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.contact-card', {
          x: -20,
          opacity: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });

    // Animate form
    ScrollTrigger.create({
      trigger: '.contact-form',
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.contact-form', {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    });

    // Animate FAQ
    ScrollTrigger.create({
      trigger: '.faq-section',
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.faq-item', {
          y: 15,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });

    // Animate CTA
    ScrollTrigger.create({
      trigger: '.cta-section',
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.cta-content', {
          scale: 0.98,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    });
  }, []);

  return (
    <WebsiteLayout>
      <div className="bg-gray-50 min-h-screen text-gray-800">

        {/* ===== HERO ===== */}
        <section className="py-20 md:py-28 bg-white border-b border-gray-100 text-center">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="space-y-6">
              <div className="inline-block bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
                <span className="text-blue-600 text-sm font-medium">GET IN TOUCH</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
                Let's <span className="text-blue-600">Connect</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Ready to scale your business? Our team is here to provide the logistics solutions you need.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/15713074461"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  WHATSAPP US
                </a>
                <Link
                  to="/services"
                  className="border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all"
                >
                  EXPLORE SERVICES
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CONTACT INFO + FORM ===== */}
        <section className="py-16 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
              {/* Left – Contact Cards */}
              <div className="contact-cards space-y-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Reach Out</h2>
                <div className="space-y-4">
                  {/* Email */}
                  <div className="contact-card bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
                    <div className="text-3xl text-blue-500">📧</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
                      <a href="mailto:info@peaknizerlogistics.com" className="text-blue-600 hover:underline text-base break-all">
                        info@peaknizerlogistics.com
                      </a>
                      <p className="text-gray-500 text-sm mt-1">Response within 2-4 hours</p>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="contact-card bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:border-green-400 transition-colors shadow-sm hover:shadow-md">
                    <div className="text-3xl text-green-500">💬</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">WhatsApp</h3>
                      <a href="https://wa.me/15713074461" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-base">
                        +1 (571) 307-4461
                      </a>
                      <p className="text-gray-500 text-sm mt-1">Instant messaging, 24/7</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="contact-card bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
                    <div className="text-3xl text-blue-500">📞</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                      <a href="tel:+15713074461" className="text-blue-600 hover:underline text-base">
                        +1 (571) 307-4461
                      </a>
                      <p className="text-gray-500 text-sm mt-1">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="contact-card bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:border-purple-400 transition-colors shadow-sm hover:shadow-md">
                    <div className="text-3xl text-purple-500">📍</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Warehouse Location</h3>
                      <p className="text-gray-700 text-base">
                        2503D N Harrison St,<br />
                        Arlington, VA 22207<br />
                        United States
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Hours</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monday - Friday:</span>
                        <span className="text-blue-600 font-medium">9:00 AM - 6:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saturday:</span>
                        <span className="text-blue-600 font-medium">10:00 AM - 2:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sunday:</span>
                        <span className="text-gray-400">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right – Form */}
              <div className="contact-form">
                <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>

                  {submitStatus.message && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-700' 
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                      {submitStatus.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition"
                          placeholder="+1 (571) 307-4461"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Interested In</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition resize-none"
                        placeholder="Tell us about your fulfillment needs, volume, and any specific requirements..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-60"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message →'}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      By submitting this form, you agree to our privacy policy and consent to being contacted.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== LOCATION (Static map placeholder instead of 3D Globe) ===== */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Our Location</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Strategically located in Arlington, VA to serve East Coast and beyond</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="aspect-video w-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg border border-gray-300">
                  📍 2503D N Harrison St, Arlington, VA 22207
                  {/* You can embed a Google Maps iframe here if desired */}
                </div>
                <div className="text-center mt-4">
                  <a
                    href="https://maps.google.com/?q=2503D+N+Harrison+St+Arlington+VA+22207"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 hover:underline font-medium"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="faq-section py-16 bg-gray-50 border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to know about working with us</p>
            </div>
            <div className="max-w-4xl mx-auto space-y-4">
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
                <div key={index} className="faq-item bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="cta-section py-20 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto px-4 text-center">
            <div className="cta-content">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to <span className="text-yellow-300">Scale?</span>
              </h2>
              <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of brands who trust Peaknizer with their fulfillment. Get your free quote today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/pricing"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  VIEW PRICING
                </Link>
                <a
                  href="https://wa.me/15713074461"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold text-lg border border-white/30 hover:bg-white/30 transition-all"
                >
                  WHATSAPP US →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </WebsiteLayout>
  );
};

export default ContactPage;