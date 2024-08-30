import { type CollectionConfig } from "astro:content";
import type { CmsCollection } from "decap-cms-core";

import { cms_blog_md, cms_blog_mdx, blog } from "../lib/content/blog";
import { cms_menu, menu } from "../lib/content/menu";
import { cms_page, page } from "../lib/content/page";
import { cms_settings, copyright, settings } from "../lib/content/settings";

export const cms_collections: CmsCollection[] = [
	cms_settings,
	cms_menu,
	cms_page,
	cms_blog_md,
	cms_blog_mdx,
];

export const collections: Record<string, CollectionConfig<unknown>> = {
	blog,
	menu,
	page,
	settings,
	copyright,
};
