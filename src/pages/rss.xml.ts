import type { APIRoute } from 'astro';
import { getBlogPosts, getSiteSettings } from '../lib/content';

const fallbackSite = new URL('https://portfolio-v2.example.com');

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? fallbackSite;
  const settings = await getSiteSettings();
  const posts = getBlogPosts();

  const items = posts
    .map((post) => {
      const link = new URL(`/blog/${post.slug}`, base).href;
      return `    <item>\n      <title><![CDATA[${post.title}]]></title>\n      <link>${link}</link>\n      <guid>${link}</guid>\n      <pubDate>${new Date(post.date).toUTCString()}</pubDate>\n      <description><![CDATA[${post.summary}]]></description>\n    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title><![CDATA[${settings.siteTitle} blog]]></title>\n    <link>${base.href}</link>\n    <description><![CDATA[${settings.tagline ?? settings.bioShort ?? ''}]]></description>\n${items}\n  </channel>\n</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
