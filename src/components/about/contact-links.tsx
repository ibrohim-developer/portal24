import { PhoneIcon } from "@/components/ui/icons";
import { TELEGRAM_URL, TelegramIcon } from "@/components/ui/social";
import { strings } from "@/lib/strings";

/**
 * The two contact columns under the intro: the advertising desk's phone
 * number, and the tip line on Telegram.
 *
 * Side by side at every width the design draws, phones included, so the
 * mobile button is the compact one - 14px type and a 16px mark - or the phone
 * number would not fit half a 390 screen. Under 360 there is no half wide
 * enough even for that, and the pair stacks.
 *
 * From `sm` the pair is capped rather than run across the text column. The
 * design sizes both buttons off the longer of the two - they are equal, and
 * neither reaches the measure the paragraph above them does - so a grid that
 * filled the column would draw them half again as wide as the design does.
 */
export function ContactLinks() {
  const about = strings.about;

  return (
    <div className="grid gap-x-5 gap-y-6 min-[360px]:grid-cols-2 sm:max-w-[500px] sm:gap-x-head">
      <ContactColumn title={about.adsTitle}>
        <ContactButton href={`tel:${about.phone.replace(/\s/g, "")}`}>
          <PhoneIcon />
          {about.phone}
        </ContactButton>
      </ContactColumn>

      <ContactColumn title={about.tipTitle}>
        <ContactButton href={TELEGRAM_URL} external>
          <TelegramIcon />
          {about.tipAction}
        </ContactButton>
      </ContactColumn>
    </div>
  );
}

function ContactColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-3 lg:gap-5">
      <h2 className="text-body font-medium text-ink-900 lg:text-lead">
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * The same hairline chip the author page's contact buttons use, centred.
 * The icons are sized from here, not by their own props, so the two marks
 * step down together on mobile.
 */
function ContactButton({
  href,
  external = false,
  children,
}: {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : null)}
      className="flex h-11 items-center justify-center gap-2 whitespace-nowrap bg-hairline px-3 text-caption text-ink-900 transition-opacity hover:opacity-70 lg:h-13 lg:px-4 lg:text-body [&_svg]:size-4 lg:[&_svg]:size-5"
    >
      {children}
    </a>
  );
}
