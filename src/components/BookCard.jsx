import { useState } from "react";
import { Star } from "lucide-react";
import { getCoverUrl } from "@/hooks/useBookSearch";

export default function BookCard({ book, index, onClick }) {
  const [imgFailed, setImgFailed] = useState(false);

  const authors = book.authors?.slice(0, 2).join(", ")
    ?? book.author_name?.slice(0, 2).join(", ")
    ?? "Unknown author";
  const year = book.firstPublished || book.first_publish_year;
  const coverUrl = book.coverUrl || (book.coverId && !imgFailed ? getCoverUrl(book.coverId, "M") : null)
    || (book.cover_i && !imgFailed ? getCoverUrl(book.cover_i, "M") : null);

  return (
    <div
      className="group flex flex-col gap-2 opacity-0 animate-fade-up cursor-pointer"
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={() => onClick?.(book)}
    >
      {/* Cover */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="text-3xl"></span>
        )}
        {book.rating && (
          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            {book.rating}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-medium text-foreground leading-tight line-clamp-2">
          {book.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">{authors}</p>
        {year && <p className="text-xs text-muted-foreground/70">{year}</p>}
      </div>
    </div>
  );
}
