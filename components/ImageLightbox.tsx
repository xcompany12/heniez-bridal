"use client";

import { useEffect, useRef, useState } from "react";

const ZOOM = 2.5;

type Props = {
  images: string[];
  startIndex: number;
  title: string;
  /** Dipanggil saat ditutup, membawa nomor foto terakhir yang dilihat. */
  onClose: (lastIndex: number) => void;
};

const clamp = (n: number) => Math.min(1, Math.max(0, n));

export default function ImageLightbox({ images, startIndex, title, onClose }: Props) {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const baseRect = useRef<DOMRect | null>(null);

  const count = images.length;

  const go = (delta: number) => {
    setZoomed(false);
    if (imgRef.current) imgRef.current.style.transformOrigin = "50% 50%";
    setIndex((i) => (i + delta + count) % count);
  };

  // Kunci scroll halaman, fokus ke tombol Close, kembalikan fokus saat ditutup.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  // Keyboard: Esc menutup, panah berpindah foto, Tab tetap di dalam dialog.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose(index);
      } else if (e.key === "ArrowLeft" && count > 1) {
        go(-1);
      } else if (e.key === "ArrowRight" && count > 1) {
        go(1);
      } else if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>("button");
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, count, onClose]);

  // Titik yang di-zoom mengikuti posisi kursor atau jari.
  const pan = (clientX: number, clientY: number) => {
    const img = imgRef.current;
    const base = baseRect.current;
    if (!img || !base) return;
    const x = clamp((clientX - base.left) / base.width);
    const y = clamp((clientY - base.top) / base.height);
    img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
  };

  const onImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (zoomed) {
      setZoomed(false);
      return;
    }
    baseRect.current = e.currentTarget.getBoundingClientRect();
    pan(e.clientX, e.clientY);
    setZoomed(true);
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95 text-ivory"
    >
      <div className="flex items-center justify-between px-5 py-4 text-sm">
        <span aria-live="polite">
          {index + 1} / {count}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={() => onClose(index)}
          className="underline underline-offset-4"
        >
          Close
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose(index);
        }}
        onMouseMove={(e) => zoomed && pan(e.clientX, e.clientY)}
        onTouchMove={(e) =>
          zoomed && pan(e.touches[0].clientX, e.touches[0].clientY)
        }
      >
        {/* Foto asli (bukan versi next/image) agar detail tetap tajam saat diperbesar */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={images[index]}
          alt={`${title}, photo ${index + 1}`}
          draggable={false}
          onClick={onImageClick}
          className={`max-h-full max-w-full select-none object-contain transition-transform duration-200 ease-out ${
            zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          style={{
            transform: `scale(${zoomed ? ZOOM : 1})`,
            touchAction: zoomed ? "none" : "auto",
          }}
        />

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-ink/70 px-3 py-4 text-2xl leading-none hover:bg-ink"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-ink/70 px-3 py-4 text-2xl leading-none hover:bg-ink"
            >
              ›
            </button>
          </>
        )}
      </div>

      <p className="px-5 py-2 text-center text-xs text-ivory/70">
        {zoomed
          ? "Move your cursor or finger to look around. Click to zoom out."
          : "Click the photo to zoom in."}
      </p>

      {count > 1 && (
        <ul className="flex justify-center gap-2 overflow-x-auto px-5 pb-4">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => {
                  setZoomed(false);
                  if (imgRef.current) imgRef.current.style.transformOrigin = "50% 50%";
                  setIndex(i);
                }}
                className={`block h-16 w-11 overflow-hidden border ${
                  i === index ? "border-ivory" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
