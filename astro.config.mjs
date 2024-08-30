import { defineConfig, envField } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://github.com/withastro/astro/issues/11820#issuecomment-2307610588
process.env.ASTRO_TELEMETRY_DISABLED = "1";

// import cloudflare from "@astrojs/cloudflare";
const today = new Date();

// https://astro.build/config
export default defineConfig({
	experimental: {
		env: {
			schema: {
				SITE_TITLE: envField.string({
					context: "client",
					access: "public",
					optional: true,
				}),
				SITE_DESCRIPTION: envField.string({
					context: "client",
					access: "public",
					optional: true,
				}),
				SITE_IMAGE: envField.string({
					context: "client",
					access: "public",
					optional: true,
				}),
				SITE_URL: envField.string({
					context: "client",
					access: "public",
					optional: true,
				}),
				COPYRIGHT_NOTICE: envField.string({
					context: "client",
					access: "public",
					optional: true,
				}),
				COPYRIGHT_START_YEAR: envField.number({
					context: "client",
					access: "public",
					optional: true,
					min: 1710,
					max: today.getFullYear(),
				}),
				COPYRIGHT_END_YEAR: envField.number({
					context: "client",
					access: "public",
					default: today.getFullYear(),
					min: 1710,
					max: today.getFullYear(),
				}),
				COPYRIGHT_OWNER: envField.string({
					context: "client",
					access: "public",
					optional: true,
				}),
			},
		},
		contentLayer: true,
	},
	site: process.env.SITE || "http://localhost/",
	base: process.env.BASE || undefined,
	trailingSlash: process.env.TRAILING_SLASH || "never",
	integrations: [mdx(), sitemap()],
	output: "static",
	compressHTML: process.env.COMPRESS_HTML == true,
	// https://vitejs.dev/config/build-options
	vite: {
		assetsInlineLimit: parseInt(
			process.env.VITE_ASSETS_INLINE_LIMIT || "1024",
			10,
		),
	},
	build: {
		format: process.env.BUILD_FORMAT || "preserve",
		inlineStylesheets: process.env.BUILD_INLINE_STYLESHEETS || "auto",
	},
	prefetch: true,
	// output: "server",
	// adapter: cloudflare()
});
