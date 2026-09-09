import {
  ABOUT_FOCUS_TOPICS,
  CATEGORY_TINT,
  type AboutFocusTopic,
} from "@/lib/categories";

export function FocusGrid({
  labels,
}: {
  labels: Record<AboutFocusTopic, string>;
}) {
  return (
    <ul className="grid auto-rows-[60px] grid-cols-2 gap-3 lg:auto-rows-[90px] lg:gap-5">
      {ABOUT_FOCUS_TOPICS.map((topic) => (
        <li
          key={topic}
          className={`flex items-center justify-center px-2 text-center text-body font-medium text-ink-900 lg:text-title-sm ${CATEGORY_TINT[topic]}`}
        >
          {labels[topic]}
        </li>
      ))}
    </ul>
  );
}
