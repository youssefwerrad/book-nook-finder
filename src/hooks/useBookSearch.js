import { useQuery } from "@tanstack/react-query";

async function searchBooks(query, searchType) {
  if (!query.trim()) return { numFound: 0, docs: [] };

  const url = `/api/books/search?q=${encodeURIComponent(query.trim())}&type=${searchType}&limit=24`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export function useBookSearch(query, searchType) {
  return useQuery({
    queryKey: ["books", query, searchType],
    queryFn: () => searchBooks(query, searchType),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}

export function getCoverUrl(coverId, size = "M") {
  return `/api/covers/${coverId}?size=${size}`;
}
