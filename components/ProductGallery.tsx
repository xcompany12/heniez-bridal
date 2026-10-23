"use client";

import { useState } from "react";
import ProductImage from "@/components/ProductImage";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const hasMany = images.length > 1;

  return (
    <div className={hasMany ? "flex flex-col-reverse gap-4 md:flex-row" : ""}>
      {hasMany && (
        <ul className="flex gap-3 md:w-20 md:shrink-0 md:flex-col">
          {images.map((src, i) => (
            <li key={src} className="w-16 md:w-full">
              <button
                type="button"
                aria-label={`Show photo ${i + 1} of ${images.length}`}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
                className={`relative block aspect-[2/3] w-full overflow-hidden border transition-opacity ${
                  i === index
                    ? "border-ink"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <ProductImage src={src} title={title} sizes="80px" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative aspect-[2/3] min-w-0 flex-1 bg-line/40">
        <ProductImage
          src={images[index]}
          title={title}
          sizes="(min-width: 1024px) 45vw, 100vw"
          priority
        />
      </div>
    </div>
  );
}
