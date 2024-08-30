import type { Render } from "astro:content";

export type BaseEntry<Collection, Schema> = {
    id: string;
    slug: string;
    body: string;
    collection: Collection;
    data: Schema;
} & { render(): Render[".md"] };