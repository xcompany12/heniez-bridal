/**
 * Panah untuk <select> buatan sendiri. Browser Apple (Safari di iPad dan iPhone)
 * menggambar select dengan bentuk bawaan sendiri kecuali appearance dimatikan,
 * jadi panahnya kita gambar sendiri lewat background.
 */
export const SELECT_STYLE = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none' stroke='%23333333' stroke-width='1.5'%3E%3Cpath d='M1 1.5l5 5 5-5'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 1rem center",
} as const;
