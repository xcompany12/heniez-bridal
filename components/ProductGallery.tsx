"use client";

import { useState } from "react";
import ImageLightbox from "@/components/ImageLightbox";
import ProductImage from "@/components/ProductImage";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const hasMany = images.length > 1;
  const current = images[index];

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
          src={current}
          title={title}
          sizes="(min-width: 1024px) 45vw, 100vw"
          priority
        />

        {current && (
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            aria-label={`Zoom in on ${title} photo`}
            className="absolute inset-0 cursor-zoom-in"
          >
            {/* Penanda zoom, terutama untuk layar sentuh yang tidak punya kursor */}
            <span
              aria-hidden="true"
              className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center bg-ivory/90 text-ink"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="M15.5 15.5L21 21M10.5 8v5M8 10.5h5" />
              </svg>
            </span>
          </button>
        )}
      </div>

      {zoomOpen && (
        <ImageLightbox
          images={images}
          startIndex={index}
          title={title}
          onClose={(last) => {
            setIndex(last);
            setZoomOpen(false);
          }}
        />
      )}
    </div>
  );
}
