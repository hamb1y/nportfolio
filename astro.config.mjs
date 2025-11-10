import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://portfolio-v2.example.com',
  trailingSlash: 'never',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
