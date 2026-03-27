// HomePage.jsx - FULL 3D ENHANCED VERSION
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './Header';  
import Footer from './Footer';
gsap.registerPlugin(ScrollTrigger);

const Counter = ({ end, label }) => {
  const [value, setValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 2500;
    const stepTime = Math.max(10, Math.floor(duration / end));
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / stepTime));
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setValue(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="group relative perspective-[1000px] hover:rotate-x-5 transition-all duration-700 cursor-pointer hover:scale-[1.05]">
      <div className="relative bg-gradient-to-br from-gray-900/90 to-black/70 backdrop-blur-xl p-10 rounded-3xl border border-gradient-to-r from-orange-500/40 via-orange-400/20 to-yellow-500/20 shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:border-orange-500/60 hover:scale-[1.02] transition-all duration-700">
        {/* 3D Counter Effect */}
        <div className="text-6xl md:text-5xl font-black bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent mb-6 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500 relative z-10">
          {value.toLocaleString()}+
        </div>
        <div className="text-gray-300 font-bold uppercase tracking-widest text-lg">{label}</div>
        
        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-transparent to-orange-400/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10" />
        
        {/* Floating Particles */}
        <div className="absolute top-4 right-4 w-20 h-20">
          <div className="w-2 h-2 bg-orange-400 rounded-full absolute animate-bounce" style={{animationDelay: '0s'}} />
          <div className="w-3 h-3 bg-yellow-400 rounded-full absolute animate-ping animate-pulse" style={{animationDelay: '0.2s'}} />
          <div className="w-1 h-1 bg-orange-500 rounded-full absolute animate-bounce" style={{animationDelay: '0.4s', top: '20px', left: '10px'}} />
        </div>
      </div>
    </div>
  );
};

// 3D Warehouse Scene Component
const Warehouse3DScene = ({ isVisible }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(1200, 400);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff6b35, 1, 50);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Warehouse Floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2d3748,
      roughness: 0.8,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Warehouse Shelves
    const shelfGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const shelfGeometry = new THREE.BoxGeometry(2, 4, 8);
      const shelfMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x4a5568,
        metalness: 0.3,
        roughness: 0.4
      });
      const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
      shelf.position.set(i * 6 - 12, 2, -8);
      shelf.castShadow = true;
      shelf.receiveShadow = true;
      shelfGroup.add(shelf);

      // Cargo Boxes on Shelves
      for (let j = 0; j < 3; j++) {
        const boxGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);
        const boxMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.5, 0.7, 0.5),
          metalness: 0.1,
          roughness: 0.6
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(i * 6 - 12 + (Math.random() - 0.5) * 1, 1 + j * 1.2, -7 + (Math.random() - 0.5) * 1);
        box.castShadow = true;
        shelfGroup.add(box);
      }
    }
    scene.add(shelfGroup);

    // Animated Truck
    const truckGroup = new THREE.Group();
    const truckBodyGeometry = new THREE.BoxGeometry(3, 1.5, 6);
    const truckBodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff6b35,
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 1
    });
    const truckBody = new THREE.Mesh(truckBodyGeometry, truckBodyMaterial);
    truckBody.position.y = 0.75;
    truckBody.castShadow = true;
    truckGroup.add(truckBody);

    // Truck Cab
    const cabGeometry = new THREE.BoxGeometry(2, 2, 3);
    const cabMaterial = new THREE.MeshPhysicalMaterial({ color: 0xf56565, metalness: 0.3, roughness: 0.2 });
    const cab = new THREE.Mesh(cabGeometry, cabMaterial);
    cab.position.set(-1.5, 1.5, 2.5);
    cab.castShadow = true;
    truckGroup.add(cab);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const wheelMaterial = new THREE.MeshPhysicalMaterial({ color: 0x2d3748, metalness: 0.8, roughness: 0.2 });
    [-2, 2].forEach(x => {
      [-1.5, 1.5].forEach(z => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 0.2, z);
        wheel.castShadow = true;
        truckGroup.add(wheel);
      });
    });

    truckGroup.position.set(-15, 0, 0);
    scene.add(truckGroup);

    // Route Line (glowing)
    const routePoints = [];
    for (let i = 0; i <= 30; i++) {
      routePoints.push(new THREE.Vector3(-15 + (i / 30) * 30, 0.1 + Math.sin(i * 0.5) * 0.2, 0));
    }
    const routeGeometry = new THREE.BufferGeometry().setFromPoints(routePoints);
    const routeMaterial = new THREE.LineBasicMaterial({ 
      color: 0xff6b35, 
      transparent: true, 
      opacity: 0.8,
      linewidth: 4
    });
    const routeLine = new THREE.Line(routeGeometry, routeMaterial);
    scene.add(routeLine);

    camera.position.set(0, 8, 15);
    camera.lookAt(0, 2, 0);

    // Animation Loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      time += 0.02;
      
      // Truck movement
      truckGroup.position.x = -15 + (Math.sin(time * 0.3) * 5) + 15;
      truckGroup.rotation.y = Math.sin(time * 0.3) * 0.1;
      
      // Shelf floating animation
      shelfGroup.children.forEach((shelf, i) => {
        shelf.position.y = 2 + Math.sin(time + i) * 0.1;
      });
      
      // Camera subtle movement
      camera.position.x = Math.sin(time * 0.1) * 2;
      camera.position.y = 8 + Math.sin(time * 0.05) * 0.5;
      camera.lookAt(0, 2, 0);
      
      renderer.render(scene, camera);
    };
    animate();

    // Responsive
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth * 0.9, 400);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden border-4 border-orange-500/30 shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-700 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent rounded-3xl" />
      <div className="absolute top-6 left-6 text-white font-bold text-2xl bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm">
        🚚 Live Operations Dashboard
      </div>
    </div>
  );
};

const HomePage = () => {
  const [lead, setLead] = useState({ name: '', email: '', phone: '', note: '' });
  const [submitting, setSubmitting] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const whyRef = useRef(null);

  const handleChange = (e) => setLead({ ...lead, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitting(false);
    alert('🎉 Thanks! We received your request. Expect a response within 24 hours!');
    setLead({ name: '', email: '', phone: '', note: '' });
  };

  // GSAP Animations
  useEffect(() => {
    // Hero Animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }
    );

    // Stats Animation
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: 'top 80%',
      onEnter: () => {
        gsap.from('.counter-card', {
          scale: 0.8,
          opacity: 0,
          y: 50,
          stagger: 0.2,
          duration: 1,
          ease: 'back.out(1.7)'
        });
      }
    });

    // Why Choose Animation
    ScrollTrigger.create({
      trigger: whyRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.why-card', {
          rotationX: 90,
          opacity: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: 'power3.out'
        });
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* HERO SECTION - 3D */}
      <header className="relative min-h-screen flex items-center overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 bg-grid-white/[0.03]" />
          <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 via-transparent to-blue-500/10 animate-pulse" />
          
          {/* Floating Logistics Elements */}
          <div className="absolute top-20 left-10 w-20 h-20">
            <div className="w-6 h-6 bg-orange-500 rounded-full animate-ping absolute" />
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse absolute top-4 left-4" style={{animationDelay: '1s'}} />
          </div>
          <div className="absolute bottom-32 right-20 w-16 h-16 border-2 border-orange-500/30 rounded-full animate-spin-slow" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-screen">
            {/* Hero Content */}
            <div className="space-y-8 max-w-2xl">
              <div className="inline-block bg-gradient-to-r from-orange-500/20 to-yellow-500/20 px-6 py-3 rounded-full border border-orange-500/40 backdrop-blur-sm">
                <span className="text-orange-400 font-bold uppercase tracking-wider text-sm">🚚 3PL Fulfillment Leader</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl">
                Next-Gen <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">3PL</span>
                <br />
                <span className="text-5xl md:text-6xl lg:text-7xl">Warehouse Operations</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                ⚡ Lightning-fast fulfillment • 📱 Real-time tracking • 🌍 Nationwide coverage
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/login"
                  className="group relative bg-gradient-to-r from-orange-500 to-orange-600 text-black px-10 py-5 rounded-3xl font-bold text-xl shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 transform hover:-translate-y-2 hover:scale-[1.02] transition-all duration-500 overflow-hidden"
                >
                  <span className="relative z-10">🚀 Start Free Trial</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 -skew-x-12 transform group-hover:translate-x-4 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 rounded-3xl blur" />
                </Link>
                
                <Link
                  to="/pricing"
                  className="group border-2 border-orange-500/50 text-white px-10 py-5 rounded-3xl font-bold text-xl hover:bg-white/10 backdrop-blur-sm hover:border-orange-500/80 transition-all duration-500 hover:scale-[1.02]"
                >
                  💰 View Pricing
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:w-full transition-all duration-500" />
                </Link>
              </div>

              {/* Trust Stats */}
              <div className="flex items-center flex-wrap gap-8 pt-6 text-sm text-gray-400 backdrop-blur-sm">
                <div className="flex items-center space-x-3 group hover:text-orange-400 transition-colors">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  <span>2,500+ Brands</span>
                </div>
                <div className="flex items-center space-x-3 group hover:text-orange-400 transition-colors">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" style={{animationDelay: '0.2s'}} />
                  <span>60K Orders/Month</span>
                </div>
                                <div className="flex items-center space-x-3 group hover:text-orange-400 transition-colors">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" style={{animationDelay: '0.4s'}} />
                  <span>99.9% On-Time</span>
                </div>
              </div>
            </div>

            {/* 3D Hero Form */}
            <div className="relative">
              <div className="bg-gradient-to-b from-gray-900/95 to-black/80 backdrop-blur-3xl p-10 rounded-4xl border border-orange-500/40 shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all duration-700 relative overflow-hidden">
                {/* Form Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-yellow-500/20 rounded-4xl blur-xl opacity-50" />
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    🚚 Get Instant Quote
                  </h3>
                  <p className="text-gray-400 mb-8 text-lg">Free analysis in 24 hours • No commitment</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <input
                        name="name"
                        value={lead.name}
                        onChange={handleChange}
                        required
                        placeholder="Your Name"
                        className="w-full bg-black/50 backdrop-blur-sm border border-orange-500/30 text-white px-6 py-4 rounded-2xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500/60 transition-all duration-300 placeholder-gray-500 font-medium"
                      />
                      <input
                        name="email"
                        value={lead.email}
                        onChange={handleChange}
                        type="email"
                        required
                        placeholder="Business Email"
                        className="w-full bg-black/50 backdrop-blur-sm border border-orange-500/30 text-white px-6 py-4 rounded-2xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500/60 transition-all duration-300 placeholder-gray-500 font-medium"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        name="phone"
                        value={lead.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="bg-black/50 backdrop-blur-sm border border-orange-500/30 text-white px-4 py-4 rounded-xl focus:ring-2 focus:ring-orange-500/40 transition-all placeholder-gray-500"
                      />
                      <select className="bg-black/50 backdrop-blur-sm border border-orange-500/30 text-white px-4 py-4 rounded-xl focus:ring-2 focus:ring-orange-500/40 appearance-none">
                        <option>Amazon Seller</option>
                        <option>Shopify Store</option>
                        <option>Etsy/WooCommerce</option>
                      </select>
                    </div>

                    <textarea
                      name="note"
                      value={lead.note}
                      onChange={handleChange}
                      placeholder="Monthly volume? Special requirements?"
                      rows={3}
                      className="w-full bg-black/50 backdrop-blur-sm border border-orange-500/30 text-white px-6 py-4 rounded-2xl focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500/60 resize-none transition-all placeholder-gray-500"
                    />

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full group relative bg-gradient-to-r from-orange-500 to-orange-600 text-black px-8 py-6 rounded-3xl font-bold text-xl shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {submitting ? (
                          <>
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          '🚀 Get My Free Quote'
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-500 -skew-x-12 transform group-hover:translate-x-4 transition-transform duration-700" />
                    </button>

                    <p className="text-xs text-gray-500 text-center pt-4">
                      🔒 Secure • No spam • Industry-leading privacy
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* STATS SECTION - 3D Counters */}
      <section ref={statsRef} className="py-32 bg-gradient-to-b from-black/50 to-gray-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-black bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl mb-6">
              Live Performance Metrics
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real-time data from our fulfillment centers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <Counter end={2593} label="Active Brands" />
            <Counter end={100020} label="Deliveries This Month" />
            <Counter end={60000} label="Orders Processed" />
          </div>
        </div>
      </section>

      {/* 3D WAREHOUSE SCENE */}
      <section className="py-32 bg-black/80 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-black bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
              Our State-of-the-Art Facilities
            </h2>
          </div>
          <Warehouse3DScene />
        </div>
      </section>

      {/* WHY CHOOSE US - 3D Cards */}
      <section ref={whyRef} className="py-32 bg-gradient-to-b from-gray-900/50 to-black/70 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.01]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl mb-6">
              Why 2,500+ Brands Choose Us
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Enterprise-grade 3PL powered by cutting-edge automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              { icon: '💰', title: 'Unbeatable Pricing', desc: 'From $2/order • 30-day free storage • Volume discounts' },
              { icon: '⚡', title: 'Lightning Fulfillment', desc: 'Same-day processing • 99.9% accuracy • Auto carrier selection' },
              { icon: '🔒', title: 'Amazon FBA Ready', desc: 'Certified prep services • Full compliance • Zero penalties' },
              { icon: '👥', title: '24/7 White-Glove Support', desc: 'Dedicated managers • Real-time chat • SLA guarantees' }
            ].map((feature, i) => (
              <div key={i} className="why-card group relative perspective-[1000px] hover:rotate-y-10 transition-all duration-1000 cursor-pointer">
                <div className="relative bg-gradient-to-br from-gray-900/90 to-black/70 backdrop-blur-xl p-10 rounded-4xl border border-orange-500/30 shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/50 hover:scale-[1.05] hover:border-orange-500/60 transition-all duration-700 hover:rotate-y-5">
                  <div className="text-5xl mb-6 opacity-0 group-hover:opacity-100 transition-all duration-700">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-orange-400 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed opacity-80 group-hover:opacity-100 transition-all">{feature.desc}</p>
                  
                  {/* Card Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-yellow-500/30 rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700 -z-10" />
                  
                  {/* Floating accent */}
                  <div className="absolute top-6 right-6 w-20 h-20 border-2 border-orange-500/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow transition-all duration-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS - 3D Timeline */}
      <section className="py-32 bg-black/80 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-black bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl">
              4-Step Fulfillment Process
            </h2>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
            {/* Connecting Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-32 h-[600px] w-1 bg-gradient-to-b from-orange-500 to-yellow-500 opacity-30" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { num: '01', title: 'Inventory Receive', desc: 'AI-powered inspection • Real-time logging', icon: '📦' },
                { num: '02', title: 'Smart Storage', desc: 'Optimized slotting • FEFO rotation', icon: '🏬' },
                { num: '03', title: 'Lightning Pick/Pack', desc: '99.9% accuracy • Custom packaging', icon: '⚡' },
                { num: '04', title: 'Intelligent Shipping', desc: 'Carrier optimization • Live tracking', icon: '🚚' }
              ].map((step, i) => (
                <div key={i} className={`group relative ${i % 2 ? 'md:translate-y-24' : ''}`}>
                  <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 backdrop-blur-xl p-12 rounded-4xl border-2 border-orange-500/30 hover:border-orange-500/60 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-700 cursor-pointer shadow-2xl">
                    <div className="text-6xl mb-6 opacity-70">{step.icon}</div>
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 text-black rounded-3xl flex items-center justify-center font-bold text-2xl mx-auto mb-8 shadow-2xl shadow-orange-500/50 group-hover:scale-110 transition-transform">
                      {step.num}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-6 text-center">{step.title}</h3>
                    <p className="text-gray-400 text-center leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BRANDS - 3D Carousel */}
      <section className="py-24 bg-gradient-to-b from-black/70 to-gray-900/50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-6">🏆 Trusted By Industry Leaders</h3>
            <p className="text-gray-400 text-xl">The brands powering tomorrow's commerce</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-items-center">
            {['Amazon', 'Shopify', 'Flipkart', 'Etsy', 'Walmart', 'eBay'].map((brand, i) => (
              <div key={i} className="group relative p-8 bg-gradient-to-br from-gray-900/50 to-black/30 backdrop-blur-xl rounded-3xl border border-orange-500/20 hover:border-orange-500/50 hover:shadow-orange-500/30 hover:scale-110 transition-all duration-700 cursor-pointer shadow-xl">
                <div className="text-3xl font-bold text-gray-300 group-hover:text-orange-400 transition-colors">
                  {brand}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.1] animate-pulse" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-7xl font-black text-white mb-8 drop-shadow-2xl leading-tight">
              Ready to <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">10x</span> Your Fulfillment?
            </h2>
            <p className="text-2xl text-white/90 mb-12 leading-relaxed">
              Join 2,500+ brands automating their logistics. Zero risk, massive upside.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/login"
                className="group relative bg-black text-white px-12 py-8 rounded-4xl font-bold text-2xl shadow-2xl shadow-white/20 hover:shadow-white/40 transform hover:-translate-y-3 hover:scale-[1.05] transition-all duration-700 overflow-hidden backdrop-blur-xl border-4 border-white/20"
              >
                🚀 Start Free Trial
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -skew-x-12 transform group-hover:translate-x-8 transition-transform duration-700" />
              </Link>
              <Link
                to="/pricing"
                className="group bg-white/20 backdrop-blur-xl text-white px-12 py-8 rounded-4xl font-bold text-2xl border-2 border-white/40 hover:bg-white/30 hover:border-white/60 transition-all duration-500 hover:scale-105"
              >
                💰 See Transparent Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;