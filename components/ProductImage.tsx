import Image from "next/image";

type Props = {
  src?: string;
  title: string;
  sizes: string;
  priority?: boolean;
};

/** Foto produk, atau penanda bila foto belum ada. Parent harus relative + punya rasio. */
export default function ProductImage({ src, title, sizes, priority }: Props) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-blush/40 p-6 text-center">
        <span className="font-heading text-2xl italic text-ink/70">{title}</span>
        <span className="mt-2 text-xs text-muted">Photo coming soon</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${title} wedding gown`}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  );
}
