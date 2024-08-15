# [clugg.net][/]

This is the website source for [clugg.net][/].

[/]: https://clugg.net/ "clugg.net"

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/clugg-net/website)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/clugg-net/website)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/clugg-net/website?devcontainer_path=.devcontainer/blog/devcontainer.json)
[![Open in VS Code for the Web](https://badgen.net/badge/icon/Open%20in%20VS%20Code%20for%20the%20Web/?label=&scale=1.6&labelColor=222&color=111&icon=https://github.com/pester/docs/raw/f6cd7cfea49b6dc87ccee562bb9fb1b353d1075f/static/img/features/visual-studio-code.svg)](https://vscode.dev/github.com/clugg-net/website)

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


