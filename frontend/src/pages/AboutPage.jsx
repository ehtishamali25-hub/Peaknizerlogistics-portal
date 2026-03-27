import WebsiteLayout from './WebsiteLayout';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <WebsiteLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="text-orange-500">Peaknizer Logistics</span>
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Your trusted partner in third-party logistics, dedicated to streamlining supply chains 
            and empowering e-commerce businesses to scale with confidence.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Our <span className="text-orange-500">Story</span>
              </h2>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Founded in 2020, Peaknizer Logistics emerged from a simple observation: e-commerce sellers were struggling to manage their growing fulfillment needs while trying to scale their businesses. We saw an opportunity to bridge the gap between online retailers and efficient logistics.
              </p>
              <p className="text-gray-400 mb-4 leading-relaxed">
                What started as a small warehouse operation in  Virginia and Texas has grown into a comprehensive 3PL provider serving hundreds of satisfied clients across the United States. Our journey has been driven by a relentless commitment to innovation, reliability, and customer success.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Today, we operate multiple strategically located fulfillment centers, employ a team of logistics experts, and leverage cutting-edge technology to provide seamless supply chain solutions. Our mission remains unchanged: to make logistics simple, affordable, and transparent for businesses of all sizes.
              </p>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg border border-orange-500/30">
              <div className="text-5xl text-orange-500 mb-4">“</div>
              <p className="text-white text-lg italic mb-6">
                We don't just store and ship products – we partner with our clients to understand their unique challenges and craft solutions that drive real growth.
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  SH
                </div>
                <div className="ml-4">
                  <p className="text-white font-semibold"> SHAH</p>
                  <p className="text-gray-400 text-sm">Founder & CEO, Peaknizer Logistics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-900 p-8 rounded-lg border border-orange-500/30">
              <div className="text-4xl text-orange-500 mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed">
                To empower e-commerce businesses by providing reliable, scalable, and transparent logistics solutions that eliminate operational headaches and free our clients to focus on what they do best – growing their brands and serving their customers.
              </p>
              <ul className="mt-6 space-y-3 text-gray-400">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>Deliver exceptional service quality every single day</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>Innovate continuously to improve efficiency and reduce costs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>Build lasting partnerships based on trust and transparency</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-900 p-8 rounded-lg border border-orange-500/30">
              <div className="text-4xl text-orange-500 mb-4">👁️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed">
                To become the most trusted and innovative 3PL partner for e-commerce businesses nationwide, setting the standard for logistics excellence through technology, people, and unwavering commitment to customer success.
              </p>
              <ul className="mt-6 space-y-3 text-gray-400">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>Expand our footprint to serve clients in every major market</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>Develop industry-leading technology for real-time visibility</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>Create a workplace where logistics experts can thrive</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Our <span className="text-orange-500">Core Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤝",
                title: "Integrity First",
                desc: "We believe in complete transparency with our clients. No hidden fees, no surprises – just honest communication and reliable service."
              },
              {
                icon: "⚡",
                title: "Relentless Innovation",
                desc: "We continuously seek better ways to serve our clients through technology, process improvements, and creative problem-solving."
              },
              {
                icon: "🎯",
                title: "Customer Obsession",
                desc: "Every decision we make starts with our clients' success. Your growth is our growth, and we're committed to your long-term prosperity."
              },
              {
                icon: "🤲",
                title: "Team Excellence",
                desc: "Our people are our greatest asset. We invest in training, development, and creating an environment where logistics professionals excel."
              },
              {
                icon: "🌱",
                title: "Sustainable Growth",
                desc: "We build for the long term – for our clients, our team, and our planet. Responsible practices guide everything we do."
              },
              {
                icon: "🤲",
                title: "Community Impact",
                desc: "We believe in giving back to the communities where we operate, supporting local initiatives and creating meaningful employment."
              }
            ].map((value, index) => (
              <div key={index} className="bg-gray-900 p-8 rounded-lg border border-orange-500/20 hover:-translate-y-2 transition">
                <div className="text-4xl text-orange-500 mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Meet Our <span className="text-orange-500">Leadership Team</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "SHAH",
                role: "Founder & CEO",
                bio: "15+ years in logistics and supply chain management. Former Amazon operations lead.",
                initial: "SH"
              },
              {
                name: "M ALI",
                role: "Chief Operations Officer",
                bio: "Expert in warehouse optimization and fulfillment strategy. MBA from Stanford.",
                initial: "MA"
              },
              {
                name: "E ALI",
                role: "Director of Technology",
                bio: "Built scalable systems for Client Portal. Passionate about logistics innovation.",
                initial: "EA"
              },
              {
                name: "Emily Watson",
                role: "Head of Client Success",
                bio: "Dedicated to ensuring every client achieves their fulfillment goals.",
                initial: "EW"
              }
            ].map((leader, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg border border-orange-500/20 text-center">
                <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {leader.initial}
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{leader.name}</h3>
                <p className="text-orange-400 text-sm mb-3">{leader.role}</p>
                <p className="text-gray-400 text-sm">{leader.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Businesses <span className="text-orange-500">Choose Us</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="text-orange-500 text-2xl">✓</div>
              <div>
                <h3 className="text-white font-semibold mb-2">99.5% Accuracy Rate</h3>
                <p className="text-gray-400">Our quality control processes ensure your customers receive exactly what they ordered, every time.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-orange-500 text-2xl">✓</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Same-Day Fulfillment</h3>
                <p className="text-gray-400">Orders received before 2 PM EST ship the same day, delighting your customers with fast delivery.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-orange-500 text-2xl">✓</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-gray-400">No hidden fees, no surprises. You always know exactly what you're paying for.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-orange-500 text-2xl">✓</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Dedicated Support</h3>
                <p className="text-gray-400">You're never just a ticket number. Every client gets a dedicated account manager.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-orange-500 text-2xl">✓</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Scalable Solutions</h3>
                <p className="text-gray-400">From 10 orders a month to 10,000 a day – our systems grow with your business.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="text-orange-500 text-2xl">✓</div>
              <div>
                <h3 className="text-white font-semibold mb-2">Real-Time Visibility</h3>
                <p className="text-gray-400">Our client portal gives you 24/7 access to inventory, orders, and shipping status.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Our <span className="text-orange-500">Facilities</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                location: "Arlington, VA",
                size: "150,000 sq ft",
                features: ["Climate-controlled", "24/7 security", "Rail access", "60 dock doors"]
              },
              {
                location: "Houston, TX",
                size: "200,000 sq ft",
                features: ["Port proximity", "Hazardous materials certified", "Cross-docking", "80 dock doors"]
              },
              
            ].map((facility, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg border border-orange-500/30">
                <h3 className="text-xl font-semibold text-white mb-2">{facility.location}</h3>
                <p className="text-orange-400 mb-4">{facility.size}</p>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {facility.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Logistics?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who trust us with their fulfillment. Let's discuss how we can help your business grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition"
            >
              Contact Us Today
            </Link>
            <Link
              to="/login"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Access Client Portal →
            </Link>
          </div>
        </div>
      </section>
     
    </WebsiteLayout>
  );
};

export default AboutPage;