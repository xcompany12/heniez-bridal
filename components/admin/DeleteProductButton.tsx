"use client";

import { deleteProduct } from "@/app/admin/(panel)/products/actions";

export default function DeleteProductButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!window.confirm(`Delete ${title}? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-sm text-red-700 underline underline-offset-4"
      >
        Delete this gown
      </button>
    </form>
  );
}
