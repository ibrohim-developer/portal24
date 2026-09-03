# Licensed fonts

Drop the Neue Haas Grotesk Display Pro web files here:

    NeueHaasDisplayRoman.woff2    (Pro 5 - regular, weight 400)
    NeueHaasDisplayMedium.woff2   (Pro 6 - medium,  weight 500)

Then follow the commented block in `src/lib/fonts.ts` to switch from the Inter
placeholder to `next/font/local`.

Both cuts must include Cyrillic, or the Russian pages will fall back mid-word.

Note: a desktop licence does not cover web embedding - that is a separate
purchase from Monotype.
