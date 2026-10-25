import { emailLink, whatsappLink } from "@/lib/site";

/** Ajakan ngobrol untuk pesanan custom. Tidak tampil bila kontak belum diisi. */
export default function ChatCta({ gownTitle }: { gownTitle?: string }) {
  const message = gownTitle
    ? `Hi Heniez Bridal, I would like to ask about the ${gownTitle} gown.`
    : "Hi Heniez Bridal, I would like to ask about a custom gown.";

  const whatsapp = whatsappLink(message);
  const email = emailLink(gownTitle ? `Question about ${gownTitle}` : "Custom gown");
  if (!whatsapp && !email) return null;

  return (
    <p className="mt-6 text-sm leading-relaxed text-muted">
      Want a custom design or have a question first?{" "}
      <a
        href={whatsapp ?? email!}
        {...(whatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-ink underline underline-offset-4"
      >
        {whatsapp ? "Chat with us on WhatsApp" : "Send us an email"}
      </a>
      .
    </p>
  );
}
