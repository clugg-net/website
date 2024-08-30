// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.
import { get_all_settings, type SettingsEntry } from "./lib/content/settings";

let settings: SettingsEntry | undefined = undefined;
for (const entry of await get_all_settings()) {
    if (entry.slug == "site") {
        settings = entry;
    }
}

export const SITE_TITLE = settings?.data?.title || process.env.SITE_TITLE || "SITE_TITLE";
export const SITE_DESCRIPTION = settings?.body || process.env.SITE_DESCRIPTION || "SITE_DESCRIPTION";
export const SITE_IMAGE = settings?.data?.image || process.env.SITE_IMAGE || "";
export const SITE_URL = settings?.data?.url || process.env.SITE_URL || undefined;
