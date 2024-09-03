import { defineCollection, z, type CollectionEntry } from "astro:content";
import type { CmsCollection } from "decap-cms-core";
import { getCollection } from "astro:content";
import { get_site_settings, type SettingsEntry } from "./settings";
import type { BaseEntry } from ".";
import { URLContext } from "../path";

const url_pattern = "^(https?://[^/]+)?/([.a-zA-Z0-9-]/?)*$";
const SITE_URL = process.env.SITE_URL;
const SITE = new URLContext(process.env.SITE_URL || "http://127.0.0.1/");

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
		if (SITE.parentUrl(entry.slug).pathname == "/") {
			entries.push(entry);
		}
	}
	entries.sort(menu_cmp);
	return entries;
}

export async function get_menu_for_url(
	url: string | URL,
	all_menu_items?: AnyMenuEntry[],
): Promise<AnyMenuEntry | undefined> {
	if (typeof all_menu_items == "undefined") {
		all_menu_items = await get_all_menu_items();
	}
	return all_menu_items.find((entry) => {
		return SITE.urlEqual(entry.data.url, url);
	});
}

export function synthesize_menu_entry({
	parent,
	id,
	title,
	url,
	slug,
	body,
	priority = 0,
}: {
	parent?: AnyMenuEntry;
	id: string;
	title: string;
	url: string | URL;
	slug: string | URL;
	body: string;
	priority?: number;
}): SynthesizedMenuEntry {
	if (typeof url == "string") url = new URL(url, SITE_URL);
	const id_parts = id
		.replace(/\/$/, "")
		.replace(/\.\w+$/, "")
		.split("/");
	return {
		id,
		body,
		slug: SITE.normalizedPath(slug).slice(1),
		collection: "synthesized[menu]",
		data: {
			priority,
			title,
			url: url.href,
		},
	};
}

export async function get_breadcrumbs({
	url,
	title,
	body,
	all_menu_items = undefined,
}: {
	url: string | URL;
	title: string;
	body: string;
	all_menu_items?: AnyMenuEntry[];
}): Promise<AnyMenuEntry[]> {
	if (typeof url == "string") url = new URL(SITE.normalizedUrl(url));
	if (typeof all_menu_items == "undefined") {
		all_menu_items = await get_all_menu_items();
	}
	// infer site crumb from first menu item
	const root_items = await get_root_menu(all_menu_items);
	var site_crumb: AnyMenuEntry | undefined = root_items[0];

	const settings: SettingsEntry | undefined = await get_site_settings();
	if (typeof settings != "undefined") {
		// build site crumb from site settings
		let synthetic_site_crumb = synthesize_menu_entry({
			id: site_crumb?.id || "",
			title:
				settings.data.breadcrumb_text ||
				settings.data.title ||
				site_crumb?.data?.title,
			url: SITE.normalizedPath(
				settings.data.url || site_crumb?.data?.url || "",
			),
			slug: "",
			body: (
				settings.data.breadcrumb_description ||
				settings.body ||
				(settings.data.breadcrumb_text ? settings.data.title : "") ||
				site_crumb?.body ||
				""
			).trim(),
			priority: -1,
		});
		// swap out the old site_crumb for the new
		all_menu_items = all_menu_items.map((entry) =>
			entry.id == synthetic_site_crumb.id ? synthetic_site_crumb : entry,
		);
		// promote the new site_crumb to top slot
		if (!site_crumb) all_menu_items.unshift(synthetic_site_crumb);
		site_crumb = synthetic_site_crumb;
	} else {
	}

	var current_menu: AnyMenuEntry | undefined = await get_menu_for_url(
		url,
		all_menu_items,
	);
	if (typeof current_menu == "undefined") {
		// no menu entry for the current URL
		let parent: AnyMenuEntry | undefined = undefined;
		// walk up the tree looking for our parent
		for (const parent_url of SITE.parentUrls(url)) {
			parent = await get_menu_for_url(parent_url, all_menu_items);
			if (typeof parent != "undefined") break;
		}
		// assume a parent if we didn't find one walking up the tree
		if (typeof parent == "undefined") {
			parent = site_crumb;
		}
		if (SITE.urlEqual(site_crumb.data.url, url)) {
			// we're at the top
			current_menu = site_crumb;
		} else {
			// synthesize the current item under whatever parent we found
			current_menu = synthesize_menu_entry({
				parent,
				id: SITE.urlJoin(parent.slug, ":synthetic:"),
				title,
				url,
				slug: `${SITE.normalizedPath(parent.slug).slice(1)}/sythesized`,
				body,
			});
			// add the synthetic entry to the end of the line
			all_menu_items.push(current_menu);
		}
	}

	// build the crumbs from the current_menu
	const crumbs = [current_menu];
	// insert all parent crumbs
	for (const parent_slug of SITE.parentUrls(current_menu.slug)) {
		for (const entry of all_menu_items) {
			if (SITE.urlEqual(entry.slug, parent_slug)) {
				crumbs.unshift(entry);
			}
		}
	}

	return crumbs;
}
