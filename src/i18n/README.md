# Dictionaries

`uz.json` is the type source: `Dictionary` in `get-dictionary.ts` is derived from
it, so a key missing from `ru.json` or `en.json` fails `next build` rather than
rendering `undefined` in production.

## Still needs human copy

Russian is authoritative - it is lifted directly from the Figma design.

The `footer.legal` and `footer.founder` strings are **deliberately left in
Russian in all three locales**. They quote a media-registration certificate and
name the editor-in-chief; a machine translation of a legal notice is worse than
no translation. Replace them only with text the editorial office signs off on.

Everything else in `uz.json` and `en.json` is translated and safe to use, but
worth a native review before launch - particularly the Uzbek, which uses the
modifier-letter apostrophe (ʻ, U+02BB) as in `Oʻzbekiston`, not a straight
quote.
