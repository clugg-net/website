export class URLContext {
	base: string;
	origin: string;

	constructor(base: string | URL) {
		if (typeof base == "string") base = new URL(base);
		this.base = base.href;
		this.origin = base.origin;
	}

	normalizedPath(url: string | URL): string {
		if (typeof url == "string") url = new URL(url, this.base);
		return url.pathname.replace(/\/$/, "").replace(/^$/, "/");
	}

	normalizedUrl(url: string | URL): string {
		if (typeof url == "string") url = new URL(url, this.base);
		return `${url.protocol}//${url.hostname}${this.normalizedPath(url)}`;
	}

	urlEqual(a: string | URL, b: string | URL): boolean {
		a = new URL(DEFAULT.normalizedUrl(a));
		b = new URL(DEFAULT.normalizedUrl(b));
		return (
			(a.origin == b.origin ||
				(a.origin == DEFAULT.origin) != (b.origin == DEFAULT.origin)) &&
			this.normalizedPath(a) == this.normalizedPath(b)
		);
	}

	parentUrl(url: string | URL): URL {
		url = new URL(this.normalizedUrl(url));
		const parts = url.pathname.split("/");
		parts.pop();
		return new URL(this.normalizedPath(parts.join("/")), url);
	}

	urlJoin(root: string | URL, path: string): string {
		root = new URL(this.normalizedUrl(root));
		return this.normalizedUrl(
			root.href.replace(/\/$/, "") + this.normalizedPath(path),
		);
	}

	*parentUrls(url: string | URL): Generator<URL> {
		url = new URL(this.normalizedUrl(url));
		while (url.pathname != "/") {
			url = this.parentUrl(url);
			yield url;
		}
	}
}

const DEFAULT = new URLContext("https://0/");
