import type { APIRoute } from 'astro';
import { getBlogPosts, getProjects } from '../lib/content';

const fallbackSite = new URL('https://portfolio-v2.example.com');

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? fallbackSite;
  const staticPages = ['/', '/projects', '/blog'];
  const projectUrls = getProjects().map((project) => ({
    loc: `/projects/${project.slug}`,
    lastmod: new Date().toISOString(),
  }));
  const blogUrls = getBlogPosts().map((post) => ({
    loc: `/blog/${post.slug}`,
    lastmod: new Date(post.date).toISOString(),
  }));

  const entries = [
    ...staticPages.map((path) => ({ loc: path, lastmod: new Date().toISOString() })),
    ...projectUrls,
    ...blogUrls,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map((entry) => `  <url><loc>${new URL(entry.loc, base).href}</loc><lastmod>${entry.lastmod}</lastmod></url>`)
    .join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
