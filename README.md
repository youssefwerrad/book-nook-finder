# 📚 Book Nook Finder

A React + Express full-stack app for searching millions of books via the [Open Library](https://openlibrary.org) API.

## Architecture

```
book-nook-finder/
├── server/
│   └── index.js        ← Express backend (port 3001)
└── src/
    ├── components/     ← React UI components (.jsx)
    ├── hooks/
    │   └── useBookSearch.js  ← Calls Express API
    └── pages/
```

The **Express backend** proxies all requests to Open Library, keeping API logic server-side.

```
Browser → Vite (8080) → /api/* proxy → Express (3001) → Open Library
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/books/search` | Search books |
| `GET` | `/api/books/:key` | Get book details |
| `GET` | `/api/covers/:id` | Proxy cover image |

### Search query params
| Param | Default | Description |
|-------|---------|-------------|
| `q` | *(required)* | Search query |
| `type` | `title` | `title` / `author` / `subject` |
| `limit` | `24` | Results per page (max 100) |
| `page` | `1` | Page number |

### Examples
```bash
GET /api/books/search?q=dune&type=title
GET /api/books/search?q=tolkien&type=author&limit=10&page=2
GET /api/books/works/OL8479867W
GET /api/covers/12345?size=M
GET /api/health
```

---

## Getting Started

```bash
npm install
npm run dev        # starts both frontend (8080) and backend (3001)
```

### Individual commands
```bash
npm run client:dev   # Vite frontend only
npm run server:dev   # Express with nodemon (auto-restart)
npm run server:start # Express (no auto-restart)
npm run build        # production build
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```env
PORT=3001
VITE_API_URL=           # blank in dev (Vite proxy handles it)
CORS_ORIGIN=http://localhost:8080,http://localhost:5173
```
