import { useQuery } from "@tanstack/react-query";

export async function fetchBooks(query, searchType, page = 1) {
  const url = `/api/books/search?q=${encodeURIComponent(query.trim())}&type=${searchType}&page=${page}&limit=12`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

export async function fetchTrending() {
  const res = await fetch("/api/books/trending");
  if (!res.ok) throw new Error("Failed to fetch trending books");
  return res.json();
}

export async function fetchBookDetail(workId) {
  const res = await fetch(`/api/books/detail/${workId}`);
  if (!res.ok) throw new Error("Failed to fetch book details");
  return res.json();
}

export function useBookSearch(query, searchType) {
  return useQuery({
    queryKey: ["books", query, searchType],
    queryFn: () => fetchBooks(query, searchType, 1),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}

export function useTrending() {
  return useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
    staleTime: 1000 * 60 * 10,
  });
}

export function useBookDetail(workId) {
  return useQuery({
    queryKey: ["book", workId],
    queryFn: () => fetchBookDetail(workId),
    enabled: !!workId,
    staleTime: 1000 * 60 * 10,
  });
}

export function getCoverUrl(coverId, size = "M") {
  return `/api/covers/${coverId}?size=${size}`;
}
