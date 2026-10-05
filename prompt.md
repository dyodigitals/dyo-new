# Contact Page — Background Shader Fixes

Thoroughly inspect the **attached Contact page** and understand exactly how the background shader has been implemented.

I implemented the shader using **Shaders.com**, and I am also attaching the relevant documentation.

Please read and understand this documentation before making any changes:

https://shaders.com/docs/components/cursorripples

## Issue 1 — Shader Loading Delay

When I navigate to the Contact page, there is a **slight delay before the background shader appears**.

I would like you to investigate whether there is a straightforward and obvious way to eliminate or significantly reduce this delay.

Please:

- Understand how the shader is currently initialized/rendered.
- Identify what is causing the delay, if it is reasonably obvious.
- If there is a simple, reliable fix, implement it.
- Ideally, the shader should appear immediately when the Contact page loads rather than briefly showing a blank/static background first.
- **Do not introduce unnecessary complexity or hacks just to eliminate a very small delay.**
- If the delay is inherent to the shader library, WebGL initialization, asset loading, or something else that cannot be straightforwardly improved, **leave it alone rather than forcing a questionable solution.**

In other words:

> Only fix this if there is a clear and sensible way to do so.

---

## Issue 2 — Shader Does Not Resize With the Viewport

There is another, more noticeable issue with the shader's dimensions.

For example:

1. I open the Contact page on a laptop.
2. The shader correctly fills the entire viewport.
3. I then open DevTools / Inspect, resize the browser, or zoom in/out.
4. The viewport dimensions change.
5. However, the shader **does not resize with the new viewport dimensions**.
6. Instead, it appears to retain the dimensions from the moment it was initially rendered.

As a result, the shader may no longer cover the entire width and height of the viewport after the screen dimensions change.

### Desired behavior

The shader should always cover the **current viewport**, not the viewport dimensions that existed when the shader was first initialized.

If the browser viewport changes because of:

- DevTools being opened
- Browser resizing
- Responsive viewport changes
- Zooming in/out
- Orientation changes
- Other normal viewport dimension changes

…the shader should adapt accordingly and continue filling the entire available viewport.

### What I Want You to Investigate

Please thoroughly inspect the current implementation and determine whether this is caused by something obvious such as:

- The shader canvas being initialized with fixed `window.innerWidth` / `window.innerHeight` values.
- Dimensions only being calculated once during initialization.
- Missing resize handling.
- Missing `ResizeObserver`.
- The Shaders.com component needing a specific resize/update method.
- CSS sizing vs. canvas/render-buffer sizing being out of sync.
- Device-pixel-ratio or canvas resolution calculations not being updated.
- Some other straightforward implementation issue.

If you can **clearly identify the cause and there is an obvious, robust fix**, implement it.

The desired result is:

> **The shader should always fill the current viewport, regardless of when or how the viewport dimensions change.**

---

## Important Constraints

- Thoroughly understand the **existing implementation before modifying it**.
- Read the provided Shaders.com Cursor Ripples documentation and make sure any fix is compatible with how the library is intended to work.
- Preserve the existing shader appearance, behavior, animation, cursor interaction, and visual quality.
- Do not unnecessarily rewrite or restructure the shader implementation.
- Do not introduce arbitrary hardcoded dimensions or offsets.
- Do not add a complicated resize system if the library already provides a simple/appropriate mechanism.
- Make the **smallest clean change** that properly fixes the issue.
- Desktop behavior that is currently correct should remain correct.
- The shader should remain fully responsive across different viewport sizes.

### Priority

**Issue 2 (viewport resizing) is the more important issue.**

For Issue 1 (initial loading delay), only make a change if the solution is genuinely straightforward and obvious. If not, leave the loading behavior as-is.

Before making changes, first understand **why each issue is happening**, then implement only the fixes that are technically justified.