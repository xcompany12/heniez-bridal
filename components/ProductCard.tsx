import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { formatIDR, type Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden bg-line/40">
        <ProductImage
          src={product.images[0]}
          title={product.title}
          sizes="(min-width: 1024px) 28vw, (min-width: 768px) 30vw, 50vw"
        />
      </div>
      <h3 className="mt-4 font-heading text-lg underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-gold">
        {product.title}
      </h3>
      <p className="mt-1 text-sm text-muted">
        {product.silhouette}, {product.material}
      </p>
      <p className="mt-1 text-sm">{formatIDR(product.price)}</p>
    </Link>
  );
}
