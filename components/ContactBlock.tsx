import {
  CONTACT,
  emailLink,
  instagramHandle,
  instagramLink,
  whatsappLink,
} from "@/lib/site";

/** Blok kontak untuk halaman Appointments. Tidak tampil bila kontak belum diisi. */
export default function ContactBlock() {
  const whatsapp = whatsappLink("Hi Heniez Bridal, I would like to ask about a custom gown.");
  const instagram = instagramLink();
  const email = emailLink("Custom gown");
  if (!whatsapp && !instagram && !email) return null;

  return (
    <div className="mt-14 border-t border-gold pt-5">
      <h3 className="text-lg">Prefer to talk first?</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Planning a custom gown? Message us and we will answer your questions
        before you book.
      </p>
      <ul className="mt-5 space-y-2 text-sm">
        {whatsapp && (
          <li>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              WhatsApp {CONTACT.whatsapp}
            </a>
          </li>
        )}
        {instagram && (
          <li>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              Instagram @{instagramHandle()}
            </a>
          </li>
        )}
        {email && (
          <li>
            <a href={email} className="underline underline-offset-4">
              {CONTACT.email}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
