import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:8080,http://localhost:5173").split(",");
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman) and listed origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
}));
app.use(express.json());

// ─── Constants ────────────────────────────────────────────────────────────────
const OPEN_LIBRARY_BASE = "https://openlibrary.org";
const COVER_BASE = "https://covers.openlibrary.org";
const SEARCH_FIELDS =
  "key,title,author_name,first_publish_year,cover_i,subject,publisher,edition_count";
const VALID_SEARCH_TYPES = ["title", "author", "subject"];
const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 100;

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /api/books/search
 * Query params:
 *   q        - search query (required)
 *   type     - "title" | "author" | "subject"  (default: "title")
 *   limit    - number of results (default: 24, max: 100)
 *   page     - page number (default: 1)
 */
app.get("/api/books/search", async (req, res) => {
  const { q, type = "title", limit = DEFAULT_LIMIT, page = 1 } = req.query;

  // --- Validation ---
  if (!q || !q.trim()) {
    return res.status(400).json({ error: "Query parameter 'q' is required." });
  }

  if (!VALID_SEARCH_TYPES.includes(type)) {
    return res.status(400).json({
      error: `Invalid search type. Must be one of: ${VALID_SEARCH_TYPES.join(", ")}.`,
    });
  }

  const parsedLimit = Math.min(parseInt(limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const offset = (parsedPage - 1) * parsedLimit;

  // --- Build upstream URL ---
  const params = new URLSearchParams({
    [type]: q.trim(),
    limit: parsedLimit,
    offset,
    fields: SEARCH_FIELDS,
  });

  const upstreamUrl = `${OPEN_LIBRARY_BASE}/search.json?${params}`;

  try {
    const upstreamRes = await fetch(upstreamUrl);

    if (!upstreamRes.ok) {
      return res.status(502).json({
        error: "Upstream Open Library API returned an error.",
        status: upstreamRes.status,
      });
    }

    const data = await upstreamRes.json();

    // Shape and return the response
    return res.json({
      numFound: data.numFound ?? 0,
      page: parsedPage,
      limit: parsedLimit,
      docs: data.docs ?? [],
    });
  } catch (err) {
    console.error("[/api/books/search] Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch books from Open Library." });
  }
});

/**
 * GET /api/books/:key
 * Fetches full details for a single book by its Open Library key (e.g. /works/OL1M).
 * The key path segment should be URL-encoded (e.g. %2Fworks%2FOL1M).
 */
app.get("/api/books/*key", async (req, res) => {
  const key = req.params.key;

  // Normalise — allow either "/works/OL1M" or "works/OL1M"
  const normalisedKey = key.startsWith("/") ? key : `/${key}`;

  const upstreamUrl = `${OPEN_LIBRARY_BASE}${normalisedKey}.json`;

  try {
    const upstreamRes = await fetch(upstreamUrl);

    if (upstreamRes.status === 404) {
      return res.status(404).json({ error: "Book not found." });
    }

    if (!upstreamRes.ok) {
      return res.status(502).json({
        error: "Upstream Open Library API returned an error.",
        status: upstreamRes.status,
      });
    }

    const data = await upstreamRes.json();
    return res.json(data);
  } catch (err) {
    console.error("[/api/books/:key] Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch book details." });
  }
});

/**
 * GET /api/covers/:id
 * Proxies book cover images from Open Library.
 * Query params:
 *   size - "S" | "M" | "L"  (default: "M")
 */
app.get("/api/covers/:id", async (req, res) => {
  const { id } = req.params;
  const { size = "M" } = req.query;

  if (!["S", "M", "L"].includes(size)) {
    return res.status(400).json({ error: "Size must be S, M, or L." });
  }

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Cover ID must be a number." });
  }

  const upstreamUrl = `${COVER_BASE}/b/id/${id}-${size}.jpg`;

  try {
    const upstreamRes = await fetch(upstreamUrl);

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).json({ error: "Cover not found." });
    }

    // Forward content-type and stream the image
    res.setHeader("Content-Type", upstreamRes.headers.get("content-type") || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    upstreamRes.body.pipe(res);
  } catch (err) {
    console.error("[/api/covers/:id] Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch cover image." });
  }
});

/**
 * GET /api/health
 * Simple health-check endpoint.
 */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── 404 handler for unknown API routes ──────────────────────────────────────
app.use("/api/*path", (_req, res) => {
  res.status(404).json({ error: "API route not found." });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Express server running at http://localhost:${PORT}`);
  console.log(`   → GET /api/health`);
  console.log(`   → GET /api/books/search?q=dune&type=title`);
  console.log(`   → GET /api/books/works/OL8479867W`);
  console.log(`   → GET /api/covers/12345?size=M\n`);
});
