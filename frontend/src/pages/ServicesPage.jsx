// ServicesPage.jsx - FULL 3D ENHANCED VERSION
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 3D Conveyor Belt Component
const ConveyorBelt3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(1400, 500);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    scene.add(new THREE.AmbientLight(0x404040, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 10, 5);
    scene.add(dirLight);

    // Conveyor Belt
    const beltGeometry = new THREE.PlaneGeometry(20, 4);
    const beltMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2d3748,
      roughness: 0.8,
      metalness: 0.2
    });
    const belt = new THREE.Mesh(beltGeometry, beltMaterial);
    belt.rotation.x = -Math.PI / 2;
    belt.position.y = 0;
    scene.add(belt);

    // Packages moving on conveyor
    const packages = [];
    for (let i = 0; i < 12; i++) {
      const pkgGeometry = new THREE.BoxGeometry(1, 0.8, 1.2);
      const pkgMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.1, 0.8, 0.6),
        roughness: 0.4,
        metalness: 0.1
      });
      const pkg = new THREE.Mesh(pkgGeometry, pkgMaterial);
      pkg.position.set(
        Math.random() * 10 - 15,
        0.4,
        Math.sin(i * 0.5) * 0.5
      );
      pkg.castShadow = true;
      scene.add(pkg);
      packages.push(pkg);
    }

    // FBA Labels
    const labelGeometry = new THREE.PlaneGeometry(0.8, 0.4);
    const labelMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff6b35, 
      transparent: true, 
      opacity: 0.9 
    });
    const fbaLabel = new THREE.Mesh(labelGeometry, labelMaterial);
    fbaLabel.position.set(0, 1.2, 0);
    scene.add(fbaLabel);

    camera.position.set(0, 5, 12);
    camera.lookAt(0, 1, 0);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.03;

      // Conveyor movement
      belt.position.z = Math.sin(time * 2) * 0.02;

      // Packages moving
      packages.forEach((pkg, i) => {
        pkg.position.x += 0.08;
        if (pkg.position.x > 10) pkg.position.x = -15;
        pkg.rotation.y = Math.sin(time + i) * 0.1;
        pkg.rotation.x = Math.cos(time * 0.5 + i) * 0.05;
      });

      // FBA label floating
      fbaLabel.position.y = 1.2 + Math.sin(time * 3) * 0.1;
      fbaLabel.rotation.y = Math.sin(time * 2) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-[500px] rounded-4xl shadow-2xl shadow-orange-500/30 border-4 border-orange-500/40 relative overflow-hidden" />
  );
};

// 3D Client Portal Dashboard Mockup
const PortalDashboard3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Similar 3D dashboard scene with charts, metrics, etc.
    // Implementation similar to warehouse scene
  }, []);

  return (
    <div className="w-full h-[400px] bg-gradient-to-br from-gray-900/80 to-black/60 rounded-4xl border-2 border-orange-500/50 shadow-2xl backdrop-blur-xl">
      {/* Dashboard mockup */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl animate-pulse">📊 3D Dashboard Coming</div>
      </div>
    </div>
  );
};

const ServicesPage = () => {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }
    );

    ScrollTrigger.create({
      trigger: servicesRef.current,
      start: 'top 80%',
      onEnter: () => {
        gsap.from('.service-3d-card', {
          scale: 0.8,
          rotationY: 180,
          opacity: 0,
          stagger: 0.2,
          duration: 1.2,
          ease: 'back.out(1.7)'
        });
      }
    });
  }, []);

  return (
    <WebsiteLayout>
      {/* HERO - 3D Logistics Pipeline */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-blue-900/20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.03]" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500/10 to-blue-500/10 animate-pulse" />
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="text-center mb-20">
            <div className="inline-block bg-gradient-to-r from-orange-500/20 to-blue-500/20 px-8 py-4 rounded-3xl border-2 border-orange-500/40 backdrop-blur-xl mb-8">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
                🚀 COMPLETE 3PL ECOSYSTEM
              </span>
            </div>
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9] bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent drop-shadow-4xl mb-8">
              FULL-STACK <span className="bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent drop-shadow-4xl">3PL</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
              End-to-end fulfillment • AI-powered operations • 99.9% accuracy • Real-time visibility
            </p>
          </div>

          {/* 3D Client Portal CTA */}
          <div className="max-w-2xl mx-auto text-center">
            <div className="group relative bg-gradient-to-br from-gray-900/95 to-black/80 backdrop-blur-3xl p-12 rounded-4xl border-4 border-gradient-to-r from-orange-500/50 via-blue-500/30 to-orange-500/50 shadow-4xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] transition-all duration-1000 cursor-pointer mx-auto max-w-2xl">
              <div className="text-6xl mb-6 animate-bounce">📱</div>
              <h3 className="text-4xl font-black text-white mb-4 bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                CLIENT PORTAL
              </h3>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                24/7 Real-time Dashboard • Live Inventory • Order Tracking • Analytics
              </p>
              <Link
                to="/login"
                className="group-hover relative bg-gradient-to-r from-orange-500 to-blue-500 text-black px-12 py-5 rounded-3xl font-bold text-2xl shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10">ENTER PORTAL →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent -skew-x-12 transform group-hover:translate-x-8 transition-transform duration-700" />
              </Link>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-blue-500/20 to-orange-500/30 rounded-4xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* CORE SERVICES - 3D ROTATING CARDS */}
      <section ref={servicesRef} className="py-32 bg-gradient-to-b from-black/70 to-gray-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-7xl font-black bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent drop-shadow-4xl mb-6">
              CORE SERVICES
            </h2>
            <p className="text-2xl text-gray-400 max-w-4xl mx-auto">
              Enterprise-grade 3PL powered by automation & AI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Warehousing - 3D Card */}
            <div className="service-3d-card group relative perspective-[1200px] hover:rotate-y-12 transition-all duration-1000 cursor-pointer">
              <div className="relative bg-gradient-to-br from-gray-900/95 to-blue-900/50 backdrop-blur-3xl p-12 rounded-4xl border-4 border-gradient-to-r from-orange-500/50 via-blue-500/40 to-orange-500/50 shadow-4xl shadow-orange-500/30 hover:shadow-orange-500/60 hover:scale-[1.08] hover:rotate-y-8 transition-all duration-1000">
                <div className="text-7xl mb-8 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 animate-bounce-slow">🏬</div>
                <h3 className="text-4xl font-black text-white mb-8 bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl group-hover:scale-105 transition-transform">
                  WAREHOUSING
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-all">
                  500K+ sq ft climate-controlled facilities • AI slotting • 99.99% inventory accuracy • Multi-location network
                </p>
                <div className="mt-8 pt-8 border-t border-blue-500/30">
                  <span className="inline-block bg-gradient-to-r from-orange-500/20 to-blue-500/20 px-4 py-2 rounded-full border border-orange-500/40 text-orange-400 font-bold text-sm uppercase tracking-wider">
                    📱 LIVE PORTAL ACCESS
                  </span>
                  <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                    Real-time stock levels • Low-stock alerts • Location tracking
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/40 via-blue-500/20 to-orange-500/40 rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10" />
              </div>
            </div>

            {/* Order Fulfillment */}
            <div className="service-3d-card group relative perspective-[1200px] hover:rotate-x-8 transition-all duration-1000 cursor-pointer">
              <div className="relative bg-gradient-to-br from-gray-900/95 to-orange-900/50 backdrop-blur-3xl p-12 rounded-4xl border-4 border-gradient-to-r from-yellow-500/50 via-orange-500/40 to-yellow-500/50 shadow-4xl shadow-yellow-500/30 hover:shadow-yellow-500/60 hover:scale-[1.08] hover:rotate-x-5 transition-all duration-1000">
                <div className="text-7xl mb-8 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 animate-bounce-slow">📦</div>
                <h3 className="text-4xl font-black text-white mb-8 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl group-hover:scale-105 transition-transform">
                  FULFILLMENT
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-all">
                  Same-day processing • 99.9% pick accuracy • Multi-platform integration • Custom packaging
                </p>
                <div className="mt-8 pt-8 border-t border-orange-500/30">
                  <span className="inline-block bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full border border-yellow-500/40 text-yellow-400 font-bold text-sm uppercase tracking-wider">
                    ⚡ LIVE TRACKING
                  </span>
                  <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                    Order status • Packing progress • Shipping confirmations
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/40 via-orange-500/20 to-yellow-500/40 rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10" />
              </div>
            </div>

            {/* Shipping */}
            <div className="service-3d-card group relative perspective-[1200px] hover:rotate-y--12 transition-all duration-1000 cursor-pointer">
              <div className="relative bg-gradient-to-br from-gray-900/95 to-green-900/50 backdrop-blur-3xl p-12 rounded-4xl border-4 border-gradient-to-r from-green-500/50 via-blue-500/40 to-green-500/50 shadow-4xl shadow-green-500/30 hover:shadow-green-500/60 hover:scale-[1.08] hover:rotate-y--8 transition-all duration-1000">
                <div className="text-7xl mb-8 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 animate-bounce-slow">🚚</div>
                <h3 className="text-4xl font-black text-white mb-8 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl group-hover:scale-105 transition-transform">
                  SHIPPING
                </h3>
                                <p className="text-lg text-gray-300 leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-all">
                  Carrier optimization • Real-time rates • Domestic/International • Live tracking
                </p>
                <div className="mt-8 pt-8 border-t border-green-500/30">
                  <span className="inline-block bg-gradient-to-r from-green-500/20 to-blue-500/20 px-4 py-2 rounded-full border border-green-500/40 text-green-400 font-bold text-sm uppercase tracking-wider">
                    📍 LIVE TRACKING
                  </span>
                  <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                    Delivery updates • Rate comparison • Exception alerts
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/40 via-blue-500/20 to-green-500/40 rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE CONVEYOR BELT ANIMATION */}
      <section className="py-32 bg-black/90 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-7xl font-black bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 bg-clip-text text-transparent drop-shadow-4xl mb-6">
              FBA PREP IN ACTION
            </h2>
            <p className="text-2xl text-gray-400 max-w-4xl mx-auto">
              Watch our automated FBA prep line process 10,000+ units daily
            </p>
          </div>
          
          {/* 3D Conveyor Belt */}
          <div className="max-w-5xl mx-auto">
            <ConveyorBelt3D />
            <div className="text-center mt-12 space-y-6">
              <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-5xl font-black text-orange-500 mb-2">24-48h</div>
                  <div className="text-gray-400">Prep Turnaround</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-yellow-500 mb-2">100%</div>
                  <div className="text-gray-400">Compliance Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-green-500 mb-2">$0.60</div>
                  <div className="text-gray-400">Starting Price</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT PORTAL - 3D DASHBOARD */}
      <section className="py-32 bg-gradient-to-b from-gray-900/80 to-black/90 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Portal Features */}
            <div className="space-y-8">
              <div className="group">
                <h2 className="text-6xl font-black bg-gradient-to-r from-blue-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-4xl mb-6">
                  CLIENT PORTAL v2.0
                </h2>
                <p className="text-2xl text-gray-300 leading-relaxed">
                  Your 24/7 logistics command center. Enterprise-grade dashboard with real-time data.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: '📊', title: 'Live Inventory', desc: 'Multi-warehouse visibility • AI forecasting' },
                  { icon: '🚚', title: 'Order Pipeline', desc: 'Real-time fulfillment status • ETA predictions' },
                  { icon: '💰', title: 'Smart Invoicing', desc: 'Automated billing • Payment integration' },
                  { icon: '📈', title: 'Performance Analytics', desc: 'KPIs • Cost analysis • Trend insights' }
                ].map((feature, i) => (
                  <div key={i} className="group p-8 bg-gradient-to-br from-gray-900/70 to-black/50 backdrop-blur-xl rounded-3xl border border-blue-500/30 hover:border-blue-500/60 hover:shadow-blue-500/30 transition-all duration-500 cursor-pointer">
                    <div className="text-4xl mb-4 opacity-70 group-hover:opacity-100 transition-opacity">{feature.icon}</div>
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{feature.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-gray-800">
                <Link
                  to="/login"
                  className="group relative bg-gradient-to-r from-blue-500 to-orange-500 text-white px-12 py-6 rounded-4xl font-bold text-2xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transform hover:-translate-y-3 hover:scale-[1.05] transition-all duration-700 overflow-hidden inline-flex items-center gap-4"
                >
                  ENTER PORTAL NOW
                  <div className="w-6 h-6 bg-white/20 rounded-full group-hover:animate-ping transition-all" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent -skew-x-12 transform group-hover:translate-x-12 transition-transform duration-700" />
                </Link>
              </div>
            </div>

            {/* 3D Dashboard Preview */}
            <div className="relative group">
              <PortalDashboard3D />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-orange-500/20 rounded-4xl blur opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="absolute top-8 left-8 bg-black/80 backdrop-blur-xl px-6 py-3 rounded-2xl text-white font-bold border border-blue-500/50">
                LIVE DEMO
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS PIPELINE - 3D Timeline */}
      <section className="py-32 bg-black/80 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-7xl font-black bg-gradient-to-r from-green-500 via-blue-500 to-orange-500 bg-clip-text text-transparent drop-shadow-4xl mb-6">
              INTELLIGENT WORKFLOW
            </h2>
            <p className="text-2xl text-gray-400 max-w-4xl mx-auto">
              AI-powered end-to-end fulfillment • Zero human error
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Animated Pipeline Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 h-2 w-full bg-gradient-to-r from-green-500 via-blue-500 to-orange-500 rounded-full shadow-2xl shadow-green-500/30 animate-pulse" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
              {[
                { 
                  num: '01', 
                  title: 'AI Receiving', 
                  desc: 'Computer vision inspection • Auto slotting • 100% accuracy',
                  icon: '🤖',
                  color: 'from-green-500'
                },
                { 
                  num: '02', 
                  title: 'Smart Storage', 
                  desc: 'Dynamic slotting • FEFO rotation • Multi-zone picking',
                  icon: '🏭',
                  color: 'from-blue-500'
                },
                { 
                  num: '03', 
                  title: 'Lightning Fulfillment', 
                  desc: 'Robotic picking • Quality gates • Custom packaging',
                  icon: '⚡',
                  color: 'from-yellow-500'
                },
                { 
                  num: '04', 
                  title: 'Global Shipping', 
                  desc: 'Carrier AI • Real-time rates • Multi-modal logistics',
                  icon: '🌍',
                  color: 'from-orange-500'
                }
              ].map((step, i) => (
                <div key={i} className={`group relative ${i % 2 ? 'md:-translate-y-16' : 'md:translate-y-16'}`}>
                  <div className={`bg-gradient-to-br ${step.color} to-gray-900/50 backdrop-blur-3xl p-12 rounded-4xl border-4 border-white/20 shadow-4xl shadow-${step.color === 'from-green-500' ? 'green' : step.color === 'from-blue-500' ? 'blue' : step.color === 'from-yellow-500' ? 'yellow' : 'orange'}-500/40 hover:shadow-${step.color === 'from-green-500' ? 'green' : step.color === 'from-blue-500' ? 'blue' : step.color === 'from-yellow-500' ? 'yellow' : 'orange'}-500/70 hover:scale-105 hover:border-white/40 transition-all duration-1000 cursor-pointer`}>
                    <div className="text-6xl mb-8 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">{step.icon}</div>
                    <div className="w-24 h-24 bg-white text-black rounded-3xl flex items-center justify-center font-black text-3xl mx-auto mb-8 shadow-2xl shadow-black/50 group-hover:shadow-black/70 group-hover:scale-110 transition-all duration-500">
                      {step.num}
                    </div>
                    <h3 className="text-3xl font-black text-white mb-6 text-center group-hover:scale-105 transition-transform">{step.title}</h3>
                    <p className="text-xl text-gray-200 text-center leading-tight opacity-90 group-hover:opacity-100 transition-opacity">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES - 3D Grid */}
      <section className="py-24 bg-gradient-to-b from-gray-900/70 to-black/90 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent drop-shadow-4xl mb-6">
              12+ INDUSTRIES SERVED
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Specialized workflows for every vertical
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              'E-commerce', 'Amazon FBA', 'Shopify', 'DTC Brands', 
              'Health & Beauty', 'Electronics', 'Apparel', 'Food',
              'Pet Supplies', 'Home Goods', 'Subscription', 'B2B'
            ].map((industry, i) => (
              <div key={i} className="group relative p-8 bg-gradient-to-br from-gray-900/80 to-black/50 backdrop-blur-xl rounded-3xl border border-purple-500/30 hover:border-purple-500/70 hover:shadow-purple-500/40 hover:scale-110 hover:rotate-3 transition-all duration-700 cursor-pointer shadow-xl">
                <div className="text-3xl font-bold text-gray-200 group-hover:text-purple-400 transition-all mb-4">
                  {industry}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.08] animate-pulse" />
        <div className="container mx-auto px-6 text-center relative z-20">
          <div className="max-w-5xl mx-auto space-y-8">
            <h2 className="text-7xl md:text-8xl font-black text-white drop-shadow-4xl leading-tight">
              READY TO <span className="bg-gradient-to-r from-yellow-400 via-white to-blue-400 bg-clip-text text-transparent drop-shadow-4xl block">AUTOMATE YOUR LOGISTICS?</span>
            </h2>
            <p className="text-3xl text-white/95 max-w-3xl mx-auto leading-relaxed">
              Scale without limits. Free consultation + custom pricing in 24 hours.
            </p>
            
            <div className="flex flex-col lg:flex-row gap-8 justify-center items-center pt-12">
              <Link
                to="/contact"
                className="group relative bg-black/80 backdrop-blur-xl text-white px-16 py-8 rounded-4xl font-black text-2xl shadow-4xl shadow-white/30 hover:shadow-white/50 border-4 border-white/30 hover:border-white/50 transform hover:-translate-y-4 hover:scale-[1.08] transition-all duration-1000 overflow-hidden"
              >
                <span className="relative z-10">GET FREE QUOTE</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent -skew-x-12 transform group-hover:translate-x-20 transition-transform duration-1000" />
              </Link>
              
              <Link
                to="/login"
                className="group bg-white/20 backdrop-blur-3xl text-white px-16 py-8 rounded-4xl font-black text-2xl border-2 border-white/50 hover:bg-white/40 hover:border-white/70 hover:shadow-2xl hover:shadow-white/50 transition-all duration-700 hover:scale-105"
              >
                ENTER CLIENT PORTAL →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </WebsiteLayout>
  );
};

export default ServicesPage;