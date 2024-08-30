import { defineCollection, z } from "astro:content";
import type { CmsCollection } from "decap-cms-core";
import type { BaseEntry } from ".";

export const cms_blog_md: CmsCollection = {
	name: "blog",
	label: "Blog",
	folder: "src/content/blog",
	identifier_field: "title",
	create: true,
	delete: true,
	// meta: { path: { widget: "string", label: "Menu path", index_file: "index" } },
	fields: [
		{
			name: "title",
			label: "Title",
			widget: "string",
		},
		{
			name: "description",
			label: "Description",
			widget: "string",
		},
		{
			name: "pubDate",
			label: "Date published",
			widget: "datetime",
			date_format: "MMM D YYYY",
			picker_utc: true,
		},
		{
			name: "heroImage",
			label: "Hero image",
			widget: "image",
		},
		{
			name: "body",
			label: "Body",
			widget: "markdown",
		},
	],
};

export const cms_blog_mdx: CmsCollection = Object.assign({}, cms_blog_md, {
	name: "blog+",
	label: "Blog+",
	extension: "mdx",
	format: "yaml-frontmatter",
});

export const schema = z.object({
	title: z.string(),
	description: z.string(),
	// Transform string to Date object
	pubDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	heroImage: z.string().optional(),
});

export const blog = defineCollection({
	type: "content",
	// Type-check frontmatter using a schema
	schema,
});

export type BlogEntry = BaseEntry<"blog", z.infer<typeof schema>>;
