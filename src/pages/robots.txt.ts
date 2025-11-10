import type { APIRoute } from 'astro';

const fallbackSite = new URL('https://portfolio-v2.example.com');

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? fallbackSite).href;
  const body = [`User-agent: *`, 'Allow: /', `Sitemap: ${new URL('sitemap.xml', base).href}`].join('\n');
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};
