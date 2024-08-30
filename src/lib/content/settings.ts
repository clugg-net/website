import { defineCollection, getCollection, z } from "astro:content";
import type { CmsCollection } from "decap-cms-core";
import type { BaseEntry } from ".";
const today = new Date();

export const SETTINGS_PATH = "src/content/settings/site.md";

export const cms_settings: CmsCollection = {
	label: "Settings",
	name: "settings",
	format: "yaml-frontmatter",
	files: [
		{
			label: "Site Metadata",
			name: "site",
			file: SETTINGS_PATH,
			fields: [
				{
					name: "title",
					label: "Title",
					widget: "string",
					required: true,
				},
				{
					name: "breadcrumb_text",
					label: "Breadcrumb text",
					widget: "string",
					hint: "Text used instead of title in breadcrumbs",
					required: false,
				},
				{
					name: "breadcrumb_description",
					label: "Breadcrumb description",
					widget: "string",
					hint: "Text used instead of description in breadcrumbs",
					required: false,
				},
				{
					name: "image",
					label: "Image",
					hint: "Site wide fallback image, can be set per page.",
					widget: "image",
					required: false,
				},
				{
					name: "url",
					label: "URL",
					hint: "Site root URL",
					widget: "string",
					required: false,
				},
				{
					name: "body",
					label: "Description",
					hint: "Site description",
					widget: "markdown",
					required: false,
				},
			],
		},
		{
			label: "Copyright",
			name: "copyright",
			file: "src/content/copyright/index.mdx",
			fields: [
				{
					name: "first_published",
					label: "First published",
					hint: "The earliest year for any content on this site",
					widget: "number",
					required: true,
					default: today.getFullYear(),
					value_type: "int",
					min: 1710,
					max: today.getFullYear(),
				},
				{
					name: "last_published",
					label: "Last published",
					hint: "Leave blank to use current year",
					widget: "number",
					required: false,
					value_type: "int",
					min: 1710,
					max: today.getFullYear(),
				},
				{
					name: "owner",
					label: "Owner",
					hint: "Eg: Tyson Clugg",
					widget: "string",
					required: true,
				},
				{
					name: "rights",
					label: "Rights",
					hint: "Eg: Some rights reserved.",
					widget: "string",
					required: false,
				},
				{
					name: "title",
					label: "Title",
					hint: "Title for the /copyright page",
					widget: "string",
					required: false,
				},
				{
					name: "body",
					label: "Body",
					hint: "Content for the /copyright page",
					widget: "markdown",
					required: false,
				},
			],
		},
	],
};

export const copyright_schema = z.object({
	description: z.string().optional(),
	copyright: z.string().optional(),
	first_published: z.number().optional(),
	last_published: z.number().optional(),
	owner: z.string().optional(),
	rights: z.string().optional(),
	title: z.string().optional(),
});

export const copyright = defineCollection({
	type: "content",
	schema: copyright_schema,
});

export type CopyrightEntry = BaseEntry<
	"copyright",
	z.infer<typeof copyright_schema>
>;

export const settings_schema = z.object({
	title: z.string(),
	image: z.string().optional(),
	url: z.string().optional(),
	breadcrumb_text: z.string().optional(),
	breadcrumb_description: z.string().optional(),
});

export type SettingsData = z.infer<typeof settings_schema>;

export type SettingsEntry = BaseEntry<
	"settings",
	z.infer<typeof settings_schema>
>;

export const settings = defineCollection({
	type: "content",
	schema: settings_schema,
});

export async function get_all_settings(): Promise<SettingsEntry[]> {
	return (await getCollection("settings")) as SettingsEntry[];
}

export async function get_site_settings(): Promise<SettingsEntry | undefined> {
	for (const entry of await get_all_settings()) {
		if (entry.slug == "site") return entry;
	}
}
