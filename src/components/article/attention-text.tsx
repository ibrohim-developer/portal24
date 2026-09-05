/**
 * The "AttentionText" pull-quote (Figma 1852:19350).
 *
 * Measured off the file rather than guessed: the panel is accent at 8%
 * (rgb(236 241 245) sampled over white), padded 12px on every side, and the
 * 2px accent rule sits *inside* that padding - 12px in from the panel edge,
 * with a further 13px before the text starts at x=27. A plain `border-l-2` on
 * the panel itself would put the rule on the edge and lose that inset, so the
 * rule lives on an inner element.
 *
 * One line of 20/32 plus the padding gives the design's 56px block height.
 */
export function AttentionText({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-accent/8 p-3">
      <p className="border-l-2 border-accent pl-[13px] text-lead text-accent">
        {children}
      </p>
    </div>
  );
}
