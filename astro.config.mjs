import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://clugg.net',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  "output": "static"
  // output: "server",
  // adapter: cloudflare()
});