// ServicesPage.jsx – TOTALLY NEW DESIGN (matching HomePage theme)
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ServicesPage = () => {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const workflowRef = useRef(null);
  const industriesRef = useRef(null);

  useEffect(() => {
    // Hero fade‑in
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );

    // Services cards
    ScrollTrigger.create({
      trigger: servicesRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.service-card', {
          opacity: 0,
          y: 20,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });

    // Workflow timeline
    ScrollTrigger.create({
      trigger: workflowRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.workflow-step', {
          opacity: 0,
          x: -30,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });

    // Industries
    ScrollTrigger.create({
      trigger: industriesRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.industry-pill', {
          opacity: 0,
          scale: 0.9,
          stagger: 0.05,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    });
  }, []);

  return (
    <WebsiteLayout>
      <div className="bg-gray-50 min-h-screen text-gray-800">

        {/* ===== HERO SECTION ===== */}
        <header ref={heroRef} className="py-20 md:py-28 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="inline-block bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200 mb-6">
              <span className="text-blue-600 text-sm font-medium">🚀 COMPLETE 3PL ECOSYSTEM</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              FULL-STACK <span className="text-blue-600">3PL</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mt-4 leading-relaxed">
              End-to-end fulfillment • AI-powered operations • 99.9% accuracy • Real-time visibility
            </p>
            <div className="mt-8">
              <Link
                to="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                ENTER CLIENT PORTAL →
              </Link>
            </div>
          </div>
        </header>

        {/* ===== CORE SERVICES (3 cards) ===== */}
        <section ref={servicesRef} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">CORE SERVICES</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">
              Enterprise‑grade 3PL powered by automation & AI
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Warehousing */}
              <div className="service-card bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-400 transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="text-5xl mb-4">🏬</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">WAREHOUSING</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  500K+ sq ft climate‑controlled facilities • AI slotting • 99.99% inventory accuracy • Multi‑location network
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                    📱 LIVE PORTAL ACCESS
                  </span>
                  <p className="text-gray-500 text-xs mt-2">Real‑time stock levels • Low‑stock alerts • Location tracking</p>
                </div>
              </div>

              {/* Fulfillment */}
              <div className="service-card bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-400 transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">FULFILLMENT</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Same‑day processing • 99.9% pick accuracy • Multi‑platform integration • Custom packaging
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                    ⚡ LIVE TRACKING
                  </span>
                  <p className="text-gray-500 text-xs mt-2">Order status • Packing progress • Shipping confirmations</p>
                </div>
              </div>

              {/* Shipping */}
              <div className="service-card bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-400 transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="text-5xl mb-4">🚚</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">SHIPPING</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Carrier optimization • Real‑time rates • Domestic/International • Live tracking
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                    📍 LIVE TRACKING
                  </span>
                  <p className="text-gray-500 text-xs mt-2">Delivery updates • Rate comparison • Exception alerts</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FBA PREP STATS ===== */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">FBA PREP IN ACTION</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">
              Watch our automated FBA prep line process 10,000+ units daily
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">24‑48h</div>
                <div className="text-gray-500 text-sm">Prep Turnaround</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">100%</div>
                <div className="text-gray-500 text-sm">Compliance Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">$0.60</div>
                <div className="text-gray-500 text-sm">Starting Price</div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CLIENT PORTAL FEATURES ===== */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">CLIENT PORTAL v2.0</h2>
                <p className="text-gray-600 text-lg mb-6">
                  Your 24/7 logistics command center. Enterprise‑grade dashboard with real‑time data.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: '📊', title: 'Live Inventory', desc: 'Multi‑warehouse visibility • AI forecasting' },
                    { icon: '🚚', title: 'Order Pipeline', desc: 'Real‑time fulfillment status • ETA predictions' },
                    { icon: '💰', title: 'Smart Invoicing', desc: 'Automated billing • Payment integration' },
                    { icon: '📈', title: 'Performance Analytics', desc: 'KPIs • Cost analysis • Trend insights' }
                  ].map((feature, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-400 transition-colors">
                      <div className="text-3xl mb-2">{feature.icon}</div>
                      <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                      <p className="text-gray-500 text-sm">{feature.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link
                    to="/login"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    ENTER PORTAL NOW →
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-2xl font-semibold text-gray-900">Live Dashboard Preview</h3>
                <p className="text-gray-500 text-sm mt-2">Interactive demo available</p>
                <div className="mt-4 inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200">
                  LIVE DEMO
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== INTELLIGENT WORKFLOW (vertical timeline) ===== */}
        <section ref={workflowRef} className="py-16 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">INTELLIGENT WORKFLOW</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">
              AI‑powered end‑to‑end fulfillment • Zero human error
            </p>
            <div className="max-w-3xl mx-auto space-y-8">
              {[
                { num: '01', title: 'AI Receiving', desc: 'Computer vision inspection • Auto slotting • 100% accuracy', icon: '🤖' },
                { num: '02', title: 'Smart Storage', desc: 'Dynamic slotting • FEFO rotation • Multi‑zone picking', icon: '🏭' },
                { num: '03', title: 'Lightning Fulfillment', desc: 'Robotic picking • Quality gates • Custom packaging', icon: '⚡' },
                { num: '04', title: 'Global Shipping', desc: 'Carrier AI • Real‑time rates • Multi‑modal logistics', icon: '🌍' }
              ].map((step, idx) => (
                <div key={idx} className="workflow-step flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                    {step.num}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{step.icon}</span>
                      <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-500 mt-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== INDUSTRIES (pill badges) ===== */}
        <section ref={industriesRef} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">12+ INDUSTRIES SERVED</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">
              Specialized workflows for every vertical
            </p>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {[
                'E‑commerce', 'Amazon FBA', 'Shopify', 'DTC Brands',
                'Health & Beauty', 'Electronics', 'Apparel', 'Food',
                'Pet Supplies', 'Home Goods', 'Subscription', 'B2B'
              ].map((industry, i) => (
                <span
                  key={i}
                  className="industry-pill bg-white border border-gray-200 rounded-full px-5 py-2 text-sm font-medium text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA (blue gradient) ===== */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              READY TO <span className="text-yellow-300">AUTOMATE</span> YOUR LOGISTICS?
            </h2>
            <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto">
              Scale without limits. Free consultation + custom pricing in 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                GET FREE QUOTE
              </Link>
              <Link
                to="/login"
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold text-lg border border-white/30 hover:bg-white/30 transition-all"
              >
                ENTER CLIENT PORTAL →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </WebsiteLayout>
  );
};

export default ServicesPage;