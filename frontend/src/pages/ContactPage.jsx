// ContactPage.jsx - Enhanced 3D Version (Responsive)
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 3D Hero Background with floating particles and rotating geometric shape
const Hero3DBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Particle system
    const particleCount = 1500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 100;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 40;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xff6b35,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Torus Knot (central geometric shape)
    const knotGeometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 16, 3, 4);
    const knotMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xff6b35,
      metalness: 0.7,
      roughness: 0.2,
      emissive: 0xff6b35,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7
    });
    const knot = new THREE.Mesh(knotGeometry, knotMaterial);
    scene.add(knot);

    // Additional floating orbs
    const orbCount = 30;
    const orbs = [];
    for (let i = 0; i < orbCount; i++) {
      const orbGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const orbMaterial = new THREE.MeshStandardMaterial({
        color: 0xff6b35,
        emissive: 0xff6b35,
        emissiveIntensity: 0.4
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 20 - 10
      );
      scene.add(orb);
      orbs.push(orb);
    }

    camera.position.set(0, 2, 12);
    camera.lookAt(0, 0, 0);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;

      // Rotate particles slowly
      particles.rotation.y = time * 0.1;
      particles.rotation.x = Math.sin(time * 0.2) * 0.2;

      // Animate torus knot
      knot.rotation.x = time * 0.3;
      knot.rotation.y = time * 0.5;
      knot.scale.setScalar(1 + Math.sin(time) * 0.1);

      // Animate orbs
      orbs.forEach((orb, i) => {
        orb.position.y += Math.sin(time * 2 + i) * 0.005;
        orb.scale.setScalar(0.8 + Math.sin(time * 3 + i) * 0.2);
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

// 3D Globe for map section (simple representation with markers)
const Globe3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const size = container.clientWidth;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    container.appendChild(renderer.domElement);

    // Earth sphere
    const geometry = new THREE.SphereGeometry(2, 64, 64);
    const texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.1,
      roughness: 0.5,
      emissive: 0x112233
    });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Add a marker for Arlington, VA
    const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const markerMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b35, emissive: 0xff6b35, emissiveIntensity: 0.8 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    // Approximate coordinates: lat 38.88, lon -77.1 -> convert to 3D position on sphere
    const lat = 38.88 * Math.PI / 180;
    const lon = -77.1 * Math.PI / 180;
    const radius = 2.05; // slightly above surface
    marker.position.x = radius * Math.cos(lat) * Math.cos(lon);
    marker.position.y = radius * Math.sin(lat);
    marker.position.z = radius * Math.cos(lat) * Math.sin(lon);
    earth.add(marker);

    // Add ring around marker
    const ringGeometry = new THREE.TorusGeometry(0.2, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b35, emissive: 0xff6b35 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    marker.add(ring);

    // Stars background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 50;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;
      earth.rotation.y = time * 0.2;
      stars.rotation.y += 0.0005;
      ring.rotation.z += 0.02;
      ring.rotation.x += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (mountRef.current) {
        const newSize = mountRef.current.clientWidth;
        renderer.setSize(newSize, newSize);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full aspect-square" />;
};

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

  // Scroll animations (same as before, works on all sizes)
  useEffect(() => {
    ScrollTrigger.create({
      trigger: '.contact-cards',
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.contact-card', {
          x: -50,
          opacity: 0,
          stagger: 0.2,
          duration: 1,
          ease: 'power3.out'
        });
      }
    });

    ScrollTrigger.create({
      trigger: '.contact-form',
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.contact-form', {
          y: 50,
          opacity: 0,
          duration: 1.2,
          ease: 'back.out(1.2)'
        });
      }
    });

    ScrollTrigger.create({
      trigger: '.faq-section',
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.faq-item', {
          y: 30,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    });

    ScrollTrigger.create({
      trigger: '.cta-section',
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.cta-content', {
          scale: 0.9,
          opacity: 0,
          duration: 1,
          ease: 'back.out(1.2)'
        });
      }
    });
  }, []);

  return (
    <WebsiteLayout>
      {/* Hero Section with 3D Background - Responsive */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-blue-900/30">
        <Hero3DBackground />
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
          <div className="inline-block bg-gradient-to-r from-orange-500/20 via-blue-500/20 to-purple-500/20 px-4 sm:px-6 md:px-10 py-2 sm:py-3 md:py-5 rounded-3xl sm:rounded-4xl border border-orange-500/40 backdrop-blur-xl mb-6 sm:mb-8 md:mb-12">
            <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent tracking-wider">
              GET IN TOUCH
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black leading-[1.1] sm:leading-[0.85] bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent drop-shadow-4xl mb-6 sm:mb-8">
            Let's <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">Connect</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 md:mb-16">
            Ready to scale your business? Our team is here to provide the logistics solutions you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center">
            <a
              href="https://wa.me/15713074461"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-8 sm:px-10 md:px-12 lg:px-16 py-3 sm:py-4 md:py-6 lg:py-8 rounded-3xl sm:rounded-4xl font-black text-base sm:text-lg md:text-xl lg:text-2xl shadow-4xl shadow-orange-500/50 hover:shadow-orange-500/70 transform hover:-translate-y-2 md:hover:-translate-y-4 hover:scale-[1.02] md:hover:scale-[1.08] transition-all duration-1000 overflow-hidden"
            >
              <span className="relative z-10">WHATSAPP US</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent -skew-x-12 transform group-hover:translate-x-20 transition-transform duration-1000" />
            </a>
            <Link
              to="/services"
              className="group bg-white/20 backdrop-blur-3xl text-white px-8 sm:px-10 md:px-12 lg:px-16 py-3 sm:py-4 md:py-6 lg:py-8 rounded-3xl sm:rounded-4xl font-black text-base sm:text-lg md:text-xl lg:text-2xl border-4 border-white/40 hover:bg-white/40 hover:border-white/70 hover:shadow-4xl hover:shadow-white/50 transition-all duration-700 hover:scale-[1.02] md:hover:scale-105"
            >
              EXPLORE SERVICES
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info & Form - Responsive */}
      <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-black/80 to-gray-900/70 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.01]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 max-w-7xl mx-auto">
            {/* Left Column - Contact Cards */}
            <div className="contact-cards space-y-6 sm:space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-4xl mb-4 sm:mb-8">
                Reach Out
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {/* Email Card */}
                <div className="contact-card group relative bg-gradient-to-br from-gray-900/90 to-black/60 backdrop-blur-xl p-5 sm:p-6 md:p-8 rounded-3xl sm:rounded-4xl border-4 border-orange-500/40 hover:border-orange-500/70 hover:shadow-4xl hover:shadow-orange-500/40 transition-all duration-700 cursor-pointer">
                  <div className="flex items-start space-x-4 sm:space-x-6">
                    <div className="text-3xl sm:text-4xl md:text-5xl text-orange-500 group-hover:scale-125 transition-transform duration-500">📧</div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2">Email Us</h3>
                      <a href="mailto:info@peaknizerlogistics.com" className="text-orange-400 hover:text-orange-300 text-base sm:text-lg md:text-xl break-all">
                        info@peaknizerlogistics.com
                      </a>
                      <p className="text-gray-500 text-sm sm:text-base mt-1 sm:mt-2">Response within 2-4 hours</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 rounded-3xl sm:rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10" />
                </div>

                {/* WhatsApp Card */}
                <div className="contact-card group relative bg-gradient-to-br from-gray-900/90 to-black/60 backdrop-blur-xl p-5 sm:p-6 md:p-8 rounded-3xl sm:rounded-4xl border-4 border-green-500/40 hover:border-green-500/70 hover:shadow-4xl hover:shadow-green-500/40 transition-all duration-700 cursor-pointer">
                  <div className="flex items-start space-x-4 sm:space-x-6">
                    <div className="text-3xl sm:text-4xl md:text-5xl text-green-500 group-hover:scale-125 transition-transform duration-500">💬</div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2">WhatsApp</h3>
                      <a href="https://wa.me/15713074461" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 text-base sm:text-lg md:text-xl">
                        +1 (571) 307-4461
                      </a>
                      <p className="text-gray-500 text-sm sm:text-base mt-1 sm:mt-2">Instant messaging, 24/7</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 rounded-3xl sm:rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10" />
                </div>

                {/* Phone Card */}
                <div className="contact-card group relative bg-gradient-to-br from-gray-900/90 to-black/60 backdrop-blur-xl p-5 sm:p-6 md:p-8 rounded-3xl sm:rounded-4xl border-4 border-blue-500/40 hover:border-blue-500/70 hover:shadow-4xl hover:shadow-blue-500/40 transition-all duration-700 cursor-pointer">
                  <div className="flex items-start space-x-4 sm:space-x-6">
                    <div className="text-3xl sm:text-4xl md:text-5xl text-blue-500 group-hover:scale-125 transition-transform duration-500">📞</div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2">Phone</h3>
                      <a href="tel:+15713074461" className="text-blue-400 hover:text-blue-300 text-base sm:text-lg md:text-xl">
                        +1 (571) 307-4461
                      </a>
                      <p className="text-gray-500 text-sm sm:text-base mt-1 sm:mt-2">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 rounded-3xl sm:rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10" />
                </div>

                {/* Location Card */}
                <div className="contact-card group relative bg-gradient-to-br from-gray-900/90 to-black/60 backdrop-blur-xl p-5 sm:p-6 md:p-8 rounded-3xl sm:rounded-4xl border-4 border-purple-500/40 hover:border-purple-500/70 hover:shadow-4xl hover:shadow-purple-500/40 transition-all duration-700 cursor-pointer">
                  <div className="flex items-start space-x-4 sm:space-x-6">
                    <div className="text-3xl sm:text-4xl md:text-5xl text-purple-500 group-hover:scale-125 transition-transform duration-500">📍</div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white mb-1 sm:mb-2">Warehouse Location</h3>
                      <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-tight">
                        2503D N Harrison St,<br />
                        Arlington, VA 22207<br />
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 rounded-3xl sm:rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10" />
                </div>

                {/* Business Hours */}
                <div className="bg-gradient-to-br from-gray-900/80 to-black/60 backdrop-blur-xl p-5 sm:p-6 md:p-8 rounded-3xl sm:rounded-4xl border border-orange-500/40">
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-3 sm:mb-4">Business Hours</h3>
                  <div className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span>Monday - Friday:</span>
                      <span className="text-orange-400">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex flex-wrap justify-between gap-2">
                      <span>Saturday:</span>
                      <span className="text-orange-400">10:00 AM - 2:00 PM EST</span>
                    </div>
                    <div className="flex flex-wrap justify-between gap-2">
                      <span>Sunday:</span>
                      <span className="text-gray-500">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="contact-form relative">
              <div className="bg-gradient-to-br from-gray-900/90 to-black/70 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-3xl sm:rounded-4xl border-4 border-orange-500/40 shadow-4xl shadow-orange-500/30">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-6 sm:mb-8">
                  Send a Message
                </h2>

                {submitStatus.message && (
                  <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-500/20 border border-green-500 text-green-400' 
                      : 'bg-red-500/20 border border-red-500 text-red-400'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition text-sm sm:text-base"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition text-sm sm:text-base"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition text-sm sm:text-base"
                        placeholder="+1 (571) 307-4461"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Company Name</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition text-sm sm:text-base"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Service Interested In</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition text-sm sm:text-base"
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
                    <label className="block text-gray-300 mb-1 sm:mb-2 text-xs sm:text-sm">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-orange-500 transition text-sm sm:text-base"
                      placeholder="Tell us about your fulfillment needs, volume, and any specific requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-black py-3 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:shadow-4xl hover:shadow-orange-500/50 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message →'}
                  </button>

                  <p className="text-gray-500 text-xs text-center">
                    By submitting this form, you agree to our privacy policy and consent to being contacted.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section with 3D Globe - Responsive */}
      <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-gray-900/80 to-black/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-4xl mb-4 sm:mb-6">
              Our Location
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-4xl mx-auto">
              Strategically located in Arlington, VA to serve East Coast and beyond
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900/90 to-black/60 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-3xl sm:rounded-4xl border-4 border-orange-500/40 shadow-4xl">
              <div className="aspect-square w-full max-w-md mx-auto">
                <Globe3D />
              </div>
              <div className="text-center mt-6 sm:mt-8">
                <p className="text-lg sm:text-xl md:text-2xl text-white font-bold mb-2">2503D N Harrison St, Arlington, VA 22207</p>
                <a
                  href="https://maps.google.com/?q=2503D+N+Harrison+St+Arlington+VA+22207"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-orange-400 hover:text-orange-300 text-base sm:text-lg md:text-xl font-semibold mt-3 sm:mt-4 group"
                >
                  Open in Google Maps <span className="group-hover:translate-x-2 inline-block transition-transform">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Responsive */}
      <section className="faq-section py-16 sm:py-24 md:py-32 bg-gradient-to-b from-black/80 to-gray-900/70 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-4xl mb-4 sm:mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-4xl mx-auto">
              Everything you need to know about working with us
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
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
              <div key={index} className="faq-item group relative bg-gradient-to-br from-gray-900/90 to-black/60 backdrop-blur-xl p-5 sm:p-6 md:p-8 rounded-3xl sm:rounded-4xl border border-orange-500/30 hover:border-orange-500/60 hover:shadow-4xl hover:shadow-orange-500/30 transition-all duration-500">
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-2 sm:mb-3">{faq.q}</h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">{faq.a}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 rounded-3xl sm:rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Responsive */}
      <section className="cta-section py-16 sm:py-24 md:py-32 bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.1] animate-pulse" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <div className="cta-content max-w-5xl mx-auto space-y-6 sm:space-y-8 md:space-y-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black text-white drop-shadow-4xl leading-tight">
              Ready to <span className="bg-gradient-to-r from-yellow-400 via-white to-emerald-400 bg-clip-text text-transparent">Scale?</span>
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/95 max-w-4xl mx-auto leading-relaxed">
              Join hundreds of brands who trust Peaknizer with their fulfillment. Get your free quote today.
            </p>
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 justify-center items-center pt-8 sm:pt-12 md:pt-16">
              <Link
                to="/pricing"
                className="group relative bg-black/90 backdrop-blur-xl text-white px-8 sm:px-10 md:px-14 lg:px-20 py-4 sm:py-6 md:py-8 lg:py-10 rounded-4xl sm:rounded-5xl font-black text-lg sm:text-xl md:text-2xl lg:text-3xl shadow-4xl shadow-white/40 hover:shadow-white/60 border-4 border-white/30 hover:border-white/60 transform hover:-translate-y-2 md:hover:-translate-y-6 hover:scale-[1.02] md:hover:scale-[1.1] transition-all duration-1000 overflow-hidden"
              >
                <span className="relative z-10">VIEW PRICING</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent -skew-x-12 transform group-hover:translate-x-32 transition-transform duration-1000" />
              </Link>
              <a
                href="https://wa.me/15713074461"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/30 backdrop-blur-3xl text-white px-8 sm:px-10 md:px-14 lg:px-20 py-4 sm:py-6 md:py-8 lg:py-10 rounded-4xl sm:rounded-5xl font-black text-lg sm:text-xl md:text-2xl lg:text-3xl border-4 border-white/50 hover:bg-white/60 hover:border-white/80 hover:shadow-4xl hover:shadow-white/60 transition-all duration-700 hover:scale-[1.02] md:hover:scale-110"
              >
                WHATSAPP US →
              </a>
            </div>
          </div>
        </div>
      </section>
    </WebsiteLayout>
  );
};

export default ContactPage;