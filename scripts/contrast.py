"""Derive + verify the Sheen palette. Run before writing any component."""
import colorsys

def _lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

def _lum(hex_str):
    h = hex_str.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * _lin(r) + 0.7152 * _lin(g) + 0.0722 * _lin(b)

def ratio(a, b):
    la, lb = _lum(a), _lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return round((hi + 0.05) / (lo + 0.05), 2)

def hsl(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h / 360, l, s)
    return "#%02X%02X%02X" % (round(r * 255), round(g * 255), round(b * 255))

# --- Derivation (palettes.md "Deriving a new palette") -------------------
# Brand hue sampled from Sheen's own menu boards: red #D04129 (h~11),
# orange #E0581E (h~18). Hue kept, lightness discarded and re-fitted to a
# near-black ground.
HUE = 14

TOKENS = {
    # base built FROM the accent hue at low sat, not from neutral grey,
    # so the hero bloom blends instead of banding.
    "background":  hsl(HUE, 0.14, 0.055),
    "surface":     hsl(HUE, 0.11, 0.095),
    "border":      hsl(HUE, 0.09, 0.165),
    "foreground":  hsl(28,   0.28, 0.955),
    "muted":       hsl(20,   0.08, 0.61),
    "accent":      hsl(HUE, 0.87, 0.55),
    "accent_text": hsl(HUE, 0.87, 0.55),  # = accent; it already clears 4.5 on both grounds
    "accent_deep": hsl(HUE, 0.82, 0.35),
}

CHECKS = [
    ("foreground",  "background",  4.5, "primary text"),
    ("foreground",  "surface",     4.5, "text on cards"),
    ("muted",       "background",  4.5, "body copy"),
    ("muted",       "surface",     4.5, "captions on cards"),
    ("accent_text", "background",  4.5, "accent text, body size"),
    ("accent_text", "surface",     4.5, "accent text on cards"),
    ("accent",      "background",  3.0, "display type / rules / icons"),
    ("background",  "accent",      4.5, "label on accent-filled button"),
    ("foreground",  "accent_deep", 4.5, "label on deep-accent button"),
    ("accent",      "surface",     4.5, "accent text on cards (merged tier)"),
]

for k, v in TOKENS.items():
    print(f"  --{k.replace('_','-'):<14} {v}")
print()

failed = 0
for fg, bg, bar, label in CHECKS:
    r = ratio(TOKENS[fg], TOKENS[bg])
    ok = r >= bar
    failed += not ok
    print(f"{'PASS' if ok else 'FAIL'}  {r:>6}  (need {bar})  {label}  [{fg} on {bg}]")
print(f"\n{failed} failing pair(s)." if failed else "\nAll pairs clear.")

# --- Semantic tones ------------------------------------------------------
# The foundation skill requires these stay SEPARATE from --accent so they
# keep meaning through a rebrand. restaurant-noir-ui requires exactly one
# saturated hue. Resolved by keeping them deliberately desaturated and
# reserving them for order-state UI only — never decoration.
TONES = {
    "tone_positive": hsl(152, 0.32, 0.58),
    "tone_caution":  hsl(40,  0.55, 0.62),
    "tone_critical": hsl(356, 0.55, 0.62),
}
print()
for k, v in TONES.items():
    r_bg = ratio(v, TOKENS["background"])
    r_sf = ratio(v, TOKENS["surface"])
    ok = r_bg >= 4.5 and r_sf >= 4.5
    print(f"{'PASS' if ok else 'FAIL'}  {r_bg:>6} / {r_sf:<6} {k} {v}  (bg / surface)")
