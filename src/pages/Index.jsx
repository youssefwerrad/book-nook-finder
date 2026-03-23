import { useState, useCallback } from "react";
import { BookOpen } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import BookGrid from "@/components/BookGrid";
import { useBookSearch } from "@/hooks/useBookSearch";
const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [hasSearched, setHasSearched] = useState(false);
  const {
    data,
    isLoading,
    isError
  } = useBookSearch(searchQuery, searchType);
  const handleSearch = useCallback((query, type) => {
    setSearchQuery(query);
    setSearchType(type);
    setHasSearched(true);
  }, []);
  return <div className="min-h-screen">
      {/* Header */}
      <header className="pt-16 pb-12 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4 opacity-0 animate-fade-up">
          <BookOpen className="w-8 h-8 text-primary" strokeWidth={1.5} />
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight" style={{
          lineHeight: 1.1
        }}>
            Bookwise
          </h1>
        </div>
        <p className="text-muted-foreground max-w-md mx-auto mb-10 opacity-0 animate-fade-up" style={{
        animationDelay: "100ms"
      }}>
          Explore millions of books from the Open Library. Search by title, author, or genre.
        </p>
        <div className="opacity-0 animate-fade-up" style={{
        animationDelay: "200ms"
      }}>
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      {/* Results */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        <BookGrid books={data?.docs ?? []} isLoading={isLoading} isError={isError} hasSearched={hasSearched} totalFound={data?.numFound ?? 0} />
      </main>
    </div>;
};
export default Index;