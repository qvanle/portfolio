# Blog Content Migration Design

## Summary

`blog-content` replaces Directus as the source of truth for published posts.
The site reads the published SQLite index and article assets from a CDN while
retaining server-rendered pages and adding browser-side SQLite search.

## Content contract

Published posts remain under `<uuid>/` with `header.json`, localized HTML,
shared CSS, and assets. Global metadata adds `featured` and optional
`cover_image`. The generated index uses stable translation row IDs so its FTS5
external-content table remains consistent across rebuilds. Index generation is
validated and atomically replaces the previous database.

## Reader architecture

The Next.js server fetches `BLOG_CONTENT_URL/index.db` for initial lists,
article resolution, metadata, and sitemap generation. A same-origin endpoint
serves the cached database to browser SQLite for interactive search. Article
HTML is sanitized, relative URLs are resolved against the post content URL,
and article CSS is scoped to prevent site-wide leakage.

Localized slugs resolve to one post UUID. Changing language refreshes server
data and canonicalizes an article URL to the selected translation's slug.

## Deprecated functionality

Directus-backed blog and admin functionality is removed. The contact form
temporarily retains its existing Directus submission endpoint.

## Validation

Tests cover deterministic index rebuilds, FTS integrity, invalid content,
localized lookup, article URL/CSS transformation, CDN failures, browser search,
and the production Next.js build.
