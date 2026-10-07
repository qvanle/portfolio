# qvanle.rotexai.com

- **Framework**: Next.js
- **Deployment**: GitHub Pages (static export, `.github/workflows/pages.yml`)
- **Styling**: Tailwind CSS

## Running Locally

```sh
bun install
bun run dev
```

## Environment

Copy `.env.example` to `.env.local` if you want to add local environment values.

## Build

The site is a static export (`output: 'export'`). `BLOG_CONTENT_URL` must be set
at build time: posts are rendered from it, and `scripts/fetch-blog-index.mjs`
copies its `index.db` to `public/blog-index.db` for client-side search.

```sh
BLOG_CONTENT_URL=https://... npm run build   # -> out/
```

New blog posts need a rebuild: the workflow runs every 6 hours, on push, and on
a `blog-content-updated` repository_dispatch event.

Contact form: set `NEXT_PUBLIC_CONTACT_ENDPOINT` (Formspree-compatible JSON
endpoint; the workflow reads it from the `CONTACT_ENDPOINT` repo variable).
