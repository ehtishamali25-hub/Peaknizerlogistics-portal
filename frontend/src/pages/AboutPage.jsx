// AboutPage.jsx - FULL 3D ENHANCED VERSION (FIXED)
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 3D Company Timeline
const CompanyTimeline3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const container = mountRef.current;
    
    renderer.setSize(container.clientWidth, 400);
    container.appendChild(renderer.domElement);

    // Timeline axis
    const timelineGeometry = new THREE.CylinderGeometry(0.05, 0.05, 30);
    const timelineMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff6b35, 
      transparent: true, 
      opacity: 0.8 
    });
    const timeline = new THREE.Mesh(timelineGeometry, timelineMaterial);
    timeline.rotation.z = Math.PI / 2;
    scene.add(timeline);

    // Milestone orbs
    const milestones = [];
    const colors = [0xff6b35, 0xfbbf24, 0x10b981, 0x3b82f6, 0x8b5cf6];
    const positions = [-14, -7, 0, 7, 14];
    
    for (let i = 0; i < 5; i++) {
      const orbGeometry = new THREE.SphereGeometry(0.8, 32, 32);
      const orbMaterial = new THREE.MeshPhysicalMaterial({
        color: colors[i],
        metalness: 0.8,
        roughness: 0.2,
        emissive: colors[i],
        emissiveIntensity: 0.3
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.set(positions[i], 0, Math.sin(i) * 2);
      scene.add(orb);
      milestones.push(orb);
    }

    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.02;

      milestones.forEach((orb, i) => {
        orb.rotation.y += 0.02;
        orb.position.y = Math.sin(time * 2 + i) * 0.5;
        orb.scale.setScalar(1 + Math.sin(time * 3 + i) * 0.2);
      });

      camera.position.x = Math.sin(time * 0.1) * 3;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (container) {
        renderer.setSize(container.clientWidth, 400);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-[450px] rounded-4xl shadow-4xl shadow-orange-500/40 border-4 border-orange-500/50 relative overflow-hidden" />
  );
};

// 3D Team Holograms - FIXED IMPLEMENTATION
const TeamHolograms3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / 500, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(mountRef.current.clientWidth, 500);
    mountRef.current.appendChild(renderer.domElement);

    // Create floating orbs for each team member
    const teamColors = [0xff6b35, 0x8b5cf6, 0x3b82f6, 0x10b981];
    const positions = [-6, -2, 2, 6];
    const orbs = [];

    for (let i = 0; i < 4; i++) {
      const geometry = new THREE.SphereGeometry(1.2, 64, 64);
      const material = new THREE.MeshPhysicalMaterial({
        color: teamColors[i],
        metalness: 0.7,
        roughness: 0.3,
        emissive: teamColors[i],
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
      });
      const orb = new THREE.Mesh(geometry, material);
      orb.position.set(positions[i], 0, 0);
      scene.add(orb);
      orbs.push(orb);
      
      // Add ring around each orb
      const ringGeometry = new THREE.TorusGeometry(1.4, 0.05, 32, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({ color: teamColors[i] });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      orb.add(ring);
      
      // Add small particles around each orb
      const particleCount = 50;
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      for (let j = 0; j < particleCount; j++) {
        particlePositions[j * 3] = (Math.random() - 0.5) * 3;
        particlePositions[j * 3 + 1] = (Math.random() - 0.5) * 3;
        particlePositions[j * 3 + 2] = (Math.random() - 0.5) * 3;
      }
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMaterial = new THREE.PointsMaterial({ color: teamColors[i], size: 0.05 });
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      orb.add(particles);
    }

    camera.position.set(0, 0, 12);
    camera.lookAt(0, 0, 0);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.02;
      
      orbs.forEach((orb, i) => {
        orb.rotation.y += 0.01;
        orb.rotation.x = Math.sin(time + i) * 0.5;
        orb.position.y = Math.sin(time * 1.5 + i) * 0.3;
        orb.scale.setScalar(1 + Math.sin(time * 2 + i) * 0.1);
      });
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (mountRef.current) {
        renderer.setSize(mountRef.current.clientWidth, 500);
        camera.aspect = mountRef.current.clientWidth / 500;
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

  return (
    <div ref={mountRef} className="w-full h-[500px] bg-gradient-to-br from-gray-900/80 to-black/60 rounded-4xl border-4 border-blue-500/50 shadow-4xl backdrop-blur-xl relative overflow-hidden" />
  );
};

const AboutPage = () => {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);

  useEffect(() => {
    // Hero animation
    gsap.fromTo(heroRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.8, ease: 'power3.out' }
    );

    // Story parallax
    ScrollTrigger.create({
      trigger: storyRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.story-content', {
          y: 100,
          opacity: 0,
          stagger: 0.3,
          duration: 1.2,
          ease: 'power3.out'
        });
      }
    });

    // Values stagger
    ScrollTrigger.create({
      trigger: valuesRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.value-card', {
          rotationX: 90,
          opacity: 0,
          y: 50,
          stagger: 0.15,
          duration: 1,
          ease: 'back.out(1.7)'
        });
      }
    });

    // Team entrance
    ScrollTrigger.create({
      trigger: teamRef.current,
      start: 'top 85%',
      onEnter: () => {
        gsap.from('.team-member', {
          scale: 0,
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
      {/* HERO - 3D Company Origin */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-blue-900/30">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.02]" />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-blue-500/5 to-purple-500/5 animate-pulse" />
          {/* Floating particles */}
          <div className="absolute top-32 left-20 w-24 h-24">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full absolute animate-ping" />
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full absolute top-8 left-8 animate-pulse" style={{animationDelay: '1s'}} />
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-20 text-center">
          <div className="inline-block bg-gradient-to-r from-orange-500/20 via-blue-500/20 to-purple-500/20 px-10 py-5 rounded-4xl border border-orange-500/40 backdrop-blur-xl mb-12">
            <span className="text-3xl font-black bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent tracking-wider">
              EST. 2020
            </span>
          </div>
          
          <h1 className="text-8xl md:text-9xl lg:text-[10rem] font-black leading-[0.85] bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent drop-shadow-4xl mb-8">
            PEAKNIZER<span className="bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent drop-shadow-4xl block text-[7rem] md:text-[8rem]">LOGISTICS</span>
          </h1>
          
          <p className="text-3xl md:text-4xl text-gray-300 max-w-5xl mx-auto leading-relaxed mb-16">
            Pioneering the future of <span className="bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent font-black">3PL fulfillment</span>
            <br />
            <span className="text-2xl md:text-3xl text-gray-400 block mt-4">500K+ sq ft • 2,500+ brands • 60K orders/month</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center pt-12">
            <Link
              to="/services"
              className="group relative bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-16 py-8 rounded-4xl font-black text-2xl shadow-4xl shadow-orange-500/50 hover:shadow-orange-500/70 transform hover:-translate-y-4 hover:scale-[1.08] transition-all duration-1000 overflow-hidden"
            >
              <span className="relative z-10">SERVICES</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent -skew-x-12 transform group-hover:translate-x-20 transition-transform duration-1000" />
            </Link>
            <Link
              to="/contact"
              className="group bg-white/20 backdrop-blur-3xl text-white px-16 py-8 rounded-4xl font-black text-2xl border-4 border-white/40 hover:bg-white/40 hover:border-white/70 hover:shadow-4xl hover:shadow-white/50 transition-all duration-700 hover:scale-105"
            >
              START PARTNERSHIP
            </Link>
          </div>
        </div>
      </section>

      {/* OUR STORY - 3D Timeline */}
      <section ref={storyRef} className="py-32 bg-gradient-to-b from-black/80 to-gray-900/70 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.01]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
            <div className="lg:order-2">
              <CompanyTimeline3D />
              <div className="text-center mt-12 space-y-6">
                <h3 className="text-4xl font-black text-white bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                  OUR JOURNEY
                </h3>
                <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto text-center">
                  <div>
                    <div className="text-5xl font-black text-orange-500 mb-2">2020</div>
                    <div className="text-gray-400 text-lg">Founded</div>
                  </div>
                  <div>
                    <div className="text-5xl font-black text-yellow-500 mb-2">500K+</div>
                    <div className="text-gray-400 text-lg">Sq Ft Served</div>
                  </div>
                  <div>
                    <div className="text-5xl font-black text-blue-500 mb-2">2,500+</div>
                    <div className="text-gray-400 text-lg">Happy Brands</div>
                  </div>
                  <div>
                    <div className="text-5xl font-black text-green-500 mb-2">60K</div>
                    <div className="text-gray-400 text-lg">Orders/Month</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="story-content space-y-8 lg:order-1">
              <h2 className="text-6xl font-black bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent drop-shadow-4xl mb-8">
                FROM GARAGE TO GLOBAL
              </h2>
              
              <div className="space-y-8 text-2xl text-gray-300 leading-relaxed">
                <p className="story-content opacity-0">
                  Founded in <span className="text-orange-500 font-black">2020</span>, Peaknizer emerged from a simple truth: 
                  e-commerce was exploding, but logistics was the bottleneck strangling growth.
                </p>
                
                <p className="story-content opacity-0">
                  What began as a <span className="text-yellow-500 font-black">single warehouse</span> in Virginia has scaled to 
                  <span className="text-blue-500 font-black">500K+ sq ft</span> across strategic US locations, serving 
                  <span className="text-green-500 font-black">2,500+ brands</span>.
                </p>
                
                <p className="story-content opacity-0">
                  Today we process <span className="text-purple-500 font-black">60K orders monthly</span> with 
                  <span className="text-orange-500 font-black">99.99% accuracy</span>, powered by proprietary AI and 
                  relentless innovation.
                </p>
              </div>

              <div className="bg-gradient-to-r from-gray-900/80 to-black/60 backdrop-blur-xl p-10 rounded-4xl border border-orange-500/40 shadow-4xl shadow-orange-500/30">
                <div className="text-7xl text-orange-500 mb-8">“</div>
                <p className="text-2xl text-white italic mb-12 leading-relaxed max-w-2xl">
                  "We don't just move boxes. We architect supply chains that scale empires."
                </p>
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-3xl flex items-center justify-center text-3xl font-black text-black shadow-2xl shadow-orange-500/50 mr-6">
                    SH
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">Shah</p>
                    <p className="text-xl text-orange-400">Founder & CEO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION - 3D Cards - FIXED */}
      <section className="py-32 bg-gradient-to-b from-gray-900/70 to-black/90 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <div className="value-card group relative transition-all duration-1000">
              <div className="relative bg-gradient-to-br from-emerald-900/90 to-green-900/70 backdrop-blur-3xl p-16 rounded-4xl border-4 border-emerald-500/60 shadow-4xl shadow-emerald-500/40 hover:shadow-emerald-500/70 hover:scale-[1.05] transition-all duration-1000">
                <div className="text-8xl mb-12 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-1000 animate-pulse">🎯</div>
                <h3 className="text-5xl font-black text-white mb-12 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent drop-shadow-4xl group-hover:scale-110 transition-transform">
                  MISSION
                </h3>
                <p className="text-2xl text-gray-200 leading-relaxed opacity-85 group-hover:opacity-100 transition-all mb-12">
                  Empower brands to conquer commerce through flawless, scalable logistics that eliminate friction and maximize velocity.
                </p>
                <ul className="space-y-4 text-xl text-gray-300">
                  <li className="flex items-start"><span className="text-emerald-400 text-2xl mr-4 mt-1">✓</span>Zero-defect execution</li>
                  <li className="flex items-start"><span className="text-emerald-400 text-2xl mr-4 mt-1">✓</span>AI-first innovation</li>
                  <li className="flex items-start"><span className="text-emerald-400 text-2xl mr-4 mt-1">✓</span>Partnership mindset</li>
                </ul>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/40 rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10" />
              </div>
            </div>

            <div className="value-card group relative transition-all duration-1000">
              <div className="relative bg-gradient-to-br from-indigo-900/90 to-purple-900/70 backdrop-blur-3xl p-16 rounded-4xl border-4 border-indigo-500/60 shadow-4xl shadow-indigo-500/40 hover:shadow-indigo-500/70 hover:scale-[1.05] transition-all duration-1000">
                <div className="text-8xl mb-12 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-1000 animate-pulse">👁️</div>
                <h3 className="text-5xl font-black text-white mb-12 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-4xl group-hover:scale-110 transition-transform">
                  VISION
                </h3>
                <p className="text-2xl text-gray-200 leading-relaxed opacity-85 group-hover:opacity-100 transition-all mb-12">
                  Become the <span className="font-black text-white">invisible force</span> powering the world's most successful commerce brands through unprecedented logistics intelligence.
                </p>
                <ul className="space-y-4 text-xl text-gray-300">
                  <li className="flex items-start"><span className="text-indigo-400 text-2xl mr-4 mt-1">✓</span>Global expansion</li>
                  <li className="flex items-start"><span className="text-indigo-400 text-2xl mr-4 mt-1">✓</span>AI supremacy</li>
                  <li className="flex items-start"><span className="text-indigo-400 text-2xl mr-4 mt-1">✓</span>Industry leadership</li>
                </ul>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES - 3D Floating Grid - FIXED */}
      <section ref={valuesRef} className="py-32 bg-gradient-to-b from-black/80 to-gray-900/60 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.015]" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-7xl font-black bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-4xl mb-6">
              CORE PRINCIPLES
            </h2>
            <p className="text-2xl text-gray-400 max-w-4xl mx-auto">
              The DNA that powers everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {[
              { 
                icon: '🤝', 
                title: 'Absolute Integrity', 
                desc: 'Zero tolerance for opacity. Complete transparency in pricing, processes, and performance.',
                color: 'from-emerald-500 to-green-500',
                borderColor: 'border-emerald-500/40'
              },
              { 
                icon: '⚡', 
                title: 'Relentless Innovation', 
                desc: 'AI-first approach. Continuous evolution through technology and process reinvention.',
                color: 'from-blue-500 to-indigo-500',
                borderColor: 'border-blue-500/40'
              },
              { 
                icon: '🎯', 
                title: 'Customer Supremacy', 
                desc: 'Your success IS our success. We measure ourselves by your growth velocity.',
                color: 'from-orange-500 to-yellow-500',
                borderColor: 'border-orange-500/40'
              },
              { 
                icon: '👥', 
                title: 'Team Obsession', 
                desc: 'World-class talent. Continuous development. Ownership culture.',
                color: 'from-purple-500 to-pink-500',
                borderColor: 'border-purple-500/40'
              },
              { 
                icon: '🌱', 
                title: 'Exponential Growth', 
                desc: 'Built for 100x scale. Sustainable systems that compound over decades.',
                color: 'from-green-500 to-emerald-500',
                borderColor: 'border-green-500/40'
              },
              { 
                icon: '🌍', 
                title: 'Global Impact', 
                desc: 'Economic engines for communities. Responsible stewardship of resources.',
                color: 'from-indigo-500 to-blue-500',
                borderColor: 'border-indigo-500/40'
              }
            ].map((value, i) => (
              <div key={i} className="value-card group relative transition-all duration-1000 cursor-pointer">
                <div className={`relative bg-gradient-to-br ${value.color} bg-gradient-to-br from-gray-900/95 to-black/80 backdrop-blur-3xl p-12 rounded-4xl border-4 ${value.borderColor} shadow-4xl hover:scale-[1.08] transition-all duration-1000`}>
                  <div className="text-7xl mb-8 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-1000 animate-pulse">{value.icon}</div>
                  <h3 className="text-3xl font-black text-white mb-6 group-hover:scale-105 transition-transform uppercase tracking-wider">{value.title}</h3>
                  <p className="text-xl text-gray-100 leading-relaxed opacity-85 group-hover:opacity-100 transition-all">{value.desc}</p>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 rounded-4xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEADERSHIP - 3D Holograms - FIXED */}
      <section ref={teamRef} className="py-32 bg-gradient-to-b from-gray-900/80 to-black/90 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-7xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent drop-shadow-4xl mb-6">
              EXECUTIVE TEAM
            </h2>
            <p className="text-2xl text-gray-400 max-w-4xl mx-auto">
              World-class operators building the future of logistics
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <TeamHolograms3D />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-20">
              {[
                {
                  name: "Shah",
                  role: "Founder & CEO",
                  bio: "15+ years logistics. Ex-Amazon. Built 500K+ sq ft network.",
                  initial: "SH",
                  color: "from-orange-500 to-yellow-500",
                  shadowColor: "shadow-orange-500/50"
                },
                {
                  name: "E. Ali",
                  role: "CTO & Head of Engineering", 
                  bio: "Built Client Portal v2.0. AI logistics pioneer. 10+ years software.",
                  initial: "EA",
                  color: "from-purple-500 to-pink-500",
                  shadowColor: "shadow-purple-500/50"
                },
                {
                  name: "M. Ali", 
                  role: "Chief Operations Officer",
                  bio: "Warehouse optimization expert. Stanford MBA. 99.99% accuracy systems.",
                  initial: "MA",
                  color: "from-blue-500 to-indigo-500",
                  shadowColor: "shadow-blue-500/50"
                },
                {
                  name: "Emily Watson",
                  role: "Chief Client Officer",
                  bio: "2,500+ client relationships. Retention specialist. Growth architect.",
                  initial: "EW",
                  color: "from-green-500 to-emerald-500",
                  shadowColor: "shadow-green-500/50"
                }
              ].map((leader, i) => (
                <div key={i} className="team-member group relative text-center transition-all duration-1000 cursor-pointer">
                  <div className={`relative w-48 h-48 mx-auto mb-8 bg-gradient-to-br ${leader.color} rounded-3xl flex items-center justify-center shadow-4xl ${leader.shadowColor} group-hover:scale-125 transition-all duration-1000`}>
                    <div className="text-5xl font-black text-black drop-shadow-2xl relative z-10">{leader.initial}</div>
                    <div className="absolute inset-0 bg-white/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition-opacity" />
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors">{leader.name}</h3>
                  <p className="text-xl text-orange-400 font-semibold mb-6 uppercase tracking-wide">{leader.role}</p>
                  <p className="text-lg text-gray-300 leading-relaxed opacity-85 group-hover:opacity-100 transition-opacity">{leader.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY US - Stats Grid - FIXED */}
      <section className="py-32 bg-black/80 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-7xl font-black bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-4xl mb-6">
              PROVEN RESULTS
            </h2>
            <p className="text-2xl text-gray-400 max-w-4xl mx-auto">
              Numbers don't lie. Scale does.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 max-w-5xl mx-auto text-center">
            {[
              { num: '99.9%', label: 'Accuracy', icon: '🎯' },
              { num: '24h', label: 'Avg Turnaround', icon: '⚡' },
              { num: '500K+', label: 'Sq Ft Capacity', icon: '🏭' },
              { num: '2,500+', label: 'Active Brands', icon: '👥' },
              { num: '60K', label: 'Orders/Month', icon: '📦' },
              { num: '0', label: 'Downtime Days', icon: '🔒' }
            ].map((stat, i) => (
              <div key={i} className="group p-12 bg-gradient-to-br from-gray-900/90 to-black/70 backdrop-blur-xl rounded-4xl border border-emerald-500/40 hover:border-emerald-500/70 hover:shadow-emerald-500/40 hover:scale-110 transition-all duration-700 cursor-pointer shadow-2xl">
                <div className="text-6xl mb-6 opacity-70 group-hover:opacity-100 transition-opacity">{stat.icon}</div>
                <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent drop-shadow-4xl mb-4 group-hover:scale-110 transition-transform">
                  {stat.num}
                </div>
                <div className="text-2xl font-bold text-gray-300 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITIES - 3D Map - FIXED */}
      <section className="py-32 bg-gradient-to-b from-gray-900/80 to-black/90 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-7xl font-black bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-4xl mb-6">
              STRATEGIC FOOTPRINT
            </h2>
            <p className="text-2xl text-gray-400 max-w-4xl mx-auto">
              Multi-location network optimized for velocity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                location: "Arlington, VA",
                size: "150K sq ft",
                features: ["East Coast Hub", "60 docks", "Rail access", "Climate control"],
                color: "from-orange-500 to-yellow-500",
                shadowColor: "shadow-orange-500/50"
              },
              {
                location: "Houston, TX", 
                size: "200K sq ft",
                features: ["Gulf Gateway", "80 docks", "Hazmat certified", "Port proximity"],
                color: "from-blue-500 to-indigo-500",
                shadowColor: "shadow-blue-500/50"
              },
              {
                location: "Chicago, IL",
                size: "175K sq ft", 
                features: ["Midwest Core", "Rail nexus", "Cross-dock", "Automation"],
                color: "from-green-500 to-emerald-500",
                shadowColor: "shadow-green-500/50"
              }
            ].map((facility, i) => (
              <div key={i} className="group relative p-10 bg-gradient-to-br from-gray-900/90 to-black/70 backdrop-blur-xl rounded-4xl border-4 border-white/20 hover:border-orange-500/60 hover:shadow-orange-500/50 hover:scale-105 transition-all duration-1000 cursor-pointer shadow-2xl">
                <div className={`w-20 h-20 bg-gradient-to-br ${facility.color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl ${facility.shadowColor} group-hover:scale-125 transition-all duration-500`}>
                  <div className="text-3xl font-black text-black drop-shadow-lg">📍</div>
                </div>
                <h3 className="text-3xl font-black text-white mb-4 text-center group-hover:text-blue-400 transition-colors">{facility.location}</h3>
                <p className="text-2xl text-orange-400 font-bold mb-6 text-center">{facility.size}</p>
                <ul className="space-y-3 text-gray-300 text-lg">
                  {facility.features.map((feature, j) => (
                    <li key={j} className="flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mr-4 animate-pulse" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.1] animate-pulse" />
        <div className="container mx-auto px-6 text-center relative z-20">
          <div className="max-w-5xl mx-auto space-y-12">
            <h2 className="text-8xl md:text-9xl font-black text-white drop-shadow-4xl leading-tight">
              JOIN THE <span className="bg-gradient-to-r from-yellow-400 via-white to-emerald-400 bg-clip-text text-transparent drop-shadow-4xl block text-[6rem] md:text-[7rem]">REVOLUTION</span>
            </h2>
            <p className="text-4xl text-white/95 max-w-4xl mx-auto leading-relaxed">
              Experience logistics that scales with your ambition. Partner with the future.
            </p>
            
            <div className="flex flex-col lg:flex-row gap-8 justify-center items-center pt-16">
              <Link
                to="/services"
                className="group relative bg-black/90 backdrop-blur-xl text-white px-20 py-10 rounded-5xl font-black text-3xl shadow-4xl shadow-white/40 hover:shadow-white/60 border-4 border-white/30 hover:border-white/60 transform hover:-translate-y-6 hover:scale-[1.1] transition-all duration-1000 overflow-hidden"
              >
                <span className="relative z-10">DISCOVER SERVICES</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent -skew-x-12 transform group-hover:translate-x-32 transition-transform duration-1000" />
              </Link>
              
              <Link
                to="/contact"
                className="group bg-white/30 backdrop-blur-3xl text-white px-20 py-10 rounded-5xl font-black text-3xl border-4 border-white/50 hover:bg-white/60 hover:border-white/80 hover:shadow-4xl hover:shadow-white/60 transition-all duration-700 hover:scale-110"
              >
                START PARTNERSHIP →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </WebsiteLayout>
  );
};

export default AboutPage;