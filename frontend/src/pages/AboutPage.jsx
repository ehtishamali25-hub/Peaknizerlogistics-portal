// AboutPage.jsx – TOTALLY NEW DESIGN (light theme, blue accent, no 3D)
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);

  useEffect(() => {
    // Hero fade
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );

    // Story content
    ScrollTrigger.create({
      trigger: storyRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.story-item', {
          opacity: 0,
          y: 20,
          stagger: 0.2,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });

    // Values
    ScrollTrigger.create({
      trigger: valuesRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.value-card', {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });

    // Team
    ScrollTrigger.create({
      trigger: teamRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.team-member', {
          opacity: 0,
          scale: 0.95,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });
  }, []);

  return (
    <WebsiteLayout>
      <div className="bg-gray-50 min-h-screen text-gray-800">

        {/* ===== HERO ===== */}
        <header ref={heroRef} className="py-20 md:py-28 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="inline-block bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200 mb-6">
              <span className="text-blue-600 text-sm font-medium">EST. 2020</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-900">
              PEAKNIZER<span className="text-blue-600 block text-3xl sm:text-4xl md:text-5xl">LOGISTICS</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto mt-4 leading-relaxed">
              Pioneering the future of <span className="text-blue-600 font-semibold">3PL fulfillment</span>
              <br />
              <span className="text-gray-500 text-base md:text-lg">500K+ sq ft • 2,500+ brands • 60K orders/month</span>
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/services"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                SERVICES
              </Link>
              <Link
                to="/contact"
                className="border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all"
              >
                START PARTNERSHIP
              </Link>
            </div>
          </div>
        </header>

        {/* ===== OUR STORY (Timeline) ===== */}
        <section ref={storyRef} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left – textual story */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">FROM GARAGE TO GLOBAL</h2>
                <div className="space-y-4 text-gray-600">
                  <p className="story-item">
                    Founded in <span className="font-semibold text-blue-600">2020</span>, Peaknizer emerged from a simple truth: 
                    e‑commerce was exploding, but logistics was the bottleneck strangling growth.
                  </p>
                  <p className="story-item">
                    What began as a <span className="font-semibold text-blue-600">single warehouse</span> in Virginia has scaled to 
                    <span className="font-semibold text-blue-600">500K+ sq ft</span> across strategic US locations, serving 
                    <span className="font-semibold text-blue-600">2,500+ brands</span>.
                  </p>
                  <p className="story-item">
                    Today we process <span className="font-semibold text-blue-600">60K orders monthly</span> with 
                    <span className="font-semibold text-blue-600">99.99% accuracy</span>, powered by proprietary AI and 
                    relentless innovation.
                  </p>
                </div>
                {/* Testimonial */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="text-4xl text-blue-500 mb-2">“</div>
                  <p className="text-gray-700 italic text-lg">
                    "We don't just move boxes. We architect supply chains that scale empires."
                  </p>
                  <div className="flex items-center mt-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-3">
                      SH
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Shah</p>
                      <p className="text-sm text-blue-600">Founder &amp; CEO</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right – timeline stats (replaces 3D) */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-2xl font-semibold text-gray-900 text-center mb-6">OUR JOURNEY</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">2020</div>
                    <div className="text-gray-500 text-sm">Founded</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">500K+</div>
                    <div className="text-gray-500 text-sm">Sq Ft Served</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">2,500+</div>
                    <div className="text-gray-500 text-sm">Happy Brands</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">60K</div>
                    <div className="text-gray-500 text-sm">Orders/Month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== MISSION & VISION ===== */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Mission */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 hover:border-blue-400 transition-colors">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">MISSION</h3>
                <p className="text-gray-600 leading-relaxed">
                  Empower brands to conquer commerce through flawless, scalable logistics that eliminate friction and maximize velocity.
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li className="flex items-start"><span className="text-blue-500 mr-2">✓</span>Zero‑defect execution</li>
                  <li className="flex items-start"><span className="text-blue-500 mr-2">✓</span>AI‑first innovation</li>
                  <li className="flex items-start"><span className="text-blue-500 mr-2">✓</span>Partnership mindset</li>
                </ul>
              </div>
              {/* Vision */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 hover:border-blue-400 transition-colors">
                <div className="text-5xl mb-4">👁️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">VISION</h3>
                <p className="text-gray-600 leading-relaxed">
                  Become the <span className="font-semibold text-gray-900">invisible force</span> powering the world's most successful commerce brands through unprecedented logistics intelligence.
                </p>
                <ul className="mt-4 space-y-2 text-gray-600">
                  <li className="flex items-start"><span className="text-blue-500 mr-2">✓</span>Global expansion</li>
                  <li className="flex items-start"><span className="text-blue-500 mr-2">✓</span>AI supremacy</li>
                  <li className="flex items-start"><span className="text-blue-500 mr-2">✓</span>Industry leadership</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CORE VALUES ===== */}
        <section ref={valuesRef} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">CORE PRINCIPLES</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">The DNA that powers everything we do</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { icon: '🤝', title: 'Absolute Integrity', desc: 'Zero tolerance for opacity. Complete transparency in pricing, processes, and performance.' },
                { icon: '⚡', title: 'Relentless Innovation', desc: 'AI-first approach. Continuous evolution through technology and process reinvention.' },
                { icon: '🎯', title: 'Customer Supremacy', desc: 'Your success IS our success. We measure ourselves by your growth velocity.' },
                { icon: '👥', title: 'Team Obsession', desc: 'World-class talent. Continuous development. Ownership culture.' },
                { icon: '🌱', title: 'Exponential Growth', desc: 'Built for 100x scale. Sustainable systems that compound over decades.' },
                { icon: '🌍', title: 'Global Impact', desc: 'Economic engines for communities. Responsible stewardship of resources.' }
              ].map((value, i) => (
                <div key={i} className="value-card bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== EXECUTIVE TEAM ===== */}
        <section ref={teamRef} className="py-16 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">EXECUTIVE TEAM</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">World-class operators building the future of logistics</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { name: 'Shah', role: 'Founder & CEO', bio: '15+ years logistics. Ex-Amazon. Built 500K+ sq ft network.', initial: 'SH' },
                { name: 'E. Ali', role: 'CTO & Head of Engineering', bio: 'Built Client Portal v2.0. AI logistics pioneer. 10+ years software.', initial: 'EA' },
                { name: 'M. Ali', role: 'Chief Operations Officer', bio: 'Warehouse optimization expert. Stanford MBA. 99.99% accuracy systems.', initial: 'MA' },
                { name: 'Emily Watson', role: 'Chief Client Officer', bio: '2,500+ client relationships. Retention specialist. Growth architect.', initial: 'EW' }
              ].map((leader, i) => (
                <div key={i} className="team-member bg-gray-50 rounded-xl border border-gray-200 p-6 text-center hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
                  <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-3xl mb-4">
                    {leader.initial}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{leader.name}</h3>
                  <p className="text-blue-600 font-medium text-sm mb-2">{leader.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{leader.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROVEN RESULTS (stats) ===== */}
        <section className="py-16 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">PROVEN RESULTS</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">Numbers don't lie. Scale does.</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 max-w-4xl mx-auto">
              {[
                { num: '99.9%', label: 'Accuracy' },
                { num: '24h', label: 'Avg Turnaround' },
                { num: '500K+', label: 'Sq Ft Capacity' },
                { num: '2,500+', label: 'Active Brands' },
                { num: '60K', label: 'Orders/Month' },
                { num: '0', label: 'Downtime Days' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">{stat.num}</div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== STRATEGIC FOOTPRINT (facilities) ===== */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">STRATEGIC FOOTPRINT</h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto mb-10">Multi‑location network optimized for velocity</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { location: 'Arlington, VA', size: '150K sq ft', features: ['East Coast Hub', '60 docks', 'Rail access', 'Climate control'] },
                { location: 'Houston, TX', size: '200K sq ft', features: ['Gulf Gateway', '80 docks', 'Hazmat certified', 'Port proximity'] },
                { location: 'Chicago, IL', size: '175K sq ft', features: ['Midwest Core', 'Rail nexus', 'Cross-dock', 'Automation'] }
              ].map((facility, i) => (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-6 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md">
                  <div className="text-4xl mb-3">📍</div>
                  <h3 className="text-xl font-semibold text-gray-900">{facility.location}</h3>
                  <p className="text-blue-600 font-medium">{facility.size}</p>
                  <ul className="mt-3 space-y-1 text-gray-600 text-sm">
                    {facility.features.map((feature, j) => (
                      <li key={j} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA (blue gradient) ===== */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              JOIN THE <span className="text-yellow-300">REVOLUTION</span>
            </h2>
            <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto">
              Experience logistics that scales with your ambition. Partner with the future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                DISCOVER SERVICES
              </Link>
              <Link
                to="/contact"
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-semibold text-lg border border-white/30 hover:bg-white/30 transition-all"
              >
                START PARTNERSHIP →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </WebsiteLayout>
  );
};

export default AboutPage;