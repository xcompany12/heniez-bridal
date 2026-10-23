// Penanda sementara. Dihapus saat halamannya dibangun di tahap berikutnya.
export default function PagePlaceholder({
  title,
  note,
}: {
  title: string;
  note: string;
}) {
  return (
    <section className="container-site py-24 md:py-32">
      <h1 className="text-4xl md:text-5xl">{title}</h1>
      <p className="mt-6 max-w-xl text-muted">{note}</p>
    </section>
  );
}
