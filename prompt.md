# Contact Page — Fixes & Improvements

Go through the **Contact page thoroughly** and make the following changes/fixes.

## 1. Fix the DYO Digitals Logo

The **DYO Digitals logo on the Contact page is incorrect/incomplete**.

The word **"Digitals"** is missing from the Contact page logo, whereas it is correctly present on the Home page.

Please:

- Compare the Contact page logo implementation with the Home page.
- Identify why "Digitals" is missing on the Contact page.
- Fix it so the Contact page displays the **same complete DYO Digitals logo/branding as the Home page**.
- Preserve the existing sizing, positioning, and styling of the Contact page unless the missing text requires a small adjustment.

---

## 2. Update "My Craft Is" Fields

In the **"My Craft Is"** section of the Contact form:

### Current
- Live Painting

### Change to
- Wedding Floral

Please remove **Live Painting** from the visible craft options and replace it with **Wedding Floral**.

However, **Live Painting should be moved into the placeholder/example text for the "Other" field**.

So the "Other" field should communicate that Live Painting is an example of something the user can enter there.

Please maintain the existing visual styling and interaction behavior of the other craft fields.

---

## 3. Fix the Active Underline on the "Other" Field

The **active underline behavior for the "Other" field is glitchy**.

It does not behave consistently with the remaining fields in the form.

Please inspect how the active underline/focus state is implemented for the other fields and compare it directly with the "Other" field.

Fix it so that the **"Other" field behaves exactly like the other fields**, including:

- Active/focused state
- Underline animation
- Underline positioning
- Transition timing
- Hover/focus behavior
- Returning to the inactive state when appropriate

Do not create a separate workaround if the issue is caused by the "Other" field being implemented differently. Prefer making it follow the same underlying implementation/pattern as the other fields.

---

## 4. Mobile Contact Form — Check for Fixed/Sticky Positioning & 100svh Restriction

Please thoroughly inspect the **mobile version of the Contact page**, specifically the section containing:

- Contact Us
- Email
- The contact form and its surrounding content

I want to determine whether any of this content is currently using:

- `position: fixed`
- `position: sticky`
- A fixed-height container
- `100svh`
- `100vh`
- `overflow: hidden`
- Or any other implementation that effectively restricts the Contact page to only one viewport height.

### Desired behavior

If the mobile Contact page is currently being restricted to **100svh / one viewport height** or using sticky/fixed positioning in a way that prevents natural scrolling:

**Remove that restriction.**

The user should be able to:

- Scroll naturally through the entire Contact page.
- Continue scrolling **past the initial viewport**.
- Reach all of the form content and anything below it.
- Have the page behave like a normal vertically scrollable mobile page.

Do **not** remove legitimate sticky/fixed positioning if it is not actually causing the problem.

### Important

If you inspect the implementation and determine that:

- There is **no sticky/fixed positioning**, and
- The page is **not actually restricted to 100svh / one viewport height**, and
- Nothing is preventing normal mobile scrolling,

then **ignore this issue and do not make any changes for it**.

---

## Important Overall Requirements

- Thoroughly inspect the existing Contact page implementation before making changes.
- Compare the Contact page with the Home page where relevant, especially for the DYO Digitals logo.
- Preserve the existing design, animations, typography, spacing, and interactions unless a change is specifically required above.
- Do not introduce unnecessary refactoring.
- Fix the underlying implementation rather than applying visual hacks.
- Make sure the Contact page remains responsive across desktop and mobile.
- Do not change the Home page unless it is necessary to understand or correctly replicate the existing logo implementation.