import { useQuery } from "@tanstack/react-query";
async function searchBooks(query, searchType) {
  if (!query.trim()) return {
    numFound: 0,
    docs: []
  };
  const paramMap = {
    title: "title",
    author: "author",
    subject: "subject"
  };
  const param = paramMap[searchType];
  const url = `https://openlibrary.org/search.json?${param}=${encodeURIComponent(query.trim())}&limit=24&fields=key,title,author_name,first_publish_year,cover_i,subject,publisher,edition_count`;
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
    placeholderData: prev => prev
  });
}
export function getCoverUrl(coverId, size = "M") {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}