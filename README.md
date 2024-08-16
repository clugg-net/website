# [clugg.net][/]

This is the website source for [clugg.net][/].

[/]: https://clugg.net/ "clugg.net"

| Code Editor | |
| --- | --- |
| StackBlitz | [▶️ Web](https://stackblitz.com/github/clugg-net/website)<br />
| Visual Studio Code | [▶️ SSH](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=git@github.com:clugg-net/website.git)<br /> [▶️ HTTPS](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/clugg-net/website) |

### Features:

- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support
- ✅ Static site with no server applications
- ✅ JavaScript progressive enhancement
- ✅ User comments with [Giscus](https://github.com/giscus/giscus)

## 🗃️ Project Structure

Inside of this project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro`, `.mdx` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun run dev`             | Starts local dev server at `localhost:4321`      |
| `bun run build`           | Build your production site to `./dist/`          |
| `bun run preview`         | Preview your build locally, before deploying     |
| `bun run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun run astro -- --help` | Get help using the Astro CLI                     |

See [the Astro documentation](https://docs.astro.build) for more details.

## ✍ Content Management System

[Decap CMS](https://docs.astro.build/en/guides/cms/decap-cms/) is installed at <https://clugg.net/admin> allowing contributors to add and update content.

## ✅ Testing

Unit tests are executed via `bun test`.

Some key files (eg: `sitemap.xml`) are committed to the repository, but also rebuilt as part of the build phase during testing and deployment.
If the build process detects changes to these files, the build is failed.
When a pull-request is being reviewed, the changes to these key files should be visible.

## 🚀 Deployment

If the tests and build pass, the PR can be merged to the main branch which will trigger a deployment to the live site.

## 🕵 Debugging and telemetry


