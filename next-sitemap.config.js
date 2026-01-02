/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL || 'https://kanadojo.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/api/*',
    '/_next/*',
    '/*/train/*' // Exclude dynamic training pages
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/'
      },
      {
        userAgent: 'Googlebot',
        allow: '/'
      },
      {
        userAgent: 'Bingbot',
        allow: '/'
      }
    ],
    additionalSitemaps: []
  },
  transform: async (config, path) => {
    // Custom priority for important pages
    const priorities = {
      '/': 1.0,
      '/kana': 0.9,
      '/kanji': 0.9,
      '/vocabulary': 0.9,
      '/translate': 0.9,
      '/academy': 0.8,
      '/preferences': 0.6,
      '/achievements': 0.7,
      '/progress': 0.7
    };

    const changefreqs = {
      '/': 'daily',
      '/kana': 'weekly',
      '/kanji': 'weekly',
      '/vocabulary': 'weekly',
      '/translate': 'daily',
      '/academy': 'weekly',
      '/preferences': 'monthly',
      '/achievements': 'weekly',
      '/progress': 'weekly'
    };

    // Extract base path without locale (e.g., /en/kana -> /kana)
    const localePattern = /^\/(en|es|ja)(\/.*)?$/;
    const match = path.match(localePattern);
    const basePath = match ? (match[2] || '/') : path;

    // Check if this is an academy post URL (matches /academy/[slug] pattern)
    const isAcademyPost = /^\/academy\/[^/]+$/.test(basePath);

    // Determine priority and changefreq using base path
    let priority = priorities[basePath] || config.priority;
    let changefreq = changefreqs[basePath] || config.changefreq;

    // Academy posts get priority 0.8 and weekly changefreq
    if (isAcademyPost) {
      priority = 0.8;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: [
        {
          href: `https://kanadojo.com/en${basePath}`,
          hreflang: 'en'
        },
        {
          href: `https://kanadojo.com/es${basePath}`,
          hreflang: 'es'
        },
        {
          href: `https://kanadojo.com/ja${basePath}`,
          hreflang: 'ja'
        },
        {
          href: `https://kanadojo.com/en${basePath}`,
          hreflang: 'x-default'
        }
      ]
    };
  }
};
