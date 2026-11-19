// src/pages/BlogPostPage.jsx
// One blog article (/blog/<slug>). The text of every article lives in src/data/blogPosts.js.
// An address that does not match any article shows the "Page not found" page.

import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import NotFound from './NotFound';
import { BLOG_AUTHOR, BLOG_POSTS, getPost, formatPostDate } from '../data/blogPosts';
import { SITE } from '../seo/seoPages';

// "What a 3PL does" -> "what-a-3pl-does" (used to jump to a section)
const sectionId = (heading) =>
  heading.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Up to 3 other articles: same topic first, then the newest of the rest
const relatedPosts = (post) => {
  const others = [...BLOG_POSTS]
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => b.date.localeCompare(a.date));
  return [...others.filter((p) => p.category === post.category), ...others.filter((p) => p.category !== post.category)].slice(0, 3);
};

const SOCIAL_ICONS = {
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  facebook: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
};

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2';

const CategoryLabel = ({ children }) => (
  <span className="inline-block text-xs font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">
    {children}
  </span>
);

const ShareRow = ({ post }) => {
  const [copied, setCopied] = useState(false);
  const url = `${SITE}/blog/${post.slug}`;
  const encoded = encodeURIComponent(url);
  const shareLinks = [
    { name: 'LinkedIn', icon: SOCIAL_ICONS.linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}` },
    { name: 'Facebook', icon: SOCIAL_ICONS.facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt('Copy this link:', url);
    }
  };

  const buttonClass = `inline-flex items-center gap-2 text-sm font-semibold text-slate-700 border border-slate-300 hover:border-brand-navy hover:text-brand-navy rounded-full px-4 py-2 transition-colors ${focusRing}`;

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6 mt-12">
      <span className="text-sm font-semibold text-slate-600 mr-1">Share this article</span>
      {shareLinks.map(({ name, icon, href }) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d={icon} />
          </svg>
          {name}
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ))}
      <button type="button" onClick={copyLink} className={buttonClass}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
          <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
        </svg>
        Copy link
      </button>
      <span aria-live="polite" className="text-sm font-semibold text-emerald-700">
        {copied ? 'Link copied' : ''}
      </span>
    </div>
  );
};

const Section = ({ section }) => {
  const ListTag = section.listType === 'ol' ? 'ol' : 'ul';
  const paragraphClass = 'text-lg text-slate-700 leading-relaxed mb-5';
  return (
    <section aria-labelledby={sectionId(section.heading)}>
      <h2 id={sectionId(section.heading)} className="text-2xl sm:text-3xl font-bold text-brand-navy leading-snug mt-12 mb-4 scroll-mt-28">
        {section.heading}
      </h2>
      {section.paragraphs?.map((text, i) => (
        <p key={i} className={paragraphClass}>{text}</p>
      ))}
      {section.list && (
        <ListTag
          className={`${ListTag === 'ol' ? 'list-decimal marker:font-bold' : 'list-disc'} marker:text-emerald-600 pl-6 space-y-2 text-lg text-slate-700 leading-relaxed mb-5`}
        >
          {section.list.map((item) => (
            <li key={item} className="pl-1">{item}</li>
          ))}
        </ListTag>
      )}
      {section.after?.map((text, i) => (
        <p key={i} className={paragraphClass}>{text}</p>
      ))}
      {section.link && (
        <p className="mb-5">
          <Link to={section.link.to} className={`text-lg font-semibold text-emerald-700 hover:underline rounded ${focusRing}`}>
            {section.link.label} <span aria-hidden="true">→</span>
          </Link>
        </p>
      )}
    </section>
  );
};

const RelatedCard = ({ post }) => (
  <article className="group relative flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
    <img
      src={post.image}
      alt=""
      width="1200"
      height="630"
      loading="lazy"
      decoding="async"
      className="w-full aspect-[40/21] object-cover bg-brand-navy"
    />
    <div className="flex flex-col flex-1 p-6">
      <div>
        <CategoryLabel>{post.category}</CategoryLabel>
      </div>
      <h3 className="text-lg font-bold text-brand-navy leading-snug mt-3 mb-4">
        <Link
          to={`/blog/${post.slug}`}
          className="after:absolute after:inset-0 after:rounded-xl focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-emerald-500 focus-visible:after:ring-offset-2"
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-auto text-sm text-slate-500">
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        <span aria-hidden="true"> · </span>
        {post.readMinutes} min read
      </p>
    </div>
  </article>
);

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) return <NotFound />;

  const related = relatedPosts(post);

  return (
    <WebsiteLayout>
      <div className="bg-white text-slate-700">

        {/* Article header */}
        <header className="bg-brand-navy/[0.03] border-b border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-3xl">
                <nav aria-label="Breadcrumb" className="mb-6">
                  <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <li>
                      <Link to="/" className={`hover:text-brand-navy hover:underline rounded ${focusRing}`}>Home</Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li>
                      <Link to="/blog" className={`hover:text-brand-navy hover:underline rounded ${focusRing}`}>Blog</Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page" className="text-slate-700 font-medium truncate max-w-[16rem] sm:max-w-md">
                      {post.title}
                    </li>
                  </ol>
                </nav>
                <CategoryLabel>{post.category}</CategoryLabel>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight mt-4 mb-5">
                  {post.title}
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-6">{post.excerpt}</p>
                <p className="text-sm text-slate-500">
                  By <span className="font-semibold text-slate-700">{BLOG_AUTHOR}</span>
                  <span aria-hidden="true"> · </span>
                  <time dateTime={post.date} className="whitespace-nowrap">{formatPostDate(post.date)}</time>
                  <span aria-hidden="true"> · </span>
                  <span className="whitespace-nowrap">{post.readMinutes} min read</span>
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">

            {/* Article */}
            <article className="max-w-3xl">
              <img
                src={post.image}
                alt={post.imageAlt}
                width="1200"
                height="630"
                fetchPriority="high"
                className="w-full aspect-[40/21] object-cover rounded-xl bg-brand-navy"
              />

              {/* Key takeaways */}
              <section aria-labelledby="key-takeaways" className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 sm:p-8 mt-10">
                <h2 id="key-takeaways" className="text-xl font-bold text-brand-navy mb-4">Key takeaways</h2>
                <ul className="space-y-3">
                  {post.takeaways.map((item) => (
                    <li key={item} className="flex gap-3 text-slate-700 leading-relaxed">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-emerald-600 flex-none mt-0.5">
                        <path d="M5 12.5l4.5 4.5L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {post.sections.map((section) => (
                <Section key={section.heading} section={section} />
              ))}

              <ShareRow post={post} />

              {/* Call to action */}
              <div className="bg-brand-navy rounded-xl p-8 sm:p-10 mt-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Need a 3PL partner in the USA?</h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Peaknizer Logistics preps, stores and ships for Amazon, Walmart, Shopify, eBay and TikTok Shop sellers.
                  No minimum volume, and orders received by 2 PM ship the same day.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/contact"
                    className={`text-center bg-emerald-400 hover:bg-emerald-300 text-brand-navy font-semibold px-6 py-3 rounded-md transition-colors ${focusRing} focus-visible:ring-offset-brand-navy`}
                  >
                    Get a free quote
                  </Link>
                  <Link
                    to="/pricing"
                    className={`text-center border border-white/25 hover:border-white/50 text-white font-semibold px-6 py-3 rounded-md transition-colors ${focusRing} focus-visible:ring-offset-brand-navy`}
                  >
                    See our pricing
                  </Link>
                </div>
              </div>
            </article>

            {/* Side column on large screens: jump to a section */}
            <aside className="hidden lg:block">
              <nav aria-label="In this article" className="border border-slate-200 rounded-xl p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">In this article</p>
                <ol className="space-y-3 text-sm">
                  <li>
                    <a href="#key-takeaways" className={`text-slate-700 hover:text-emerald-700 hover:underline rounded ${focusRing}`}>
                      Key takeaways
                    </a>
                  </li>
                  {post.sections.map((section) => (
                    <li key={section.heading}>
                      <a href={`#${sectionId(section.heading)}`} className={`text-slate-700 hover:text-emerald-700 hover:underline rounded ${focusRing}`}>
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="bg-brand-navy/[0.03] border border-slate-200 rounded-xl p-6 mt-6">
                <p className="font-bold text-brand-navy mb-2">Questions about your fulfillment?</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Call or WhatsApp us at +1 (571) 307-4461, or email info@peaknizerlogistics.com.
                </p>
                <Link to="/contact" className={`text-sm font-semibold text-emerald-700 hover:underline rounded ${focusRing}`}>
                  Contact us <span aria-hidden="true">→</span>
                </Link>
              </div>
            </aside>
          </div>
        </div>

        {/* More articles */}
        <section aria-labelledby="related-articles" className="bg-brand-navy/[0.03] border-t border-slate-200 py-14 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <h2 id="related-articles" className="text-2xl sm:text-3xl font-bold text-brand-navy">Related articles</h2>
                <Link to="/blog" className={`font-semibold text-emerald-700 hover:underline rounded ${focusRing}`}>
                  See all articles <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {related.map((p) => (
                  <RelatedCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </WebsiteLayout>
  );
};

export default BlogPostPage;