import { useState } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';

const faqs = [
  { q: 'How quickly do you respond to inquiries?', a: 'We typically respond to all inquiries within 2-4 hours during business hours. For urgent matters, contact us via WhatsApp for instant messaging.' },
  { q: 'Do you offer custom quotes for high-volume shippers?', a: 'Yes. We provide custom pricing for businesses shipping 10,000+ orders per month. Contact us with your volume and requirements for a tailored quote.' },
  { q: 'Can I visit the warehouse before signing up?', a: 'Yes. We welcome potential clients to schedule a tour of our Arlington facility. Contact us to arrange a visit.' },
  { q: 'What information should I include in my inquiry?', a: "Include your estimated monthly order volume, product types, any special handling requirements, and which services you're interested in." }
];

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', service: 'General Inquiry', message: '' });
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
        setSubmitStatus({ type: 'success', message: 'Thank you! Your message has been sent. We will contact you shortly.' });
        setFormData({ name: '', email: '', phone: '', company: '', service: 'General Inquiry', message: '' });
        setTimeout(() => setSubmitStatus({ type: '', message: '' }), 5000);
      } else {
        setSubmitStatus({ type: 'error', message: data.detail || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WebsiteLayout>
      <div className="bg-white text-slate-700">

        <section className="bg-brand-navy">
          <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
            <span className="text-sm font-semibold text-emerald-300">Get in touch</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mt-3 mb-5">Let's talk fulfillment</h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Ready to move receiving, storage, prep, and shipping off your plate? Our team is here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://wa.me/15713074461" target="_blank" rel="noopener noreferrer" className="bg-brand-emerald hover:bg-emerald-400 text-brand-navy font-semibold px-6 py-3 rounded-md transition-colors">
                Message us on WhatsApp
              </a>
              <Link to="/services" className="border border-white/25 hover:border-white/50 text-white font-semibold px-6 py-3 rounded-md transition-colors">
                Explore services
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-4">
          <img src="/images/contact/warehouse-1.jpg" alt="Warehouse interior" className="w-full h-32 sm:h-44 object-cover" />
          <img src="/images/contact/warehouse-2.jpg" alt="Team member at work" className="w-full h-32 sm:h-44 object-cover" />
          <img src="/images/contact/warehouse-3.jpg" alt="Packed shipments" className="w-full h-32 sm:h-44 object-cover" />
          <img src="/images/contact/warehouse-4.jpg" alt="Front of warehouse facility" className="w-full h-32 sm:h-44 object-cover" />
        </section>

        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-7xl mx-auto">

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy mb-6">Reach out</h2>
                <div className="space-y-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <h3 className="text-base font-bold text-brand-navy mb-1">Email us</h3>
                    <a href="mailto:info@peaknizerlogistics.com" className="text-emerald-600 hover:underline break-all">info@peaknizerlogistics.com</a>
                    <p className="text-slate-500 text-sm mt-1">Response within 2-4 hours</p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <h3 className="text-base font-bold text-brand-navy mb-1">WhatsApp</h3>
                    <a href="https://wa.me/15713074461" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">+1 (571) 307-4461</a>
                    <p className="text-slate-500 text-sm mt-1">Instant messaging, 24/7</p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <h3 className="text-base font-bold text-brand-navy mb-1">Phone</h3>
                    <a href="tel:+15715182791" className="text-emerald-600 hover:underline">+1 (571) 518-2791</a>
                    <p className="text-slate-500 text-sm mt-1">Mon–Fri, 9AM–6PM EST</p>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-5">
                    <h3 className="text-base font-bold text-brand-navy mb-1">Warehouse location</h3>
                    <p className="text-slate-700">Arlington, VA<br />United States</p>
                  </div>

                  <div className="bg-brand-navy/[0.03] border border-slate-200 rounded-xl p-5">
                    <h3 className="text-base font-bold text-brand-navy mb-3">Business hours</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Monday – Friday</span>
                        <span className="text-brand-navy font-medium">9:00 AM – 6:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Saturday</span>
                        <span className="text-brand-navy font-medium">10:00 AM – 2:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Sunday</span>
                        <span className="text-slate-400">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-brand-navy mb-6">Send a message</h2>

                  {submitStatus.message && (
                    <div className={`mb-4 p-3 rounded-md text-sm ${submitStatus.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                      {submitStatus.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition" placeholder="Full name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition" placeholder="Business email" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone number *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition" placeholder="Phone number" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company name</label>
                        <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition" placeholder="Company name" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Service interested in</label>
                      <select name="service" value={formData.service} onChange={handleInputChange} className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition">
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
                      <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                      <textarea name="message" value={formData.message} onChange={handleInputChange} required rows="4" className="w-full border border-slate-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition resize-none" placeholder="Tell us about your fulfillment needs, volume, and any specific requirements" />
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-brand-navy hover:bg-brand-navy-light text-white font-semibold py-3 rounded-md transition-colors disabled:opacity-60">
                      {isSubmitting ? 'Sending...' : 'Send message'}
                    </button>

                    <p className="text-xs text-slate-400 text-center">By submitting this form, you agree to our privacy policy and consent to being contacted.</p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative">
          <img src="/images/contact/warehouse-exterior.jpg" alt="Peaknizer Logistics warehouse exterior" className="w-full h-64 sm:h-96 object-cover" />
          <div className="absolute inset-0 bg-brand-navy/50"></div>
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 bg-white rounded-xl shadow-xl px-6 py-5 max-w-xs">
            <div className="text-lg font-bold text-brand-navy">Arlington, VA</div>
            <div className="text-slate-500 text-sm mt-1">Serving the East Coast and beyond</div>
            <a href="https://maps.google.com/?q=2503D+N+Harrison+St+Arlington+VA+22207" target="_blank" rel="noopener noreferrer" className="inline-block text-emerald-600 hover:underline font-medium text-sm mt-2">
              Open in Google Maps
            </a>
          </div>
        </section>

        <section className="bg-brand-navy/[0.03] py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <span className="text-sm font-semibold text-emerald-600">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2">Common questions</h2>
            </div>
            <div className="max-w-3xl space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="bg-white border border-slate-200 rounded-xl p-5">
                  <h3 className="text-base font-bold text-brand-navy mb-2">{faq.q}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-navy py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to scale?</h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8">Join the brands who trust Peaknizer with their fulfillment. Get your free quote today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing" className="bg-brand-emerald hover:bg-emerald-400 text-brand-navy font-semibold px-6 py-3 rounded-md transition-colors">
                View pricing
              </Link>
              <a href="https://wa.me/15713074461" target="_blank" rel="noopener noreferrer" className="border border-white/25 hover:border-white/50 text-white font-semibold px-6 py-3 rounded-md transition-colors">
                WhatsApp us
              </a>
            </div>
          </div>
        </section>

      </div>
    </WebsiteLayout>
  );
};

export default ContactPage;