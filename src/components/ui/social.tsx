import type { SocialNetwork } from "@/lib/news/types";

/** 20 is the footer size; the About Us buttons pass 24, as the design does. */
type IconProps = { size?: number };

export function InstagramIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6Zm5.4-3.3a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z"
      />
    </svg>
  );
}

export function YouTubeIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6 4h12a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4Zm4 4.5v7l6-3.5-6-3.5Z"
      />
    </svg>
  );
}

export function FacebookIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1.7 6.6h1.6V6.3h-2c-1.9 0-3 1.1-3 3v1.4H8.7v2.4h1.6v6.5h2.6v-6.5h1.9l.3-2.4h-2.2V9.5c0-.6.2-.9.8-.9Z"
      />
    </svg>
  );
}

export function LinkedInIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm1.6 7.6h2.6V19H5.6V9.6Zm1.3-4.2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM10.1 9.6h2.5v1.3c.4-.7 1.3-1.5 2.7-1.5 2 0 3.3 1.3 3.3 3.9V19h-2.6v-5.2c0-1.3-.5-2.1-1.6-2.1-.9 0-1.4.6-1.7 1.2-.1.2-.1.5-.1.9V19h-2.5V9.6Z"
      />
    </svg>
  );
}

export type SocialMark = {
  label: string;
  Icon: (props: IconProps) => React.ReactElement;
};

/**
 * Network -> mark and brand label, for surfaces that are handed a network name
 * by the data rather than choosing one: the author page's contact buttons.
 *
 * Labels are brand names, so they are not copy and stay out of `strings`.
 */
export const SOCIAL_MARKS: Record<SocialNetwork, SocialMark> = {
  instagram: { label: "Instagram", Icon: InstagramIcon },
  telegram: { label: "Telegram", Icon: TelegramIcon },
  youtube: { label: "YouTube", Icon: YouTubeIcon },
  facebook: { label: "Facebook", Icon: FacebookIcon },
  linkedin: { label: "LinkedIn", Icon: LinkedInIcon },
};

export type SocialLink = SocialMark & { href: string };

/**
 * The publication's four owned accounts, in the Figma order - the same in the
 * footer and on About Us. Telegram is deliberately absent; see below.
 */
export const SOCIAL: SocialLink[] = [
  { ...SOCIAL_MARKS.instagram, href: "https://www.instagram.com/portal24.uz/" },
  { ...SOCIAL_MARKS.youtube, href: "https://www.youtube.com/@PORTAL24LIVE" },
  {
    ...SOCIAL_MARKS.facebook,
    href: "https://www.facebook.com/people/Portal24-Live/61590705485509/",
  },
  {
    ...SOCIAL_MARKS.linkedin,
    href: "https://www.linkedin.com/company/portal24-uz/",
  },
];

/**
 * Telegram is not in SOCIAL: it is a call to action, not one of the four
 * brand chips, and every surface that carries it (header CTA, footer call-out,
 * burger menu) paints it differently. Only the destination and the mark are
 * shared.
 */
export const TELEGRAM_URL = "https://t.me/portal24_official";

export function TelegramIcon({ size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={(size * 17) / 20}
      viewBox="0 0 20 17"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M19.5 1.5 16.8 15.3c-.2 1-.8 1.2-1.6.8l-4.4-3.2-2.1 2c-.2.3-.4.5-.9.5l.3-4.5L16.3 4c.4-.3-.1-.5-.6-.2L5.6 10.2 1.2 8.8C.3 8.5.2 7.9 1.4 7.4L18.2.9c.8-.3 1.5.2 1.3 1.6Z"
        fill="currentColor"
      />
    </svg>
  );
}
