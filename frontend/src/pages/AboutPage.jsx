import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import { gsap } from 'gsap';

const values = [
  { title: 'Straight talk on pricing', desc: 'No hidden fees, no surprise charges after the invoice lands. What we quote is what you pay.' },
  { title: 'Built for scale', desc: 'Our systems are designed to absorb volume spikes without missing a delivery window.' },
  { title: 'A real point of contact', desc: 'Every account has someone who knows it — not a rotating support queue.' },
  { title: 'Compliance first', desc: 'Every unit that ships is handled to current marketplace and carrier requirements.' },
  { title: 'Visibility, always', desc: 'Our client portal gives you live access to inventory, invoices, and shipments — no waiting on an email.' },
  { title: 'Month-to-month', desc: 'We earn renewal through performance, not a long-term contract.' }
];

const team = [
  { role: 'Founder & CEO', desc: 'Sets the direction for the company and owns the relationship with every major account.', initials: 'CEO' },
  { role: 'Head of Engineering', desc: 'Builds and maintains the client portal and internal systems that keep operations running.', initials: 'ENG' },
  { role: 'Operations Lead', desc: 'Runs day-to-day warehouse operations and keeps accuracy and turnaround on target.', initials: 'OPS' },
  { role: 'Client Success Lead', desc: 'The point of contact for onboarding and ongoing account support.', initials: 'CS' }
];

const facilities = [
  { location: 'Arlington, VA', features: ['East Coast coverage', 'Dock access', 'Climate-appropriate storage'] },
  { location: 'Houston, TX', features: ['Gulf Coast coverage', 'Dock access', 'Port proximity'] }
];

const AboutPage = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  return (
    <WebsiteLayout>
      <div className="bg-white text-slate-700">

        {/* Hero */}
        <section className="bg-brand-navy">
          <div ref={heroRef} className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
            <span className="text-sm font-semibold text-emerald-300">About us</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white mt-3 mb-5">
              Peaknizer Logistics
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              A fulfillment partner for e-commerce brands, built around straightforward pricing, real accountability, and a portal that keeps you informed at every step.
            </p>
          </div>
        </section>

        {/* Story + photo */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <span className="text-sm font-semibold text-emerald-600">Our story</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2 mb-5">
                  Fulfillment that started with a simple frustration
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We started Peaknizer Logistics because too many growing sellers were stuck stitching together separate vendors for receiving, storage, prep, and shipping — and paying for the gaps between them.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Running fulfillment under one roof, with one team accountable for the whole process, means fewer handoffs, fewer mistakes, and a lot less time spent chasing status updates.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden">
                <img
                  src="/images/about/warehouse-exterior.jpg"
                  alt="Exterior of a Peaknizer Logistics warehouse"
                  className="w-full h-72 sm:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-brand-navy/[0.03] py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <span className="text-sm font-semibold text-emerald-600">What we stand for</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2">
                The principles behind how we run
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-brand-navy mb-2">{v.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team photo banner */}
        <section className="relative">
          <img
            src="/images/about/team-floor.jpg"
            alt="Team working on the warehouse floor"
            className="w-full h-64 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-brand-navy/50 flex items-center">
            <div className="container mx-auto px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white max-w-md">
                A team that treats your inventory like it's their own
              </h2>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <span className="text-sm font-semibold text-emerald-600">Leadership</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2">
                The people running day-to-day operations
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((leader) => (
                <div key={leader.role} className="bg-white border border-slate-200 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-full flex items-center justify-center text-brand-navy font-bold text-sm mb-4">
                    {leader.initials}
                  </div>
                  <h3 className="text-base font-bold text-brand-navy mb-2">{leader.role}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{leader.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prep station photo */}
        <section className="bg-brand-navy/[0.03] py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="rounded-xl overflow-hidden order-2 lg:order-1">
                <img
                  src="/images/about/prep-station.jpg"
                  alt="Prep station with labeling equipment"
                  className="w-full h-72 sm:h-96 object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <span className="text-sm font-semibold text-emerald-600">How we operate</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2 mb-5">
                  Process over improvisation
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Every unit that comes through our doors follows the same checklist: received, counted, inspected, and slotted before it's ever picked for an order. Prep work follows current marketplace requirements, not a best guess.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  That consistency is what keeps accuracy high and rejected shipments rare.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <span className="text-sm font-semibold text-emerald-600">Where we operate</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy mt-2">
                Our warehouse locations
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
              {facilities.map((f) => (
                <div key={f.location} className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-brand-navy mb-3">{f.location}</h3>
                  <ul className="space-y-2">
                    {f.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-brand-navy py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Want to see if we're a fit?
            </h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8">
              Tell us about your business and we'll walk you through how we'd handle your fulfillment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-brand-emerald hover:bg-emerald-400 text-brand-navy font-semibold px-6 py-3 rounded-md transition-colors"
              >
                Get in touch
              </Link>
              <Link
                to="/services"
                className="border border-white/25 hover:border-white/50 text-white font-semibold px-6 py-3 rounded-md transition-colors"
              >
                View services
              </Link>
            </div>
          </div>
        </section>

      </div>
    </WebsiteLayout>
  );
};

export default AboutPage;