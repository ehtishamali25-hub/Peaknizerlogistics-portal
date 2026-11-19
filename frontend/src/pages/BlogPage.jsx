// src/pages/BlogPage.jsx
// The blog list page (/blog). The posts live in src/data/blogPosts.js.
// Visitors can filter by topic and search; with no filter, the newest post is shown large at the top.

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import WebsiteLayout from './WebsiteLayout';
import { BLOG_POSTS, BLOG_CATEGORIES, formatPostDate } from '../data/blogPosts';

const ALL = 'All articles';

// Newest first (posts with the same date keep their order from blogPosts.js)
const POSTS = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));

const countFor = (category) =>
  category === ALL ? POSTS.length : POSTS.filter((post) => post.category === category).length;

// Every word typed must appear in the title, summary, topic or key takeaways
const matchesSearch = (post, words) => {
  if (words.length === 0) return true;
  const text = [post.title, post.excerpt, post.category, ...post.takeaways].join(' ').toLowerCase();
  return words.every((word) => text.includes(word));
};

const CategoryLabel = ({ children }) => (
  <span className="inline-block text-xs font-semibold uppercase tracking-wide text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">
    {children}
  </span>
);

const PostMeta = ({ post }) => (
  <p className="text-sm text-slate-500">
    <time dateTime={post.date}>{formatPostDate(post.date)}</time>
    <span aria-hidden="true"> · </span>
    {post.readMinutes} min read
  </p>
);

// The title link covers the whole card, so the card is clickable anywhere
const cardLinkClass =
  'after:absolute after:inset-0 after:rounded-xl focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-emerald-500 focus-visible:after:ring-offset-2';

const FeaturedPost = ({ post }) => (
  <article className="group relative grid md:grid-cols-2 bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow mb-14">
    <img
      src={post.image}
      alt=""
      width="1200"
      height="630"
      className="w-full aspect-[40/21] md:aspect-auto md:h-full object-cover bg-brand-navy"
    />
    <div className="p-6 sm:p-10 flex flex-col justify-center">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-block text-xs font-semibold uppercase tracking-wide text-white bg-brand-navy rounded-full px-3 py-1">
          Latest
        </span>
        <CategoryLabel>{post.category}</CategoryLabel>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy leading-tight mb-3">
        <Link to={`/blog/${post.slug}`} className={cardLinkClass}>
          {post.title}
        </Link>
      </h2>
      <p className="text-slate-600 leading-relaxed mb-5">{post.excerpt}</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PostMeta post={post} />
        <span aria-hidden="true" className="text-sm font-semibold text-emerald-700 group-hover:underline">
          Read article →
        </span>
      </div>
    </div>
  </article>
);

const PostCard = ({ post }) => (
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
      <h3 className="text-xl font-bold text-brand-navy leading-snug mt-3 mb-2">
        <Link to={`/blog/${post.slug}`} className={cardLinkClass}>
          {post.title}
        </Link>
      </h3>
      <p className="text-slate-600 leading-relaxed mb-5">{post.excerpt}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
        <PostMeta post={post} />
        <span aria-hidden="true" className="text-sm font-semibold text-emerald-700 group-hover:underline">
          Read article →
        </span>
      </div>
    </div>
  </article>
);

const BlogPage = () => {
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState('');

  const words = useMemo(() => query.toLowerCase().split(/\s+/).filter(Boolean), [query]);
  const filtering = category !== ALL || words.length > 0;

  const results = useMemo(
    () => POSTS.filter((post) => (category === ALL || post.category === category) && matchesSearch(post, words)),
    [category, words]
  );

  // With no filter, the newest post is shown large and the rest in the grid
  const featured = filtering ? null : results[0];
  const gridPosts = featured ? results.slice(1) : results;

  const resultText = `${results.length} ${results.length === 1 ? 'article' : 'articles'}`
    + (category !== ALL ? ` in ${category}` : '')
    + (words.length ? ` matching "${query.trim()}"` : '');

  const clearFilters = () => {
    setCategory(ALL);
    setQuery('');
  };

  return (
    <WebsiteLayout>
      <div className="bg-white text-slate-700">

        {/* Hero */}
        <section className="bg-brand-navy">
          <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
            <span className="text-sm font-semibold text-emerald-300">Blog</span>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-white mt-3 mb-5">
              3PL &amp; Ecommerce Fulfillment Blog
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Practical guides on Amazon FBA prep, Walmart WFS, TikTok Shop, multichannel fulfillment and shipping,
              written for small and growing brands that sell online in the USA.
            </p>
          </div>
        </section>

        <section className="bg-brand-navy/[0.03] py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6">

            {/* Topics and search */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-10">
              <div role="group" aria-label="Filter articles by topic" className="flex flex-wrap gap-2">
                {[ALL, ...BLOG_CATEGORIES].map((name) => {
                  const active = category === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCategory(name)}
                      className={`text-sm font-semibold rounded-full border px-3.5 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                        active
                          ? 'bg-brand-navy border-brand-navy text-white'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-brand-navy hover:text-brand-navy'
                      }`}
                    >
                      {name} <span className={active ? 'text-slate-300' : 'text-slate-500'}>({countFor(name)})</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full sm:w-80 xl:w-64 flex-none">
                <label htmlFor="blog-search" className="sr-only">Search articles</label>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-5-5" />
                </svg>
                <input
                  id="blog-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles"
                  autoComplete="off"
                  className="w-full bg-white border border-slate-300 rounded-md pl-10 pr-3 py-2.5 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Tells screen reader users how many articles match */}
            <p aria-live="polite" className="sr-only">{filtering ? resultText : ''}</p>

            {featured && <FeaturedPost post={featured} />}

            {results.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold text-brand-navy mb-6">
                  {filtering ? resultText.charAt(0).toUpperCase() + resultText.slice(1) : 'More articles'}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {gridPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                <h2 className="text-2xl font-bold text-brand-navy mb-2">No articles found</h2>
                <p className="text-slate-600 mb-6">Try another word, or look through all our articles.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-brand-navy hover:bg-brand-navy-light text-white font-semibold px-6 py-3 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                  Show all articles
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Closing call to action */}
        <section className="bg-brand-navy py-16 sm:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to hand off your fulfillment?</h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-8">
              Tell us what you sell and where you sell it, and we will reply with a fulfillment plan and pricing within one business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-emerald-400 hover:bg-emerald-300 text-brand-navy font-semibold px-6 py-3 rounded-md transition-colors"
              >
                Get a free quote
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

export default BlogPage;