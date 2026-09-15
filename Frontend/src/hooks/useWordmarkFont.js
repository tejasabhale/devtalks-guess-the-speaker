import { useEffect } from "react";

// Wordmark font: a geometric, slightly technical display face — reads as
// "stage tech event" rather than a generic corporate sans. Loaded once
// at runtime so consuming components stay drop-in; safe to call this
// hook from multiple mounted components, it only injects the <link> once.
const WORDMARK_FONT_ID = "devtalks-wordmark-font";
const WORDMARK_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap";

export const WORDMARK_FONT_CLASS = "font-['Space_Grotesk']";

export function useWordmarkFont() {
  useEffect(() => {
    if (document.getElementById(WORDMARK_FONT_ID)) return;
    const link = document.createElement("link");
    link.id = WORDMARK_FONT_ID;
    link.rel = "stylesheet";
    link.href = WORDMARK_FONT_HREF;
    document.head.appendChild(link);
  }, []);
}
