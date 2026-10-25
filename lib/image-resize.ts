import {
  RESIZE_THRESHOLD_BYTES,
  UPLOAD_MAX_EDGE,
  UPLOAD_QUALITY,
} from "@/lib/product-form";

/**
 * Memperkecil foto besar (misalnya dari kamera profesional) di browser sebelum
 * diunggah. Sisi terpanjang dibatasi UPLOAD_MAX_EDGE piksel dan hasilnya JPEG.
 * Foto yang sudah kecil dikirim apa adanya. Bila pengecilan gagal atau tidak
 * membuat file lebih kecil, foto asli yang dipakai.
 */
export async function prepareForUpload(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });

    const longEdge = Math.max(bitmap.width, bitmap.height);
    const needsResize =
      longEdge > UPLOAD_MAX_EDGE || file.size > RESIZE_THRESHOLD_BYTES;
    if (!needsResize) {
      bitmap.close();
      return file;
    }

    const scale = Math.min(1, UPLOAD_MAX_EDGE / longEdge);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.fillStyle = "#ffffff"; // latar putih untuk PNG transparan
    ctx.fillRect(0, 0, width, height);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", UPLOAD_QUALITY)
    );
    if (!blob || blob.size >= file.size) return file;

    return new File([blob], `${file.name.replace(/\.\w+$/, "")}.jpg`, {
      type: "image/jpeg",
    });
  } catch {
    return file;
  }
}
