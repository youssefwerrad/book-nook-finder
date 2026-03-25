import { useState } from "react";
import { getCoverUrl } from "@/hooks/useBookSearch";

export default function BookCard({ book, index }) {
  const [imgFailed, setImgFailed] = useState(false);

  const authors = book.author_name?.slice(0, 2).join(", ") ?? "Unknown author";
  const year = book.first_publish_year;
  const coverUrl = book.cover_i && !imgFailed ? getCoverUrl(book.cover_i, "M") : null;

  return (
    <div
      className="group flex flex-col gap-2 opacity-0 animate-fade-up"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Cover */}
      <div className="aspect-[2/3] rounded-lg overflow-hidden bg-secondary flex items-center justify-center">
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
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5">
        <p className="text-xs font-medium text-foreground leading-tight line-clamp-2">
          {book.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">{authors}</p>
        {year && (
          <p className="text-xs text-muted-foreground/70">{year}</p>
        )}
      </div>
    </div>
  );
}
