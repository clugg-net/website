import { defineCollection, z, type CollectionEntry } from "astro:content";
import type { CmsCollection } from "decap-cms-core";
import { getCollection } from "astro:content";
import { get_site_settings, type SettingsEntry } from "./settings";
import type { BaseEntry } from ".";

const url_pattern = "^(https?://[^/]+)?/([.a-zA-Z0-9-]/?)*$";
const SITE_URL = process.env.SITE_URL;

export const cms_menu: CmsCollection = {
	name: "menu",
	label: "Menu",
	folder: "src/content/menu",
	identifier_field: "path",
	create: true,
	delete: true,
	summary: "{{priority}}: {{slug}} {{title}}",
	sortable_fields: ["path", "priority"],
	nested: {
		depth: 3,
	},
	editor: { preview: false },
	meta: { path: { widget: "string", label: "Menu path", index_file: "index" } },
	fields: [
		{
			name: "title",
			label: "Title",
			widget: "string",
		},
		{
			name: "url",
			label: "URL Path",
			widget: "string",
			pattern: [url_pattern, "Invalid path"],
		},
		{
			name: "priority",
			label: "Priority",
			hint: "Lower numbers come first",
			widget: "number",
			value_type: "int",
			min: 0,
		},
		{
			name: "body",
			label: "Description",
			widget: "string",
			required: false,
		},
	],
};
export const schema = z.object({
	title: z.string(),
	priority: z.number().int().min(0),
	url: z.string().regex(new RegExp(url_pattern), "Invalid pattern"),
});

export const menu = defineCollection({
	type: "content",
	schema,
});

export type MenuData = z.infer<typeof schema>;

// https://github.com/withastro/astro/issues/8999#issuecomment-1793580182
export type MenuEntry = BaseEntry<"menu", z.infer<typeof schema>>;

export interface SynthesizedMenuEntry {
	id: string;
	slug: string;
	body: string;
	collection: `synthesized[${CollectionEntry<"menu">["collection"]}]`;
	data: MenuData;
}
export type AnyMenuEntry = MenuEntry | SynthesizedMenuEntry;

export async function get_all_menu_items(): Promise<MenuEntry[]> {
	return (await getCollection("menu")) as MenuEntry[];
}

export function menu_cmp(a: AnyMenuEntry, b: AnyMenuEntry): number {
	const [pa, pb] = [a.data.priority.valueOf(), b.data.priority.valueOf()];
	if (pa === pb) {
		// same priority, sort by path.
		return a.id.localeCompare(b.id);
	} else {
		return pa < pb ? -1 : 1;
	}
}

export async function get_root_menu(
	all_menu_items?: AnyMenuEntry[],
): Promise<AnyMenuEntry[]> {
	const entries: AnyMenuEntry[] = [];
	if (typeof all_menu_items == "undefined") {
		all_menu_items = await get_all_menu_items();
	}
	for (const entry of all_menu_items) {
		const parts = entry.slug.split("/");
		if (parts.length == 1) {
			entries.push(entry);
		}
	}
	entries.sort(menu_cmp);
	return entries;
}

export async function get_menu_for_url(
	url: string,
	all_menu_items?: AnyMenuEntry[],
): Promise<AnyMenuEntry | undefined> {
	if (typeof all_menu_items == "undefined") {
		all_menu_items = await get_all_menu_items();
	}
	// try for an exact match against the full URL (allows for external linked menu items)
	const entry = all_menu_items.find((entry) => entry.data.url == url);
	if (typeof entry !== "undefined") return entry;
	// fallback to matching against the pathname
	const path = new URL(url, SITE_URL).pathname;
	return all_menu_items.find((entry) => entry.data.url == path);
}

export function synthesize_menu_entry(
	parent: AnyMenuEntry | undefined,
	id: string,
	title: string,
	url: string,
	body: string,
	priority: number = 0,
): SynthesizedMenuEntry {
	const id_parts = id
		.replace(/\/$/, "")
		.replace(/\.\w+$/, "")
		.split("/");
	const slug_parts = parent
		? parent.slug
			.replace(/\/index$/, "")
			.split("/")
			.filter((part) => part.length > 0)
		: [];
	slug_parts.push(id_parts[id_parts.length - 1]);
	return {
		id,
		body,
		slug: slug_parts.join("/"),
		collection: "synthesized[menu]",
		data: {
			priority,
			title,
			url,
		},
	};
}

export async function get_breadcrumbs(
	url: string,
	title: string,
	body: string,
	all_menu_items?: AnyMenuEntry[],
): Promise<AnyMenuEntry[]> {
	if (typeof all_menu_items == "undefined") {
		all_menu_items = await get_all_menu_items();
	}
	const url_obj = new URL(url, SITE_URL);
	let site_crumb: AnyMenuEntry | undefined = undefined;
	const settings: SettingsEntry | undefined = await get_site_settings();
	if (typeof settings !== "undefined") {
		// build site crumb from site settings
		site_crumb = synthesize_menu_entry(
			undefined,
			settings.id,
			settings.data.breadcrumb_text || settings.data.title,
			settings.data.url
				? new URL(settings.data.url, SITE_URL).pathname
				: `${url_obj.protocol}${url_obj.host}/`,
			settings.data.breadcrumb_description ||
				settings.body ||
				settings.data.breadcrumb_text
				? settings.data.title
				: "",
			-1,
		);
	} else {
		// infer site crumb from first menu item
		const root_items = await get_root_menu(all_menu_items);
		site_crumb = root_items[0];
	}

	let current_menu: AnyMenuEntry | undefined = await get_menu_for_url(
		url,
		all_menu_items,
	);
	if (typeof current_menu == "undefined") {
		let parent_url: string = new URL(url, SITE_URL).pathname;
		let parent: AnyMenuEntry | undefined = undefined;
		while (typeof parent == "undefined" && parent_url.length > 0) {
			parent_url = parent_url.replace(/\/[^\/]*$/, "");
			parent = await get_menu_for_url(parent_url);
		}
		if (typeof parent == "undefined") {
			parent = site_crumb;
		}
		current_menu = synthesize_menu_entry(
			parent,
			url_obj.pathname,
			title,
			url,
			body,
		);
		all_menu_items.push(current_menu);
	}
	const crumbs = [current_menu];
	const slug_parts = current_menu.slug.split("/");
	while (slug_parts.length > 0) {
		slug_parts.pop();
		const parent_slug = slug_parts.join("/");
		for (const entry of all_menu_items) {
			if (entry.slug == parent_slug) {
				crumbs.unshift(entry);
				break;
			}
		}
	}
	if (typeof site_crumb !== "undefined") {
		if (site_crumb.data.url !== crumbs[0].data.url) {
			crumbs.unshift(site_crumb);
		}
	}

	return crumbs;
}
