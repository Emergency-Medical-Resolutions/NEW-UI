## Goal

Replace the current homepage with a pixel-faithful rebuild of the dashboard from the reference image — vintage worn-paper book aesthetic, no leftover code from the previous attempt.

## Steps

1. **Wipe `src/routes/index.tsx`** — delete the entire current implementation (all 750+ lines of the previous dashboard).

2. **Rebuild from scratch** to match the reference image precisely:

   - **Frame**: cream/tan aged-paper background flanking a deep navy worn page in the center; faint serif text bleeding through the left and right paper margins; heavy paper grain, creases, and stain/vignette overlay.
   - **Top bar** (on navy): cream serif `FF M. Harvey - SCFD` left, `14:22` right.
   - **Left tab rail** (vertical cream/colored paper tabs, rotated text):
     - Upper group: `FES`, `WII`, `Sleep`, `Call` (Call active — muted gray).
     - Lower group: `Cal` (teal), `Steps` (yellow), `Heart` (coral/pink), `Calorie` (orange).
   - **Period tabs** (top of center column): three cream paper rectangles `Daily` (active — terracotta red), `Lifetime`, `Custom`.
   - **Two empty dashed rounded boxes** stacked in the center column (upper + lower), with the right edges curving inward to follow the arc.
   - **Red circular FAB with `+`** centered on the left edge between the two boxes.
   - **Right arc**: single plain white curved rail with tick marks and hour labels `8, 9, 10, 11, 12, 1300…2300, 0000…0700, 8` running top-to-bottom. No colored call-log segments.
   - **Bottom bar** (navy): bookmark icon left, large serif `OHPΔH` wordmark center, hamburger right.
   - **Texture**: SVG fractal-noise grain + radial vignette + worn blue patches; subtle paper crease across the middle.

3. **Verify** by viewing the preview at the current 721×647 viewport and confirming the layout matches the reference (tab colors, arc labels, empty boxes, paper margins, wordmark).

## Technical details

- File: `src/routes/index.tsx` only. No new routes, no new components, no new dependencies.
- Stays a single self-contained route component with inline styles (matches existing project pattern). No edits to `__root.tsx`, `styles.css`, or any other file.
- Uses an SVG for the arc + ticks + labels; uses an SVG `feTurbulence` filter for grain.
- All colors defined as constants at the top of the file for easy tuning.

## Out of scope

- No interactivity beyond tab selection state (matches what the image shows).
- No real data, no backend, no routing changes.
- No splash page changes.
