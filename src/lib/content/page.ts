import { defineCollection, z } from "astro:content";
import type { CmsCollection } from "decap-cms-core";
import type { BaseEntry } from ".";

export const cms_page: CmsCollection = {
	name: "page",
	label: "Page",
	folder: "src/content/page",
	identifier_field: "title",
	create: true,
	delete: true,
	nested: {
		depth: 3,
	},
	meta: { path: { widget: "string", label: "Page path", index_file: "index" } },
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
			required: false,
		},
		{
			name: "body",
			label: "Body",
			widget: "markdown",
		},
	],
};
export const schema = z.object({
	title: z.string(),
	description: z.string(),
	// Transform string to Date object
	pubDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	heroImage: z.string().optional(),
});

export const page = defineCollection({
	type: "content",
	// Type-check frontmatter using a schema
	schema,
});

export type PageEntry = BaseEntry<"page", z.infer<typeof schema>>;
