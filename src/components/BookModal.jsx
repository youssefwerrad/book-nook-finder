import { useEffect } from "react";
import { X, Star, Calendar, BookOpen, ExternalLink } from "lucide-react";
import { useBookDetail } from "@/hooks/useBookSearch";

function StarRating({ rating }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-1">
      <span className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= full
                ? "text-amber-500 fill-amber-500"
                : i === full + 1 && half
                ? "text-amber-500 fill-amber-500/50"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </span>
      <span className="text-sm font-medium text-foreground">{rating}</span>
    </span>
  );
}

export default function BookModal({ book, onClose }) {
  const workId = book.key?.replace("/works/", "");
  const { data: detail, isLoading } = useBookDetail(workId);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const coverUrl = detail?.coverUrl || book.coverUrl;
  const title = detail?.title || book.title;
  const authors = book.authors || [];
  const rating = detail?.rating || book.rating;
  const ratingCount = detail?.ratingCount || book.ratingCount;
  const subjects = detail?.subjects || book.subjects || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex gap-6 p-6">
          {/* Cover */}
          <div className="shrink-0 w-32 md:w-44">
            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
              {coverUrl ? (
                <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-10 h-10 text-muted-foreground/40" />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 min-w-0">
            <div>
              <h2 className="text-xl font-serif font-bold text-foreground leading-tight">{title}</h2>
              {authors.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">by {authors.join(", ")}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {rating && (
                <span className="flex items-center gap-1.5">
                  <StarRating rating={rating} />
                  {ratingCount > 0 && (
                    <span className="text-xs text-muted-foreground/60">({ratingCount.toLocaleString()})</span>
                  )}
                </span>
              )}
              {book.firstPublished && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {book.firstPublished}
                </span>
              )}
              {book.pages && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {book.pages} pages
                </span>
              )}
              {book.editions > 1 && (
                <span>{book.editions} editions</span>
              )}
            </div>

            {isLoading && (
              <div className="flex gap-2 mt-1">
                <div className="h-3 bg-secondary rounded animate-pulse w-full" />
                <div className="h-3 bg-secondary rounded animate-pulse w-3/4" />
              </div>
            )}

            {detail?.description && !isLoading && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">About</h3>
                <p className="text-sm text-foreground/80 leading-relaxed line-clamp-5">
                  {detail.description}
                </p>
              </div>
            )}

            {subjects.length > 0 && !isLoading && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Subjects</h3>
                <div className="flex flex-wrap gap-1.5">
                  {subjects.slice(0, 8).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <a
              href={`https://openlibrary.org${book.key}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-auto"
            >
              View on Open Library
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
