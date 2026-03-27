import WebsiteLayout from './WebsiteLayout';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text } from '@react-three/drei';
import gsap from 'gsap';

const PricingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'Amazon Seller',
    message: ''
  });
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // 3D Floating Pricing Orb Component
  const PricingOrb = () => {
    const meshRef = useRef();
    
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.01;
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    });

    return (
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial 
            metalness={0.8}
            roughness={0.2}
            color="#f97316"
            emissive="#ea580c"
            emissiveIntensity={0.3}
          />
        </mesh>
        <Text
          position={[0, 0, 1.8]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          $2.00
        </Text>
      </Float>
    );
  };

  // 3D Pricing Cards Component
  const PricingCard3D = ({ title, price, volume, index }) => {
    const cardRef = useRef();
    
    useFrame((state) => {
      if (cardRef.current) {
        cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime + index) * 0.1;
        cardRef.current.position.y = Math.cos(state.clock.elapsedTime * 1.5 + index) * 0.05;
      }
    });

    return (
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh ref={cardRef} position={[index * 2.5 - 2.5, 0, 0]}>
          <boxGeometry args={[2, 1.5, 0.2]} />
          <meshStandardMaterial 
            color="#1f2937"
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.95}
          />
          <Text
            position={[0, 0.4, 0.11]}
            fontSize={0.25}
            color="#f97316"
            anchorX="center"
            anchorY="middle"
          >
            {price}
          </Text>
          <Text
            position={[0, 0, 0.11]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {volume}
          </Text>
        </mesh>
      </Float>
    );
  };

  // GSAP Scroll Animations
  useEffect(() => {
    gsap.fromTo(
      '.hero-title',
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      }
    );

    gsap.fromTo(
      '.pricing-card',
      { opacity: 0, scale: 0.8, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.pricing-section',
          start: 'top 80%'
        }
      }
    );

    gsap.fromTo(
      '.feature-card',
      { opacity: 0, rotationY: 90 },
      {
        opacity: 1,
        rotationY: 0,
        duration: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 85%'
        }
      }
    );
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Quote request:', formData);
    alert('Thank you! We will contact you shortly with your free quote.');
    setShowQuoteModal(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      businessType: 'Amazon Seller',
      message: ''
    });
  };

  return (
    <WebsiteLayout>
      {/* 3D Hero Section with Floating Orb */}
      <section className="relative bg-gradient-to-b from-black via-gray-900 to-black py-24 text-center overflow-hidden">
        {/* 3D Canvas Background */}
        <div className="absolute inset-0 w-full h-[600px] pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <PricingOrb />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          </Canvas>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-block bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/40 px-8 py-3 rounded-3xl mb-8 transform transition-all duration-500 hover:scale-105 cursor-default shadow-2xl">
            <span className="text-orange-400 font-bold tracking-wider text-lg flex items-center gap-2">
              💰 <span>TRANSPARENT 3D PRICING EXPERIENCE</span>
            </span>
          </div>
          
          <h1 className="hero-title text-5xl md:text-7xl font-black text-white mb-8 drop-shadow-2xl leading-tight">
            PeaknizerLogistics <br className="md:hidden"/>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
              3D Fulfillment Pricing
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12 px-4">
            🚀 Experience our cutting-edge 3D pricing interface. 
            Arlington's premier FBA & FBM prep center with real-time 3D visualization.
          </p>
          
          <div className="relative inline-block">
            <div className="bg-gradient-to-br from-gray-900/90 to-black/70 backdrop-blur-xl border-2 border-orange-500/50 p-8 rounded-3xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 hover:-translate-y-2 group">
              <p className="text-white font-bold text-xl mb-2 flex items-center justify-center gap-3">
                📍 <span>2503D N Harrison St, Arlington, VA 22207</span>
              </p>
              <p className="text-orange-400 text-lg group-hover:scale-105 transition-transform">
                Fully equipped 3D logistics powerhouse
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Pricing Cards Section */}
      <section className="py-24 bg-gradient-to-b from-gray-950 to-black relative overflow-hidden pricing-section">
        <div className="absolute inset-0">
          <Canvas className="w-full h-full" camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} intensity={1} color="#f97316" />
            <PricingCard3D title="Starter" price="$3.00" volume="100-999" index={0} />
            <PricingCard3D title="Growth" price="$2.50" volume="1K+" index={1} />
            <PricingCard3D title="Scale" price="$2.00" volume="10K+" index={2} />
          </Canvas>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">
              🔹 FBM Fulfillment
            </h2>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
              Watch our 3D pricing cards float above. <br/>
              <span className="text-orange-400 font-bold">Same-Day • No Storage • No Returns</span>
            </p>
          </div>

          {/* Static Pricing Table with 3D Effects */}
          <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-orange-500/30 hover:border-orange-500/50 transition-all duration-500 transform hover:-rotate-x-2 hover:-rotate-y-1 origin-center">
            <div className="bg-gradient-to-r from-orange-600/90 to-orange-400/90 backdrop-blur-xl p-8 relative">
              <h3 className="text-3xl font-black text-black text-center uppercase tracking-widest relative z-10">
                Interactive 3D Volume Pricing
              </h3>
            </div>
            <div className="p-8 bg-gradient-to-b from-transparent to-black/50">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                {[
                  { vol: "100–999 Orders", price: "$3.00", badge: "Starter" },
                  { vol: "1,000+ Orders", price: "$2.50", badge: "Growth" },
                  { vol: "10,000+ Orders", price: "$2.00", badge: "Scale" }
                ].map((plan, idx) => (
                  <div key={idx} className="pricing-card group">
                    <div className="h-32 bg-gradient-to-b from-orange-500/20 to-transparent rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <div className="space-y-2">
                      <span className="block text-sm text-orange-400 font-bold uppercase tracking-wider">{plan.badge}</span>
                      <h4 className="text-2xl font-black text-white">{plan.vol}</h4>
                      <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-lg">
                        {plan.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Feature Cards */}
      <section className="py-24 bg-black/50 border-t border-orange-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-6">
              <span className="text-orange-500 drop-shadow-2xl">⚙️ 3D Features</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience our services in immersive 3D detail
            </p>
          </div>

          <div className="features-grid grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: "✅", title: "Same-Day Fulfillment", desc: "Lightning fast processing" },
              { icon: "📦", title: "No Storage Fees", desc: "First 30 days FREE" },
              { icon: "🔄", title: "No Return Charges", desc: "Hassle-free returns" }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="feature-card group relative bg-gradient-to-br from-gray-900/80 to-black/50 backdrop-blur-xl p-10 rounded-3xl border border-gray-700/50 shadow-2xl hover:shadow-orange-500/25 hover:-translate-y-4 hover:rotate-1 transition-all duration-700 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="text-5xl mb-6 transform group-hover:scale-125 transition-transform duration-500 group-hover:rotate-12">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FBA Prep Services with 3D Tilt Cards */}
      <section className="py-24 bg-gradient-to-b from-gray-950 to-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-8">
              <span className="text-orange-500 drop-shadow-2xl">🔹 FBA Prep Services</span>
            </h2>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
              Amazon-compliant 3D prep services starting at <span className="text-orange-400 font-black text-3xl">$0.60/unit</span>
            </p>
          </div>

          <div className="max-w-4xl mx-auto transform hover:-rotate-x-1 hover:-rotate-y-1 transition-transform duration-500">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border-2 border-orange-500/30 hover:border-orange-500/60">
              <div className="bg-gradient-to-r from-orange-600 to-orange-400 p-8 backdrop-blur-xl">
                <h3 className="text-3xl font-black text-black text-center uppercase tracking-widest">3D Prep Pricing Matrix</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/60">
                    <tr>
                      <th className="px-8 py-6 text-left text-orange-400 font-black uppercase">Volume</th>
                      <th className="px-8 py-6 text-center text-orange-400 font-black uppercase">Basic Prep</th>
                      <th className="px-8 py-6 text-right text-orange-400 font-black uppercase">Box Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-500/20">
                    <tr className="hover:bg-orange-500/10 transition-colors h-20">
                      <td className="px-8 py-8 text-white font-bold text-xl">100 Units</td>
                      <td className="px-8 py-8 text-center text-3xl font-black text-orange-400">$0.60</td>
                      <td className="px-8 py-8 text-right text-3xl font-black text-orange-400">$2.00</td>
                    </tr>
                    <tr className="hover:bg-orange-500/10 transition-colors h-20">
                      <td className="px-8 py-8 text-white font-bold text-xl">100–500 Units</td>
                      <td className="px-8 py-8 text-center text-3xl font-black text-orange-400">$0.55</td>
                      <td className="px-8 py-8 text-right text-orange-300 font-bold italic">Custom</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with 3D Button */}
      <section className="py-32 bg-gradient-to-t from-gray-900/50 via-black to-gray-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-700/20 [background-size:100px_100px] animate-pulse" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block">
            <h2 className="text-6xl md:text-7xl font-black text-white mb-8 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl">
              🚀 Ready to Scale?
            </h2>
            <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Experience 3D pricing that moves with you
            </p>
            
            <button
              onClick={() => setShowQuoteModal(true)}
              className="group relative bg-gradient-to-r from-orange-500 to-orange-600 text-black px-12 py-8 rounded-3xl font-black text-2xl shadow-2xl hover:shadow-orange-500/50 transform transition-all duration-500 hover:scale-110 hover:-rotate-3 active:scale-105 inline-flex items-center gap-4 overflow-hidden"
            >
              <span className="relative z-10">💰 3D Quote Calculator</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          </button>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto opacity-80">
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-orange-500/30 hover:border-orange-500/60 transition-all duration-300">
              <p className="text-gray-400 text-sm mb-2">📍 3D Location</p>
              <p className="text-white font-bold text-xl">2503D N Harrison St<br/>Arlington, VA 22207</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-orange-500/30 hover:border-orange-500/60 transition-all duration-300">
              <p className="text-gray-400 text-sm mb-2">📧 3D Contact</p>
              <p className="text-white font-bold text-xl break-words">info@peaknizer<br/>logistics.com</p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-orange-500/30 hover:border-orange-500/60 transition-all duration-300">
              <p className="text-gray-400 text-sm mb-2">📞 24/7 Support</p>
              <p className="text-white font-bold text-2xl">+1 571-307-4461</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced 3D Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl flex items-center justify-center z-[9999] p-6">
          <div className="w-full max-w-2xl mx-auto">
            {/* 3D Modal Container with GSAP Animation */}
            <div className="relative bg-gradient-to-br from-gray-900/95 via-black/80 to-gray-900/95 backdrop-blur-3xl rounded-4xl border-4 border-orange-500/60 shadow-[0_35px_100px_-15px_rgba(249,115,22,0.6)] overflow-hidden group hover:shadow-[0_45px_120px_-20px_rgba(249,115,22,0.8)] transition-all duration-700 transform scale-100 hover:scale-[1.02]">
              
              {/* Animated Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-600/10 opacity-75 animate-pulse" />
              
              {/* Floating Particles */}
              <div className="absolute top-4 right-4 w-32 h-32 bg-orange-500/20 rounded-full blur-xl animate-ping" />
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-orange-400/20 rounded-full blur-2xl animate-pulse delay-1000" />

              <div className="relative z-10 p-10">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <span className="text-2xl font-black text-black">📊</span>
                    </div>
                    <div>
                      <h3 className="text-4xl font-black bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                        3D Quote Calculator
                      </h3>
                      <p className="text-orange-400 font-bold text-lg">Get instant pricing visualization</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowQuoteModal(false)}
                    className="group text-gray-400 hover:text-white hover:bg-white/10 p-4 rounded-3xl transition-all duration-300 hover:scale-110 hover:rotate-180 text-2xl w-16 h-16 flex items-center justify-center backdrop-blur-xl"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group relative">
                      <label className="block text-gray-300 font-bold mb-3 text-lg flex items-center gap-2">
                        👤 Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-5 bg-white/5 border-2 border-gray-700/50 rounded-3xl text-white font-semibold text-lg backdrop-blur-xl focus:outline-none focus:border-orange-500/80 focus:ring-4 focus:ring-orange-500/30 transition-all duration-500 hover:border-orange-400/60 group-hover:scale-[1.02]"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="group relative">
                      <label className="block text-gray-300 font-bold mb-3 text-lg flex items-center gap-2">
                        📱 Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-5 bg-white/5 border-2 border-gray-700/50 rounded-3xl text-white font-semibold text-lg backdrop-blur-xl focus:outline-none focus:border-orange-500/80 focus:ring-4 focus:ring-orange-500/30 transition-all duration-500 hover:border-orange-400/60 group-hover:scale-[1.02]"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <label className="block text-gray-300 font-bold mb-3 text-lg flex items-center gap-2">
                      ✉️ Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-5 bg-white/5 border-2 border-gray-700/50 rounded-3xl text-white font-semibold text-lg backdrop-blur-xl focus:outline-none focus:border-orange-500/80 focus:ring-4 focus:ring-orange-500/30 transition-all duration-500 hover:border-orange-400/60 group-hover:scale-[1.02]"
                      placeholder="your.email@domain.com"
                    />
                  </div>
                  
                  <div className="group relative">
                    <label className="block text-gray-300 font-bold mb-3 text-lg flex items-center gap-2">
                      🏪 Business Type
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className="w-full px-6 py-5 bg-white/5 border-2 border-gray-700/50 rounded-3xl text-white font-semibold text-lg backdrop-blur-xl appearance-none focus:outline-none focus:border-orange-500/80 focus:ring-4 focus:ring-orange-500/30 transition-all duration-500 hover:border-orange-400/60 cursor-pointer group-hover:scale-[1.02]"
                    >
                      <option className="bg-gray-900 text-white">Amazon FBA Seller</option>
                      <option className="bg-gray-900 text-white">Shopify Store Owner</option>
                      <option className="bg-gray-900 text-white">Etsy Seller</option>
                      <option className="bg-gray-900 text-white">WooCommerce Merchant</option>
                      <option className="bg-gray-900 text-white">DTC Brand</option>
                      <option className="bg-gray-900 text-white">Other E-commerce</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-orange-500 text-2xl">
                      ▼
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <label className="block text-gray-300 font-bold mb-3 text-lg flex items-center gap-2">
                      💬 Special Requirements
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      className="w-full px-6 py-5 bg-white/5 border-2 border-gray-700/50 rounded-3xl text-white font-semibold text-lg backdrop-blur-xl focus:outline-none focus:border-orange-500/80 focus:ring-4 focus:ring-orange-500/30 transition-all duration-500 resize-vertical hover:border-orange-400/60 group-hover:scale-[1.02]"
                      placeholder="Tell us about your inventory volume, special packaging needs, or 3D visualization requirements..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="group w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-black py-8 rounded-4xl font-black text-2xl shadow-2xl hover:shadow-orange-500/60 transform transition-all duration-500 hover:scale-[1.05] hover:-translate-y-1 active:scale-[0.98] relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      🚀 Calculate 3D Pricing Now
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes popIn {
          0% { 
            opacity: 0; 
            transform: scale(0.7) translateY(50px) rotateX(90deg); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0) rotateX(0deg); 
          }
        }
        
        .animate-[popIn_0.5s_ease-out] {
          animation: popIn 0.5s ease-out forwards;
        }
        
        .bg-grid-slate-700\/20 {
          background-image: 
            linear-gradient(rgba(148, 163, 184, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px);
        }
      `}</style>
    </WebsiteLayout>
  );
};

export default PricingPage;