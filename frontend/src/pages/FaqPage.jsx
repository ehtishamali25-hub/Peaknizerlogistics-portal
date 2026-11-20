// src/pages/FaqPage.jsx
// The FAQ page (/faq). The questions and answers live in src/data/faqContent.js.

import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import { FAQS, FAQ_INTRO } from '../data/faqContent';

const questionId = (index) => `question-${index + 1}`;

const FaqPage = () => {
  return (
    <WebsiteLayout>
      <div className="bg-white text-slate-700">

        {/* Hero */}
        <section className="bg-brand-navy">
          <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
            <span className="text-sm font-semibold text-emerald-300">FAQ</span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-white mt-3 mb-5">
              Frequently Asked Questions About Our 3PL Services
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {FAQ_INTRO}
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">

              {/* List of questions: each one jumps to its answer */}
              <nav aria-label="Questions on this page" className="bg-brand-navy/[0.03] border border-slate-200 rounded-xl p-5 sm:p-6 mb-12">
                <p className="text-sm font-semibold text-brand-navy mb-3">Questions on this page</p>
                <ol className="space-y-2 list-decimal list-inside text-sm sm:text-base">
                  {FAQS.map((faq, index) => (
                    <li key={faq.question} className="text-slate-500">
                      <a href={`#${questionId(index)}`} className="text-emerald-700 hover:underline">
                        {faq.question}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              {/* Questions and answers */}
              <div className="space-y-10">
                {FAQS.map((faq, index) => (
                  <div key={faq.question} id={questionId(index)} className="scroll-mt-24 border-b border-slate-200 pb-10 last:border-b-0">
                    <h2 className="text-2xl font-bold text-brand-navy mb-3">{faq.question}</h2>
                    {faq.answer.map((paragraph, i) => (
                      <p
                        key={i}
                        className={i === 0 ? 'text-slate-800 font-medium leading-relaxed mb-3' : 'text-slate-600 leading-relaxed mb-3'}
                      >
                        {paragraph}
                      </p>
                    ))}
                    {faq.link && (
                      <Link to={faq.link.to} className="inline-block font-semibold text-emerald-700 hover:underline">
                        {faq.link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Closing call to action */}
        <section className="bg-brand-navy py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Still have a question?</h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8">
              Tell us what you sell and where you sell it, and we will reply with a fulfillment plan and pricing within one business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-emerald-400 hover:bg-emerald-300 text-brand-navy font-semibold px-6 py-3 rounded-md transition-colors"
              >
                Contact us
              </Link>
              <Link
                to="/pricing"
                className="border border-white/25 hover:border-white/50 text-white font-semibold px-6 py-3 rounded-md transition-colors"
              >
                See our pricing
              </Link>
            </div>
          </div>
        </section>

      </div>
    </WebsiteLayout>
  );
};

export default FaqPage;