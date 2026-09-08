# Licensed fonts

Neue Haas Grotesk Display Pro, the face the design specifies:

    NeueHaasDisplayRoman.woff2    ("55 Roman"  - regular, mapped to 400)
    NeueHaasDisplayMedium.woff2   ("65 Medium" - medium,  mapped to 500)
    NeueHaasDisplayBold.woff2     ("75 Bold"   - bold,    mapped to 700)

Converted from the .ttf cuts of the same names with woff2 compression; nothing
else was changed, so the glyph set is whatever the .ttf shipped.

**These files are Latin only.** No Cyrillic at all, and no U+02BB/U+02BC - the
turned commas Uzbek Latin spells oʻ and gʻ with - nor №. `src/lib/fonts.ts`
therefore keeps Inter in the stack behind this family, and the browser falls
through to it per glyph. If Monotype's Cyrillic cuts are ever licensed, add
them here and the Inter fallback can go.

Note: a desktop licence does not cover web embedding - that is a separate
purchase from Monotype, and these .woff2 files are served publicly.
