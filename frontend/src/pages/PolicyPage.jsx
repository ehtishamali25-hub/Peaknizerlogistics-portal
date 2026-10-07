import WebsiteLayout from './WebsiteLayout';
import { Link } from 'react-router-dom';
import { POLICY_SECTIONS } from '../data/policyContent';

const CONTACT_ICON_PATHS = {
  email: ['M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'],
  phone: ['M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'],
  location: [
    'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
    'M15 11a3 3 0 11-6 0 3 3 0 016 0z'
  ]
};

const PolicyPage = () => {
  return (
    <WebsiteLayout>
      <main className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-brand-navy/[0.03]">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy mb-4">
              Terms of service & 3PL policies
            </h1>
            <div className="w-20 sm:w-24 h-1 bg-brand-emerald mx-auto rounded-full" />
            <p className="text-slate-500 mt-4 text-sm sm:text-base">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8">

              {POLICY_SECTIONS.map((s) =>
                s.highlight ? (
                  <section key={s.num} className="border border-red-300/70 rounded-xl p-4 sm:p-6 bg-red-50">
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold text-sm sm:text-base">{s.num}</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold text-red-700">{s.title}</h2>
                    </div>
                    <div className="ml-10 sm:ml-11 space-y-3 text-sm sm:text-base">
                      {s.body && <p className="text-slate-700">{s.body}</p>}
                      {s.list && (
                        <ul className="list-disc list-inside text-slate-700 space-y-2">
                          {s.list.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      )}
                    </div>
                  </section>
                ) : (
                  <section key={s.num}>
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <span className="text-brand-navy font-bold text-sm sm:text-base">{s.num}</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold text-brand-navy">{s.title}</h2>
                    </div>

                    {s.body && (
                      <p className="text-slate-700 leading-relaxed ml-10 sm:ml-11 text-sm sm:text-base">{s.body}</p>
                    )}

                    {s.list && (
                      <ul className="list-disc list-inside text-slate-700 space-y-1.5 sm:space-y-2 ml-10 sm:ml-11 text-sm sm:text-base">
                        {s.list.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    )}

                    {s.contact && (
                      <div className="ml-10 sm:ml-11 mt-2 flex flex-col space-y-2 text-slate-700 text-sm sm:text-base">
                        {s.contact.map((c) => (
                          <div key={c.value} className="flex items-start gap-2 flex-wrap">
                            <svg className="w-5 h-5 text-brand-navy flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {CONTACT_ICON_PATHS[c.icon].map((d) => (
                                <path key={d} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                              ))}
                            </svg>
                            <span className="break-words">{c.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                )
              )}

              <div className="pt-4 text-center text-xs sm:text-sm text-slate-500 border-t border-slate-200">
                <p>© {new Date().getFullYear()} Peaknizer Logistics. All rights reserved.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-navy-light transition text-sm sm:text-base font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </WebsiteLayout>
  );
};

export default PolicyPage;