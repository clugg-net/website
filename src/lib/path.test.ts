import { describe, it, expect } from "vitest";
import { URLContext } from "./path";
const ctx = new URLContext("https://example.com/");

describe("normalizedPath", () => {
	it("only returns the pathname", () => {
		expect(ctx.normalizedPath("/")).toEqual("/");
		expect(ctx.normalizedPath("https://example.com/")).toEqual("/");
		expect(ctx.normalizedPath("/foo")).toEqual("/foo");
		expect(ctx.normalizedPath("https://example.com/foo")).toEqual("/foo");
		expect(ctx.normalizedPath("/bar?baz")).toEqual("/bar");
		expect(ctx.normalizedPath("https://example.com/bar?baz")).toEqual("/bar");
	});
	it("never strips the root slash", () => {
		expect(ctx.normalizedPath("https://example.com/")).toEqual("/");
		expect(ctx.normalizedPath("/")).toEqual("/");
	});
	it("corrects missing root slash", () => {
		expect(ctx.normalizedPath("https://example.com")).toEqual("/");
		expect(ctx.normalizedPath("")).toEqual("/");
		expect(ctx.normalizedPath("foo")).toEqual("/foo");
	});
	it("removes trailing slashes", () => {
		expect(ctx.normalizedPath("/foo/")).toEqual("/foo");
	});
});

describe("normalizedUrl", () => {
	it("only returns the pathname", () => {
		expect(ctx.normalizedUrl("/")).toEqual("https://example.com/");
		expect(ctx.normalizedUrl("https://example.com/")).toEqual(
			"https://example.com/",
		);
		expect(ctx.normalizedUrl("/foo")).toEqual("https://example.com/foo");
		expect(ctx.normalizedUrl("https://example.com/foo")).toEqual(
			"https://example.com/foo",
		);
		expect(ctx.normalizedUrl("/bar?baz")).toEqual("https://example.com/bar");
		expect(ctx.normalizedUrl("https://example.com/bar?baz")).toEqual(
			"https://example.com/bar",
		);
	});
	it("never strips the root slash", () => {
		expect(ctx.normalizedUrl("https://example.com/")).toEqual(
			"https://example.com/",
		);
		expect(ctx.normalizedUrl("/")).toEqual("https://example.com/");
	});
	it("corrects missing root slash", () => {
		expect(ctx.normalizedUrl("https://example.com")).toEqual(
			"https://example.com/",
		);
		expect(ctx.normalizedUrl("")).toEqual("https://example.com/");
	});
	it("removes trailing slashes", () => {
		expect(ctx.normalizedUrl("/foo")).toEqual("https://example.com/foo");
		expect(ctx.normalizedUrl("/foo/")).toEqual("https://example.com/foo");
	});
});
describe("parentUrl", () => {
	it("only returns the pathname", () => {
		expect(ctx.parentUrl("/").href).toEqual("https://example.com/");
		expect(ctx.parentUrl("https://example.com/").href).toEqual(
			"https://example.com/",
		);
		expect(ctx.parentUrl("/foo").href).toEqual("https://example.com/");
		expect(ctx.parentUrl("https://example.com/foo").href).toEqual(
			"https://example.com/",
		);
		expect(ctx.parentUrl("/foo/bar").href).toEqual("https://example.com/foo");
		expect(ctx.parentUrl("https://example.com/foo/bar").href).toEqual(
			"https://example.com/foo",
		);
		expect(ctx.parentUrl("/bar?baz").href).toEqual("https://example.com/");
		expect(ctx.parentUrl("https://example.com/bar?baz").href).toEqual(
			"https://example.com/",
		);
	});
	it("never strips the root slash", () => {
		expect(ctx.parentUrl("https://example.com/").href).toEqual(
			"https://example.com/",
		);
		expect(ctx.parentUrl("/").href).toEqual("https://example.com/");
	});
	it("corrects missing root slash", () => {
		expect(ctx.parentUrl("https://example.com").href).toEqual(
			"https://example.com/",
		);
		expect(ctx.parentUrl("").href).toEqual("https://example.com/");
	});
	it("removes trailing slashes", () => {
		expect(ctx.parentUrl("/foo/").href).toEqual("https://example.com/");
	});
});
describe("urlJoin", () => {
	it("only returns the pathname", () => {
		expect(ctx.urlJoin("/", "/")).toEqual("https://example.com/");
		expect(ctx.urlJoin("https://example.com/", "/")).toEqual(
			"https://example.com/",
		);
		expect(ctx.urlJoin("/foo", "bar")).toEqual("https://example.com/foo/bar");
		expect(ctx.urlJoin("https://example.com/foo", "bar")).toEqual(
			"https://example.com/foo/bar",
		);
		expect(ctx.urlJoin("/bar?baz", "qux")).toEqual(
			"https://example.com/bar/qux",
		);
		expect(ctx.urlJoin("https://example.com/bar?baz", "qux")).toEqual(
			"https://example.com/bar/qux",
		);
	});
	it("never strips the root slash", () => {
		expect(ctx.urlJoin("https://example.com/", "")).toEqual(
			"https://example.com/",
		);
		expect(ctx.urlJoin("/", "/")).toEqual("https://example.com/");
	});
	it("corrects missing root slash", () => {
		expect(ctx.urlJoin("https://example.com", "")).toEqual(
			"https://example.com/",
		);
		expect(ctx.urlJoin("", "")).toEqual("https://example.com/");
	});
	it("removes trailing slashes", () => {
		expect(ctx.urlJoin("/foo/", "")).toEqual("https://example.com/foo");
	});
});
describe("urlEqual", () => {
	it("ignores trailing slash inconsistencies", () => {
		expect(ctx.urlEqual("/", "/")).toEqual(true);
		expect(ctx.urlEqual("", "")).toEqual(true);
		expect(ctx.urlEqual("/", "")).toEqual(true);
		expect(ctx.urlEqual("", "/")).toEqual(true);
		expect(ctx.urlEqual("foo", "/foo/")).toEqual(true);
		expect(ctx.urlEqual("/foo", "/foo/")).toEqual(true);
		expect(ctx.urlEqual("/foo/", "/foo/")).toEqual(true);
		expect(ctx.urlEqual("/foo/", "/foo")).toEqual(true);
	});
	it("assumes comparisons between the same base URL", () => {
		expect(ctx.urlEqual("https://example.com/", "/")).toEqual(true);
		expect(ctx.urlEqual("https://example.com/", "")).toEqual(true);
		expect(ctx.urlEqual("https://example.com", "/")).toEqual(true);
		expect(ctx.urlEqual("https://example.com/foo", "foo")).toEqual(true);
		expect(ctx.urlEqual("/foo", "https://example.com/foo")).toEqual(true);
		expect(ctx.urlEqual("/foo", "https://other.site/foo")).toEqual(true);
		expect(ctx.urlEqual("https://other.site/foo", "foo")).toEqual(true);
	});
	it("ignores origin equivalence", () => {
		expect(
			ctx.urlEqual("http://example.com/", "http://example.com:80/"),
		).toEqual(true);
		expect(
			ctx.urlEqual("https://example.com/", "https://example.com:443/"),
		).toEqual(true);
	});
	it("notices origin mismatches", () => {
		expect(ctx.urlEqual("http://example.com/", "https://example.com/")).toEqual(
			false,
		);
		expect(ctx.urlEqual("https://example.com/", "http://other.com/")).toEqual(
			false,
		);
		expect(
			ctx.urlEqual("https://example.com/", "http://example.com:81/"),
		).toEqual(false);
	});
	it("notices path mismatches", () => {
		expect(ctx.urlEqual("https://example.com/", "/foo")).toEqual(false);
		expect(ctx.urlEqual("/foo", "/")).toEqual(false);
	});
	it("ignores non-path components", () => {
		expect(ctx.urlEqual("/foo", "/foo?bar")).toEqual(true);
		expect(ctx.urlEqual("/foo", "/foo#bar")).toEqual(true);
	});
});
describe("URL.origin", () => {
	it("strips default port", () => {
		expect(new URL("http://example.com:80/").origin).toEqual(
			"http://example.com",
		);
	});
	it("strips credentials", () => {
		expect(new URL("http://user:pass@example.com/").origin).toEqual(
			"http://example.com",
		);
	});
});
