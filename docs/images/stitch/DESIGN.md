# Design System Specification: The Editorial Humanist

This design system is crafted for a premier Japanese advertising agency, balancing the precision of modern design with the warmth of traditional hospitality (*Omotenashi*). It moves away from the rigid, cold grids of standard corporate tech and toward a high-end editorial experience that feels curated, intentional, and profoundly sincere.

## 1. Overview & Creative North Star

**Creative North Star: "The Digital Curator"**
The system is not a container for content; it is a curator of it. We avoid the "template" look by embracing **Intentional Asymmetry** and **Tonal Depth**. By breaking the rigid 12-column expectations with overlapping elements and generous, "breathing" whitespace, we signal a brand that is confident enough to leave room for the user’s thoughts.

The experience should feel like a high-end physical portfolio—tactile, layered, and premium. We achieve "Trust" through sophisticated typography and "Warmth" through a palette that avoids pure blacks and harsh whites in favor of organic, ink-like navies and paper-like neutrals.

---

## 2. Colors & Surface Philosophy

Our palette is rooted in the concept of *Kage* (shadow) and *Hikari* (light). We use deep navies for sincerity and warm terracottas for human energy.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Structural boundaries must be created exclusively through background shifts. For example, a `surface-container-low` section should sit against a `surface` background to create a soft, sophisticated transition. Lines feel restrictive; tonal shifts feel expansive.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine Washi paper.
- **Surface (`#fafaf5`):** Your base canvas.
- **Surface Container Lowest (`#ffffff`):** Reserved for the most prominent interactive elements (e.g., a "hero" card).
- **Surface Container High/Highest (`#e8e8e3` / `#e3e3de`):** Used for background depth behind secondary content or sidebars.

### The "Glass & Gradient" Rule
To avoid a flat, "out-of-the-box" feel:
- **Glassmorphism:** Use semi-transparent `surface` colors with a 20px-40px `backdrop-blur` for floating navigation bars or overlay modals.
- **Signature Textures:** Apply subtle linear gradients transitioning from `primary` (`#0d1925`) to `primary_container` (`#222e3a`) on large CTAs to provide a "sheen" reminiscent of silk or high-quality ink.

---

## 3. Typography: The Prestige Mix

The typographic soul of this system lies in the tension between the modern Sans-Serif (Manrope) and the prestigious Serif (Noto Serif).

*   **Display & Headlines (Manrope):** These are the "architectural" elements. Use `display-lg` (3.5rem) with tight letter-spacing for a bold, modern impact. This conveys the agency's "Modern" edge.
*   **Body & Titles (Noto Serif):** These are the "narrative" elements. By using serifs for body text and titles, we lean into the "Sincere and Warm" direction. It feels like reading a classic journal.
*   **Labels (Manrope):** Use `label-md` in all-caps with 0.1rem letter-spacing for metadata or categories to maintain a clean, organized hierarchy.

---

## 4. Elevation & Depth: Tonal Layering

We reject traditional material shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." Place a `surface_container_lowest` card atop a `surface_container_low` background. This creates a soft, natural lift without the "heaviness" of a drop shadow.
*   **Ambient Shadows:** If a floating effect is mandatory (e.g., a floating Action Button), use a shadow color tinted with `#1a1c19` (on-surface) at 5% opacity, with a blur radius of at least 32px. It should look like a soft glow of light, not a dark smudge.
*   **The Ghost Border Fallback:** If accessibility requires a container boundary, use `outline_variant` (`#c4c6cc`) at **15% opacity**. This creates a "suggestion" of a border rather than a hard edge.

---

## 5. Components

### Buttons
*   **Primary:** Background: `primary` (`#0d1925`), Text: `on_primary` (`#ffffff`). Use `xl` (0.75rem) roundedness. Avoid sharp corners to maintain the "warm" feel.
*   **Secondary:** Background: `secondary` (`#82533f`), Text: `on_secondary`. This provides the terracotta "pop" of creativity against the navy.
*   **Interaction:** On hover, shift the background color to the `fixed_dim` variant rather than changing opacity.

### Cards & Lists
*   **Rule:** Forbid divider lines.
*   **Separation:** Use the Spacing Scale (specifically `8` or `10`) to create "islands" of content. Separate list items using a subtle background shift to `surface_container_low` on hover.

### Input Fields
*   **Style:** Minimalist. No enclosing box. Use a 1px `outline_variant` at the bottom only.
*   **Focus State:** The bottom line transitions to `secondary` (terracotta), and the label (in Noto Serif) shifts upward.

### Signature Component: The "Editorial Reveal"
For imagery, use a slight parallax effect or an asymmetrical "reveal" mask where the image is slightly offset from its background container (`surface_container_highest`), creating a layered, collage-like feel.

---

## 6. Do’s and Don’ts

### Do
*   **Use Asymmetry:** Place a text block in the center-left and an image in the bottom-right of a container to create visual interest.
*   **Embrace the "Off-White":** Always use `background` (`#fafaf5`) instead of pure white for large surfaces to reduce eye strain and increase warmth.
*   **Prioritize Human Imagery:** When using photos, ensure they feature warm lighting and authentic human interactions.

### Don’t
*   **No "Standard" Grids:** Do not align every element to a perfectly vertical line. Shift secondary text or decorative serif accents 1-2 spacing units off-axis.
*   **No High-Contrast Borders:** Never use `on_surface` or `outline` at 100% opacity for borders. It breaks the "premium" feel.
*   **Avoid Cold Minimalism:** Do not strip away all personality. If a screen feels too "tech-heavy," add a `title-lg` serif accent or a `secondary_container` (warm beige) background block.

---

## 7. Spacing & Rhythm

Consistency is key to a "Sincere" experience.
*   **Standard Padding:** Use `spacing.6` (2rem) for internal container padding.
*   **Section Gaps:** Use `spacing.16` (5.5rem) or `spacing.20` (7rem) between major sections. Large gaps are a luxury; they tell the user we are not in a rush to sell, but here to inform.