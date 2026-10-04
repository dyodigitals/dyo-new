## Mobile Layout & Carousel Alignment Fix

The page currently looks **exactly how I want it to look on desktop**, so **do not make any changes to the desktop layout, styling, spacing, positioning, animations, or behavior**.

I only want the following issues fixed on **mobile**:

### 1. Initial Mobile Zoom
When the page is first loaded on a mobile device, it appears slightly **zoomed in**. I have to manually pinch-zoom out to get the normal intended viewport.

- Fix the mobile viewport so the page loads at the correct/default scale.
- The user should **not need to manually zoom out** after loading.
- Make sure the entire scene is displayed at the intended mobile scale from the beginning.
- Do not affect the desktop viewport or scaling.

### 2. Initial Scene/Carousel Center Alignment
After getting the page to the correct mobile scale, the **scene and its carousel are not perfectly aligned initially**.

On desktop:
- The carousel is centered correctly relative to the screen.
- The initial center card is perfectly centered.
- The scene does not appear rotated or offset.

On mobile:
- The carousel appears centered relative to the screen, but the **initial center card looks slightly rotated/offset instead of being perfectly centered**.
- The initial state should match the desktop behavior as closely as possible, while still being responsive to the mobile viewport.

Please fix the mobile positioning/calculation so that:
- The carousel's center card is exactly centered in the viewport.
- The initial card does not appear unintentionally rotated or shifted.
- The scene itself is correctly aligned with the carousel.
- Do not change the existing desktop behavior.

### 3. Last Scene / Scroll-End Alignment
There is also an issue when scrolling all the way down to the **last (4th) scene** on mobile.

On desktop:
- When the page reaches the end of the scroll, the **4th scene's carousel center card is perfectly centered in the viewport**.

On mobile:
- When I reach the bottom of the page, the scroll does not go far enough.
- As a result, the 4th scene's center card remains slightly above/below the true center instead of being perfectly centered.
- The page should allow enough scroll distance/padding so that the final scene can reach the same centered position on mobile.

### Important Constraints

- **Do not modify the desktop layout or behavior. It is already correct.**
- Make the fix specifically responsive to mobile/tablet breakpoints where necessary.
- Do not change the visual design of the carousel.
- Do not change the existing carousel style, card sizes, animations, or desktop positioning unless absolutely necessary for the mobile fix.
- The goal is to make the mobile experience behave like the desktop version in terms of **viewport scale, carousel centering, scene alignment, and final scroll position**.
- Please inspect the underlying viewport, carousel centering, scene positioning, scroll-height, and end-of-page calculations rather than applying arbitrary visual offsets.
- The fix should work across common mobile screen sizes rather than only one specific device