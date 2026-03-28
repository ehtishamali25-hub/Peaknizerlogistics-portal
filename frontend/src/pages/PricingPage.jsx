import WebsiteLayout from './WebsiteLayout';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, MeshReflectorMaterial } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const PricingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'Amazon Seller',
    message: ''
  });
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // 3D Pricing Orb Component
  const PricingOrb = () => {
    const meshRef = useRef();
    
    useFrame((state) => {
      meshRef.current.rotation.y += 0.008;
      meshRef.current.rotation.x += 0.003;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
    });

    return (
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh ref={meshRef} scale={1.2}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            metalness={0.85}
            roughness={0.15}
            color="#f97316"
            emissive="#ea580c"
            emissiveIntensity={0.4}
          />
        </mesh>
        <Text
          position={[0, 0, 1.6]}
          fontSize={0.35}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          $2.00
        </Text>
      </Float>
    );
  };

  // 3D Floating Pricing Cards
  const PricingCard3D = ({ title, price, volume, index }) => {
    const cardRef = useRef();
    
    useFrame((state) => {
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.2 + index * 2) * 0.15;
      cardRef.current.position.y = Math.cos(state.clock.elapsedTime * 1.8 + index) * 0.1;
    });

    return (
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh ref={cardRef} position={[index * 3.2 - 3.2, 0, 0]}>
          <boxGeometry args={[2.2, 1.6, 0.15]} />
          <meshStandardMaterial 
            color="#1f2937"
            metalness={0.8}
            roughness={0.25}
            envMapIntensity={1}
          />
          <Text
            position={[0, 0.5, 0.08]}
            fontSize={0.28}
            color="#f97316"
            anchorX="center"
            anchorY="middle"
          >
            {price}
          </Text>
          <Text
            position={[0, -0.3, 0.08]}
            fontSize={0.16}
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
    // Hero animations
    gsap.fromTo(
      '.hero-title > *',
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.3,
        ease: 'power3.out'
      }
    );

    // Feature cards
    gsap.fromTo(
      '.feature-card',
      { opacity: 0, scale: 0.8, rotationY: 90 },
      {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 85%'
        }
      }
    );

    // Pricing cards
    gsap.fromTo(
      '.pricing-card',
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.pricing-grid',
          start: 'top 80%'
        }
      }
    );

    // Tables
    gsap.fromTo(
      '.pricing-table',
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.3,
        scrollTrigger: {
          trigger: '.pricing-table',
          start: 'top 85%'
        }
      }
    );

    // CTA section
    gsap.fromTo(
      '.cta-content',
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 80%'
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
      {/* 3D Hero Section */}
      <section className="relative bg-gradient-to-b from-black via-gray-950 to-black py-24 text-center overflow-hidden">
        {/* 3D Canvas Background */}
        <div className="absolute inset-0 w-full h-[700px] pointer-events-none">
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.2} />
            <pointLight position={[-10, -10, -10]} color="#f97316" intensity={0.8} />
            <PricingOrb />
            <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="inline-block bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-xl border-2 border-orange-500/40 px-8 py-4 rounded-3xl mb-8 shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 hover:scale-105 cursor-default">
            <span className="text-orange-400 font-bold tracking-wider text-xl flex items-center gap-3">
              💰 <span>TRANSPARENT 3D PRICING</span>
            </span>
          </div>
          
          <h1 className="hero-title text-5xl md:text-7xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
            PeaknizerLogistics Fulfillment Pricing
            <br className="md:hidden" />
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-4xl md:text-6xl">
              Transparent. Affordable. Scalable.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12 px-6">
            🚀 Welcome to Peaknizer Logistics, Arlington's premier FBA & FBM prep center—designed to power your e-commerce growth without breaking the bank.
          </p>
          
          <div className="inline-block bg-gray-900/80 backdrop-blur-2xl border-2 border-orange-500/50 p-8 rounded-3xl shadow-2xl hover:shadow-[0_25px_50px_-10px_rgba(249,115,22,0.4)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">
            <p className="text-white font-bold text-2xl mb-3 flex items-center justify-center gap-3">
              📍 2503D N Harrison St, Arlington, VA, 22207
            </p>
            <p className="text-lg text-gray-300">Fully equipped to handle everything from Amazon FBA prep to Shopify order fulfillment.</p>
          </div>
        </div>
      </section>

      {/* Value Proposition - 3D Tilt Card */}
      <section className="py-16 bg-black/50 relative z-20">
        <div className="container mx-auto px-4">
          <div className="group bg-gradient-to-br from-gray-950/90 to-black/70 backdrop-blur-2xl p-12 rounded-4xl border-4 border-orange-500/40 shadow-[0_20px_60px_-15px_rgba(249,115,22,0.3)] max-w-5xl mx-auto text-center transform transition-all duration-700 hover:scale-[1.02] hover:rotate-1 hover:shadow-[0_30px_80px_-20px_rgba(249,115,22,0.5)] hover:border-orange-500/70 cursor-grab active:cursor-grabbing">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
              ⚙️ Simple, Straightforward Pricing
            </h2>
            <p className="text-3xl text-orange-400 font-black mb-6 tracking-wide bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              Most Cheapest, But Provides Premium Quality
            </p>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              No Surprises, Just Solutions – Transparent rates from day one
            </p>
          </div>
        </div>
      </section>

      {/* FBM Fulfillment - 3D Pricing Cards */}
      <section className="py-24 bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <Canvas className="w-full h-full" camera={{ position: [0, 0, 10] }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} intensity={1.5} color="#f97316" />
            <PricingCard3D vol="100–999 Orders" price="$3.00" index={0} />
            <PricingCard3D vol="1,000+ Orders" price="$2.50" index={1} />
            <PricingCard3D vol="10,000+ Orders" price="$2.00" index={2} />
          </Canvas>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.7)]">🔹 FBM Fulfillment</span>
              <br className="md:hidden" /> From Just $3 per Order
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              Ideal for Shopify, Etsy, and WooCommerce Sellers
            </p>
          </div>

          <div className="features-grid grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            {[
              { icon: "✅", title: "Same-Day Fulfillment" },
              { icon: "📦", title: "No Storage Fees" },
              { icon: "🔄", title: "No Return Processing Charges" }
            ].map((feature, idx) => (
              <div key={idx} className="feature-card bg-gray-900/80 backdrop-blur-xl p-10 rounded-4xl border border-gray-700/50 shadow-2xl hover:shadow-[0_25px_60px_-15px_rgba(249,115,22,0.4)] hover:border-orange-500/60 hover:-translate-y-4 hover:rotate-3 transition-all duration-700 text-center group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="relative z-10">
                  <div className="text-6xl mb-8 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">{feature.icon}</div>
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-orange-400 transition-colors">{feature.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* 3D Pricing Table */}
          <div className="pricing-table max-w-5xl mx-auto bg-white/5 backdrop-blur-3xl rounded-4xl overflow-hidden shadow-[0_35px_80px_-20px_rgba(0,0,0,0.8)] border-2 border-orange-500/40 hover:border-orange-500/70 transition-all duration-700 hover:shadow-[0_45px_100px_-25px_rgba(249,115,22,0.3)] transform hover:-translate-y-2">
            <div className="bg-gradient-to-r from-orange-600/95 to-orange-400/95 backdrop-blur-xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent opacity-50" />
              <h3 className="text-3xl font-black text-black text-center uppercase tracking-widest relative z-10">
                Monthly Volume Pricing
              </h3>
            </div>
            <div className="p-10">
              <table className="w-full pricing-grid">
                <thead className="bg-black/70 backdrop-blur-sm">
                  <tr>
                    <th className="px-10 py-8 text-left text-gray-200 font-black text-xl uppercase tracking-wider">Monthly Volume</th>
                    <th className="px-10 py-8 text-right text-gray-200 font-black text-xl uppercase">Price per Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-500/20">
                  {[
                    { vol: "100–999 Orders", price: "$3.00" },
                    { vol: "1,000+ Orders", price: "$2.50" },
                    { vol: "10,000+ Orders", price: "$2.00" }
                  ].map((row, idx) => (
                    <tr key={idx} className="pricing-card group h-24 hover:bg-orange-500/10 transition-all duration-500">
                      <td className="px-10 py-8 text-white font-bold text-2xl">{row.vol}</td>
                      <td className="px-10 py-8 text-right">
                        <span className="text-4xl font-black bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl group-hover:scale-110 transition-transform origin-right">
                          {row.price}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FBA Prep Services */}
      <section className="py-24 bg-black border-t-4 border-gray-900/50 border-orange-500/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-8">
              <span className="text-orange-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]">🔹 FBA Prep Services</span> – Amazon-Ready, Done Right
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto mb-16">
              Our Amazon-compliant services include inspection, labeling, polybagging, bundling, and more—starting at just{' '}
              <span className="text-orange-400 font-black text-4xl">$0.60/unit!</span>
            </p>
          </div>

          <div className="pricing-table max-w-5xl mx-auto bg-gray-950/90 backdrop-blur-3xl rounded-4xl overflow-hidden shadow-[0_35px_80px_-20px_rgba(0,0,0,0.9)] border-2 border-gray-800/50 hover:border-orange-500/60 transition-all duration-700 hover:shadow-[0_45px_100px_-25px_rgba(249,115,22,0.25)] mb-12 transform hover:-translate-y-2">
            <div className="bg-gradient-to-r from-orange-600 to-orange-400 p-8 backdrop-blur-xl">
              <h3 className="text-3xl font-black text-black text-center uppercase tracking-widest">Prep Service Rates</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-black/70 backdrop-blur-sm">
                  <tr>
                    <th className="px-10 py-8 text-left text-gray-200 font-black uppercase text-lg">Volume</th>
                                        <th className="px-10 py-8 text-center text-gray-200 font-black uppercase text-lg">Without Polybag</th>
                    <th className="px-10 py-8 text-right text-gray-200 font-black uppercase text-lg">With Box Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  <tr className="transition-all duration-500 hover:bg-orange-500/10 h-24">
                    <td className="px-10 py-10 text-white font-bold text-2xl">100 Units</td>
                    <td className="px-10 py-10 text-center">
                      <span className="text-3xl font-black text-orange-400">$0.60/unit</span>
                    </td>
                    <td className="px-10 py-10 text-right">
                      <span className="text-3xl font-black text-orange-400">$2.00/unit</span>
                    </td>
                  </tr>
                  <tr className="transition-all duration-500 hover:bg-orange-500/10 h-24">
                    <td className="px-10 py-10 text-white font-bold text-2xl">100–500 Units</td>
                    <td className="px-10 py-10 text-center">
                      <span className="text-3xl font-black text-orange-400">$0.55/unit</span>
                    </td>
                    <td className="px-10 py-10 text-right text-gray-400 font-bold italic text-xl">Upon Request</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center space-y-4 bg-gradient-to-r from-gray-950/80 to-black/50 backdrop-blur-xl py-8 px-12 rounded-4xl max-w-3xl mx-auto border-2 border-orange-500/40 shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 hover:scale-105">
            <p className="text-orange-500 font-black text-2xl flex items-center justify-center gap-4">
              🛑 No storage fees for first 30 days
            </p>
            <p className="text-orange-500 font-black text-2xl flex items-center justify-center gap-4">
              🛑 No hidden charges
            </p>
          </div>
        </div>
      </section>

      {/* Bundling Services - 3D Dual Cards */}
      <section className="py-24 bg-gradient-to-b from-gray-950 to-black/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-8">
              <span className="text-orange-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]">🔹 Bundling Services</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-16">
              From multi-packs to variety packs, we handle it all!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Standard Bundling */}
            <div className="group relative bg-gray-900/80 backdrop-blur-2xl p-12 rounded-4xl border-2 border-gray-700/50 shadow-2xl hover:shadow-[0_30px_70px_-15px_rgba(249,115,22,0.4)] hover:border-orange-500/70 hover:-translate-y-4 hover:rotate-2 transition-all duration-800 overflow-hidden cursor-grab active:cursor-grabbing">
              <div className="absolute top-0 left-0 w-4 h-full bg-gradient-to-b from-orange-500 to-orange-400" />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-800" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white mb-8">
                  Standard Bundling <span className="text-lg font-normal text-gray-400 block mt-2">(Under 11 lbs)</span>
                </h3>
                <ul className="space-y-6">
                  <li className="flex justify-between items-center text-gray-300 py-4 border-b border-gray-700/50 group-hover:text-white transition-colors">
                    <span className="text-xl font-semibold">Pack of 2 (Same SKU):</span>
                    <span className="text-orange-400 font-black text-3xl bg-gray-950/80 px-6 py-3 rounded-2xl shadow-lg border border-orange-500/30">$1.00</span>
                  </li>
                  <li className="flex justify-between items-center text-gray-300 py-4 border-b border-gray-700/50 group-hover:text-white transition-colors">
                    <span className="text-xl font-semibold">Additional (Same SKU):</span>
                    <span className="text-orange-400 font-black text-3xl bg-gray-950/80 px-6 py-3 rounded-2xl shadow-lg border border-orange-500/30">$0.30</span>
                  </li>
                  <li className="flex justify-between items-center text-gray-300 py-4 group-hover:text-white transition-colors">
                    <span className="text-xl font-semibold">Different SKU:</span>
                    <span className="text-orange-400 font-black text-2xl bg-gray-950/80 px-6 py-3 rounded-2xl shadow-lg border border-orange-500/30">From $1.50</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Oversized Bundling */}
            <div className="group relative bg-gray-900/80 backdrop-blur-2xl p-12 rounded-4xl border-2 border-gray-700/50 shadow-2xl hover:shadow-[0_30px_70px_-15px_rgba(249,115,22,0.4)] hover:border-orange-500/70 hover:-translate-y-4 hover:rotate-2 transition-all duration-800 overflow-hidden cursor-grab active:cursor-grabbing">
              <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-b from-orange-600 to-orange-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-800" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white mb-8">
                  Oversized Bundling <span className="text-lg font-normal text-gray-400 block mt-2">(11+ lbs)</span>
                </h3>
                <ul className="space-y-6">
                  <li className="flex justify-between items-center text-gray-300 py-4 border-b border-gray-700/50 group-hover:text-white transition-colors">
                    <span className="text-xl font-semibold">Under 20 lbs:</span>
                    <span className="text-orange-400 font-black text-3xl bg-gray-950/80 px-6 py-3 rounded-2xl shadow-lg border border-orange-500/30">$2.50</span>
                  </li>
                  <li className="flex justify-between items-center text-gray-300 py-4 border-b border-gray-700/50 group-hover:text-white transition-colors">
                    <span className="text-xl font-semibold">20–30 lbs:</span>
                    <span className="text-orange-400 font-black text-3xl bg-gray-950/80 px-6 py-3 rounded-2xl shadow-lg border border-orange-500/30">$3.50</span>
                  </li>
                  <li className="flex justify-between items-center text-gray-300 py-4 group-hover:text-white transition-colors">
                    <span className="text-xl font-semibold">30+ lbs:</span>
                    <span className="text-orange-400 font-black text-3xl bg-gray-950/80 px-6 py-3 rounded-2xl shadow-lg border border-orange-500/30">$4.50</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-On Services - 3D Grid */}
      <section className="py-24 bg-gradient-to-b from-black/70 to-gray-950">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-black text-center text-white mb-20">
            <span className="text-orange-500 drop-shadow-[0_0_25px_rgba(249,115,22,0.8)]">🔹 Add-On Services</span> – Customize Your Prep!
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              { service: "Sticker/Tag Removal", price: "$0.30/unit" },
              { service: "Expiry Date Label", price: "$0.20/unit" },
              { service: "Promo Inserts", price: "$0.10/unit" },
              { service: "Liquid Induction Seal", price: "$0.50/unit" },
              { service: "Pro Product Photos", price: "$35 (5 photos)" },
            ].map((item, index) => (
              <div key={index} className="group relative bg-gradient-to-br from-gray-900/90 to-black/70 backdrop-blur-xl p-10 rounded-4xl border-2 border-gray-700/50 shadow-xl hover:shadow-[0_25px_60px_-15px_rgba(249,115,22,0.4)] hover:border-orange-500/70 hover:-translate-y-4 hover:scale-105 hover:rotate-1 transition-all duration-700 cursor-grab active:cursor-grabbing overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="relative z-10 flex justify-between items-center h-full">
                  <span className="text-gray-200 font-bold text-xl md:text-2xl leading-tight">{item.service}</span>
                  <span className="text-orange-400 font-black text-2xl md:text-3xl bg-black/60 backdrop-blur-xl px-8 py-4 rounded-3xl border-2 border-orange-500/40 shadow-2xl group-hover:shadow-orange-500/50 group-hover:scale-110 transition-all duration-500">
                    {item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packaging & Storage - 3D Dual Tables */}
      <section className="py-24 bg-gradient-to-b from-black/50 via-gray-950 to-black">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            
            {/* Packaging Materials */}
            <div className="group">
              <h2 className="text-4xl font-black text-white mb-12 flex items-center gap-6 justify-center">
                <span className="text-5xl">📦</span>
                <span className="text-orange-500 drop-shadow-xl">Packaging Materials</span>
              </h2>
              <div className="bg-gray-950/90 backdrop-blur-3xl rounded-4xl overflow-hidden border-2 border-gray-800/50 shadow-2xl hover:shadow-[0_30px_70px_-20px_rgba(249,115,22,0.3)] hover:border-orange-500/60 transition-all duration-700 hover:-translate-y-2">
                <table className="w-full">
                  <thead className="bg-black/80 backdrop-blur-sm">
                    <tr>
                      <th className="px-8 py-6 text-left text-orange-400 font-black text-lg uppercase tracking-wider">Type</th>
                      <th className="px-8 py-6 text-left text-orange-400 font-black text-lg uppercase tracking-wider">Size</th>
                      <th className="px-8 py-6 text-right text-orange-400 font-black text-lg uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {[
                      { type: "Poly Bags", size: "Small to XL", price: "$0.40 – $0.70" },
                      { type: "Shrink Wrap", size: "Small to Standard", price: "$0.40 – $0.30" },
                      { type: "Bubble Wrap", size: "Small to Large", price: "$0.40 – $0.70" },
                      { type: "Fragile Wrap", size: "–", price: "$1.50" },
                      { type: "Shipping Boxes", size: "Small to Custom", price: "$2.00 – $4.50" },
                    ].map((item, index) => (
                      <tr key={index} className="hover:bg-orange-500/10 transition-all duration-300 h-20">
                        <td className="px-8 py-6 text-gray-200 font-bold text-xl">{item.type}</td>
                        <td className="px-8 py-6 text-gray-400 text-lg">{item.size}</td>
                        <td className="px-8 py-6 text-right text-orange-400 font-black text-2xl">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Storage & Handling */}
            <div className="group">
              <h2 className="text-4xl font-black text-white mb-12 flex items-center gap-6 justify-center">
                <span className="text-5xl">🏷️</span>
                <span className="text-orange-500 drop-shadow-xl">Storage & Handling</span>
              </h2>
              <div className="bg-gray-950/90 backdrop-blur-3xl rounded-4xl overflow-hidden border-2 border-gray-800/50 shadow-2xl hover:shadow-[0_30px_70px_-20px_rgba(249,115,22,0.3)] hover:border-orange-500/60 transition-all duration-700 hover:-translate-y-2">
                <table className="w-full">
                  <thead className="bg-black/80 backdrop-blur-sm">
                    <tr>
                      <th className="px-8 py-6 text-left text-orange-400 font-black text-lg uppercase tracking-wider">Type</th>
                      <th className="px-8 py-6 text-right text-orange-400 font-black text-lg uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {[
                      { type: "Standard Pallet (Monthly)", price: "$30/pallet" },
                      { type: "Small Box Storage", price: "$2.00/box" },
                      { type: "Carton Handling (<30 lbs)", price: "$2.95 – $4.95" },
                      { type: "Pallet Shrink Wrap", price: "$25/pallet" },
                    ].map((item, index) => (
                      <tr key={index} className="hover:bg-orange-500/10 transition-all duration-300 h-20">
                        <td className="px-8 py-8 text-gray-200 font-bold text-xl">{item.type}</td>
                        <td className="px-8 py-8 text-right text-orange-400 font-black text-2xl">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - 3D Feature Grid */}
      <section className="py-24 bg-black/70 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 relative z-20">
          <h2 className="text-5xl font-black text-center text-white mb-20 leading-tight">
            🌟 Why E-Commerce Sellers Choose{' '}
            <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 block md:inline">
              PeaknizerLogistics
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
            {[
              "Same-Day Shipping",
              "Transparent, Startup-Friendly Pricing",
              "No Long-Term Contracts",
              "Houston-Based, Prime U.S. Location",
              "100% Amazon-Compliant Processes",
            ].map((item, index) => (
              <div key={index} className="group bg-gray-950/80 backdrop-blur-xl p-10 rounded-4xl border-2 border-gray-800/50 shadow-xl hover:shadow-[0_25px_60px_-15px_rgba(249,115,22,0.4)] hover:border-orange-500/70 hover:-translate-y-6 hover:rotate-3 transition-all duration-700 flex items-start gap-6 cursor-grab active:cursor-grabbing overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <span className="bg-gradient-to-r from-orange-500/30 to-orange-600/30 p-4 rounded-3xl text-orange-500 text-3xl shrink-0 relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">✅</span>
                <p className="text-white font-bold text-xl md:text-2xl leading-relaxed pt-2 relative z-10">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center bg-gray-950/80 backdrop-blur-3xl p-12 rounded-4xl max-w-5xl mx-auto border-4 border-orange-500/40 shadow-2xl hover:shadow-[0_35px_80px_-20px_rgba(249,115,22,0.4)] hover:border-orange-500/70 transition-all duration-700 hover:-translate-y-2 hover:scale-[1.02]">
            <p className="text-2xl md:text-3xl font-black text-white mb-12 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              🎯 Perfect Ecosystem For:
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              {["Amazon FBA Sellers", "Shopify & Etsy Store Owners", "DTC Brands Scaling Up", "Retailers Outsourcing Logistics"].map((item, index) => (
                <span key={index} className="group bg-gradient-to-r from-gray-900/80 to-black/60 text-orange-400 px-8 py-6 rounded-3xl text-lg font-bold border-2 border-orange-500/40 shadow-xl backdrop-blur-xl hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] hover:border-orange-500/70 hover:scale-110 hover:rotate-5 transition-all duration-500 cursor-grab active:cursor-grabbing">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3D Contact & CTA */}
      <section className="cta-section py-32 bg-gradient-to-t from-gray-950/70 via-black/50 to-gray-950/70 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.03] [background-size:100px_100px] animate-pulse" />
        <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 via-transparent to-black/50" />
        
        <div className="container mx-auto px-4 text-center relative z-20">
          <div className="cta-content inline-block">
            <h2 className="text-6xl md:text-8xl font-black text-white mb-12 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
              📞 Let's Get You Started Today!
            </h2>
            <p className="text-xl md:text-3xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
              Got 100 units or 10,000? We scale with you seamlessly.
            </p>
          </div>
          
          <div className="group relative bg-gray-950/90 backdrop-blur-3xl p-16 rounded-4xl max-w-5xl mx-auto border-4 border-orange-500/50 shadow-[0_0_80px_rgba(249,115,22,0.2)] hover:shadow-[0_0_120px_rgba(249,115,22,0.4)] transition-all duration-1000 hover:-translate-y-4 hover:scale-[1.02] overflow-hidden cursor-grab active:cursor-grabbing">
            {/* Animated 3D Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-orange-400/10 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-all duration-1000 -translate-x-full group-hover:translate-x-full" />
            
            <div className="grid md:grid-cols-3 gap-8 mb-16 text-left">
              <div className="group relative bg-black/50 backdrop-blur-xl p-8 rounded-3xl border-2 border-gray-800/50 hover:border-orange-500/60 hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.3)] hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                <p className="text-gray-500 text-sm font-bold mb-3 uppercase tracking-wider">📍 Location</p>
                <p className="text-white font-bold text-xl leading-tight">2503D N Harrison St,<br/>Arlington, VA 22207</p>
              </div>
              <div className="group relative bg-black/50 backdrop-blur-xl p-8 rounded-3xl border-2 border-gray-800/50 hover:border-orange-500/60 hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.3)] hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                <p className="text-gray-500 text-sm font-bold mb-3 uppercase tracking-wider">📧 Email Us</p>
                <p className="text-white font-bold text-xl leading-tight break-words">info@peaknizer<br/>logistics.com</p>
              </div>
              <div className="group relative bg-black/50 backdrop-blur-xl p-8 rounded-3xl border-2 border-gray-800/50 hover:border-orange-500/60 hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.3)] hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                <p className="text-gray-500 text-sm font-bold mb-3 uppercase tracking-wider">📞 Call Us</p>
                <p className="text-white font-bold text-3xl">+1 571-307-4461</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowQuoteModal(true)}
              className="group relative w-full md:w-auto bg-gradient-to-r from-orange-500 to-orange-700 text-black px-16 py-8 rounded-4xl font-black text-2xl shadow-2xl hover:shadow-[0_30px_60px_-15px_rgba(249,115,22,0.6)] hover:from-orange-400 hover:to-orange-600 transform transition-all duration-700 hover:scale-[1.08] hover:-translate-y-3 active:scale-[1.02] inline-flex items-center justify-center gap-6 overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <span className="relative z-10">💰 GET FREE PRICE QUOTE INSTANTLY</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </section>

      {/* 3D Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl flex items-center justify-center z-[9999] p-8 animate-[popInModal_0.6s_ease-out]">
          <div className="w-full max-w-4xl mx-auto relative">
            <div className="group relative bg-gradient-to-br from-gray-950/98 via-black/90 to-gray-950/98 backdrop-blur-3xl rounded-4xl border-4 border-orange-500/70 shadow-[0_50px_120px_-25px_rgba(249,115,22,0.5)] overflow-hidden hover:shadow-[0_60px_150px_-30px_rgba(249,115,22,0.7)] transition-all duration-1000 hover:scale-[1.02]">
              
              {/* 3D Floating Particles */}
              <div className="absolute top-8 right-8 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl animate-float" />
              <div className="absolute bottom-12 left-12 w-24 h-24 bg-orange-400/20 rounded-full blur-2xl animate-float delay-1000" />
              <div className="absolute top-1/2 right-12 w-20 h-20 bg-orange-600/15 rounded-full blur-xl animate-pulse delay-2000" />

              <div className="relative z-20 p-12">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/20">
                      <span className="text-3xl font-black text-black">📊</span>
                    </div>
                    <div>
                      <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-2xl">
                        3D Quote Calculator
                      </h3>
                      <p className="text-orange-400 font-bold text-xl mt-2">Get instant pricing visualization</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowQuoteModal(false)}
                    className="group text-gray-400 hover:text-white hover:bg-white/20 p-4 rounded-4xl transition-all duration-500 hover:scale-125 hover:rotate-180 text-3xl w-20 h-20 flex items-center justify-center backdrop-blur-xl shadow-xl hover:shadow-orange-500/50"
                  >
                    ✕
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="group relative">
                      <label className="block text-gray-300 font-bold mb-4 text-xl flex items-center gap-3">
                        👤 Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-8 py-6 bg-white/10 border-2 border-gray-700/50 rounded-4xl text-white font-bold text-xl backdrop-blur-2xl focus:outline-none focus:border-orange-500/80 focus:ring-8 focus:ring-orange-500/30 transition-all duration-700 hover:border-orange-400/60 hover:shadow-[0_10px_30px_rgba(249,115,22,0.2)] group-hover:scale-[1.02]"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="group relative">
                      <label className="block text-gray-300 font-bold mb-4 text-xl flex items-center gap-3">
                        📱 Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-8 py-6 bg-white/10 border-2 border-gray-700/50 rounded-4xl text-white font-bold text-xl backdrop-blur-2xl focus:outline-none focus:border-orange-500/80 focus:ring-8 focus:ring-orange-500/30 transition-all duration-700 hover:border-orange-400/60 hover:shadow-[0_10px_30px_rgba(249,115,22,0.2)] group-hover:scale-[1.02]"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <label className="block text-gray-300 font-bold mb-4 text-xl flex items-center gap-3">
                      ✉️ Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-8 py-6 bg-white/10 border-2 border-gray-700/50 rounded-4xl text-white font-bold text-xl backdrop-blur-2xl focus:outline-none focus:border-orange-500/80 focus:ring-8 focus:ring-orange-500/30 transition-all duration-700 hover:border-orange-400/60 hover:shadow-[0_10px_30px_rgba(249,115,22,0.2)] group-hover:scale-[1.02]"
                      placeholder="your.email@domain.com"
                    />
                  </div>
                  
                  <div className="group relative">
                    <label className="block text-gray-300 font-bold mb-4 text-xl flex items-center gap-3">
                      🏪 Business Type
                    </label>
                    <div className="relative">
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-8 py-6 bg-white/10 border-2 border-gray-700/50 rounded-4xl text-white font-bold text-xl backdrop-blur-2xl appearance-none focus:outline-none focus:border-orange-500/80 focus:ring-8 focus:ring-orange-500/30 transition-all duration-700 hover:border-orange-400/60 cursor-pointer group-hover:scale-[1.02]"
                      >
                        <option className="bg-gray-900 text-white text-xl py-4">Amazon Seller</option>
                        <option className="bg-gray-900 text-white text-xl py-4">Shopify Store</option>
                        <option className="bg-gray-900 text-white text-xl py-4">Etsy Seller</option>
                        <option className="bg-gray-900 text-white text-xl py-4">WooCommerce</option>
                        <option className="bg-gray-900 text-white text-xl py-4">DTC Brand</option>
                        <option className="bg-gray-900 text-white text-xl py-4">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-8 text-orange-500 text-3xl">
                        ▼
                      </div>
                    </div>
                  </div>
                  
                  <div className="group relative">
                    <label className="block text-gray-300 font-bold mb-4 text-xl flex items-center gap-3">
                      💬 Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="6"
                      className="w-full px-8 py-6 bg-white/10 border-2 border-gray-700/50 rounded-4xl text-white font-bold text-xl backdrop-blur-2xl focus:outline-none focus:border-orange-500/80 focus:ring-8 focus:ring-orange-500/30 transition-all duration-700 resize-vertical hover:border-orange-400/60 hover:shadow-[0_10px_30px_rgba(249,115,22,0.2)] group-hover:scale-[1.02]"
                      placeholder="Tell us about your inventory needs, volumes, or special requests..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="group w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-black py-10 rounded-4xl font-black text-3xl shadow-2xl hover:shadow-[0_35px_70px_-20px_rgba(249,115,22,0.6)] hover:from-orange-400 hover:to-orange-600 transform transition-all duration-700 hover:scale-[1.08] hover:-translate-y-3 active:scale-[1.02] relative overflow-hidden cursor-grab active:cursor-grabbing"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-6">
                      🚀 Submit Quote Request
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1200" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes popInModal {
          0% { 
            opacity: 0; 
            transform: scale(0.6) translateY(100px) rotateX(90deg); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0) rotateX(0deg); 
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-[popInModal_0.6s_ease-out] { animation: popInModal 0.6s ease-out forwards; }
        
        .bg-grid-black\/\$0.03\$ {
          background-image: 
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
        }
      `}</style>
    </WebsiteLayout>
  );
};

export default PricingPage;