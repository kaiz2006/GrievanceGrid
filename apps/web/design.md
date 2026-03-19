# Design System Specification: Reduced Industrialism



## 1. Overview & Creative North Star

**The Creative North Star: "The Precision Observatory"**



This design system moves away from the generic "SaaS Dashboard" aesthetic toward a high-end engineering tool—one that feels like a bespoke piece of laboratory equipment or a premium flight deck. We achieve this through "Reduced Industrialism": a philosophy that prioritizes technical clarity, functional density, and an atmospheric, dark-room aesthetic.



Instead of a flat grid, the layout uses intentional asymmetry and tonal depth. We break the "template" look by treating the screen as a physical console. Interfaces are not just screens; they are illuminated surfaces where light originates from the data itself.



---



## 2. Colors & Surface Logic



The palette is built on a foundation of **Deep Plum (#230B18)**, creating a chromatic dark mode that feels warmer and more sophisticated than pure black or neutral grey.



### The "No-Line" Rule

Standard 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined solely through background color shifts. A `surface-container-low` section sitting on a `surface` background provides all the structural integrity required. This forces a cleaner, more editorial layout that relies on "negative space as structure."



### Surface Hierarchy & Nesting

Treat the UI as a series of physical layers—like stacked sheets of tinted glass.

* **Base:** `surface` (#230B18) - The deepest level.

* **Sections:** `surface-container-low` (#2D1320) - Primary content areas.

* **Interactive Cards:** `surface-container` (#311724) - Floating UI elements.

* **Elevated Popovers:** `surface-container-highest` (#492C39) - Modals and tooltips.



### The "Glass & Gradient" Rule

To move beyond a "flat" feel, use **Glassmorphism** for floating sidebars or navigation overlays. Apply `surface-variant` at 60% opacity with a `20px` backdrop-blur.



**Signature Texture:** Use a subtle linear gradient on primary CTAs—transitioning from `primary` (#FFCBA2) to `primary-container` (#FFA552) at a 135-degree angle. This gives the "Warm Orange" a glowing, incandescent quality rather than a flat plastic feel.



---



## 3. Typography

We utilize **Inter** (or Geist) for its mathematical precision and high legibility in dark environments.



* **Display (L/M/S):** Used for high-impact data points or section hero titles. Set with tight letter-spacing (-0.02em) to emphasize the "Industrial" feel.

* **Headline & Title:** Use `tertiary` (#F0D291) to give these levels a distinct "Cream" warmth, separating headers from the pure white technical data.

* **Body (L/M/S):** All body text must use `on-surface-variant` (#D9C2B2). Pure white is too harsh; this muted cream reduces eye strain and feels premium.

* **Labels:** For metadata and small captions, use `label-sm` in uppercase with +0.05em tracking. This mimics the engraved labels found on high-end hardware.



---



## 4. Elevation & Depth



### The Layering Principle

Depth is achieved by "stacking" the surface-container tiers. Place a `surface-container-lowest` card inside a `surface-container-low` section to create a soft, natural "recessed" look.



### Ambient Shadows & Dark Glows

Shadows are not black; they are tinted.

* **Floating Elements:** Use a `24px` blur, `0px` offset, at 8% opacity using the `on-primary-fixed` color. This creates a subtle "orange heat" glow behind primary actions, rather than a muddy grey shadow.



### The "Ghost Border" Fallback

If a border is required for accessibility, use the **Ghost Border**: `outline-variant` (#534437) at **15% opacity**. This creates a suggestion of an edge that only becomes visible upon focus. 100% opaque borders are forbidden except for active input states.



---



## 5. Components



### Buttons

* **Primary:** Gradient fill (`primary` to `primary-container`), `on-primary` text, `6px` radius. High-intensity glow on hover.

* **Secondary:** Ghost Border (`outline-variant` at 20%) with `tertiary` text.

* **Tertiary:** Text-only with an underline that appears only on hover, using `primary-fixed-dim`.



### Input Fields

* **Style:** `surface-container-highest` background with a bottom-only 1px "Ghost Border."

* **Focus State:** The bottom border transforms into a 2px `primary` line, and the background glows slightly with a 4% `primary` tint.



### Cards & Lists

* **No Dividers:** Forbid the use of divider lines. Separate list items using `spacing-4` (0.9rem) of vertical white space or by alternating background shades between `surface-container-low` and `surface-container`.



### Data Grids (Signature Component)

Given the "Grid" nature of the application, use 1px `outline-variant` lines at 10% opacity for the grid mesh, but only every 4th row/column to create a "macro-grid" feel without cluttering the UI.



---



## 6. Do’s and Don’ts



### Do:

* **Do** use intentional asymmetry. Align a headline to the far left and the action button to the far right to create "tension."

* **Do** use `Muted Sage` (#C4D6B0) sparingly. It is a utility color for "Success" or "Resolved" states, designed to feel calm, not neon.

* **Do** use the `lg` (0.5rem) border radius for almost everything to maintain the "Industrial" but sophisticated vibe.



### Don't:

* **Don't** use pure black (#000000) or pure white (#FFFFFF). It destroys the "Plum/Cream" chromatic atmosphere.

* **Don't** use drop shadows with offsets. Keep shadows centered and diffused to mimic ambient environmental light.

* **Don't** use standard 1px borders to separate the sidebar from the main content. Use a background shift from `surface-dim` to `surface-container-low`.