import BookCard from "./BookCard";
import { Loader2, SearchX } from "lucide-react";
export default function BookGrid({
  books,
  isLoading,
  isError,
  hasSearched,
  totalFound
}) {
  if (isLoading) {
    return <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Searching the library…</p>
      </div>;
  }
  if (isError) {
    return <div className="text-center py-24">
        <p className="text-destructive font-medium">Something went wrong. Please try again.</p>
      </div>;
  }
  if (hasSearched && books.length === 0) {
    return <div className="flex flex-col items-center justify-center py-24 gap-3 opacity-0 animate-fade-up">
        <SearchX className="w-12 h-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">No books found. Try a different search.</p>
      </div>;
  }
  if (!hasSearched) return null;
  return <div>
      <p className="text-sm text-muted-foreground mb-6 opacity-0 animate-fade-in">
        Found <span className="font-semibold text-foreground">{totalFound.toLocaleString()}</span> results
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {books.map((book, i) => <BookCard key={book.key} book={book} index={i} />)}
      </div>
    </div>;
}