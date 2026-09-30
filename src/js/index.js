// Import utility function for preloading images
import { preloadImages } from './utils.js';


// Register the GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, SplitText);
// force3D:'auto' (GSAP's default) drops transformed elements off their GPU layer
// once a tween is idle, which visibly softens a perspective/3D-transformed carousel
gsap.config({ force3D: true });
// Initialize GSAP's ScrollSmoother for smooth scrolling and scroll-based effects
ScrollSmoother.create({
  smooth: 1, // How long (in seconds) it takes to "catch up"
  effects: true, // Enable data-speed and data-lag-based scroll effects
  normalizeScroll: true, // Normalizes scroll behavior across browsers
});

// A Map to store SplitText instances keyed by DOM elements (used for animating text characters)
const splitMap = new Map();

/**
 * Returns an array of transform strings to evenly space carousel cells in 3D
 *
 * @param {number} count - Number of carousel cells
 * @param {number} radius - Radius of the circular layout
 * @returns {string[]} Array of transform strings for each cell
 */
const getCarouselCellTransforms = (count, radius) => {
  const angleStep = 360 / count; // Divide 360° by number of cells to get angle step
  return Array.from({ length: count }, (_, i) => {
    const angle = i * angleStep;
    return `rotateY(${angle}deg) translateZ(${radius}px)`; // 3D rotation + translation
  });
};

/**
 * Applies 3D transforms to each cell in a given carousel
 *
 * @param {Element} carousel - DOM element representing the carousel
 * @returns {void}
 */
const RADIUS_TO_WIDTH_RATIO = 500 / 410;

const setupCarouselCells = (carousel) => {
  const cells = carousel.querySelectorAll('.carousel__cell');
  if (!cells.length) return;

  const cellWidth = cells[0].offsetWidth; // actual rendered width right now
  const radius = cellWidth * RADIUS_TO_WIDTH_RATIO;

  const transforms = getCarouselCellTransforms(cells.length, radius);
  cells.forEach((cell, i) => {
    cell.style.transform = transforms[i];
  });
};

/**
 * Creates a scroll-linked GSAP timeline for a given carousel scene
 *
 * @param {Element} carousel - DOM element of the carousel
 * @returns {GSAPTimeline} Scroll-driven animation timeline
 */
const createScrollAnimation = (carousel) => {
  const wrapper = carousel.closest('.scene');
  const cards = carousel.querySelectorAll('.card');
  const titleSpan = wrapper.querySelector('.scene__title span');
  const split = splitMap.get(titleSpan);
  const chars = split?.chars || [];

  // Create scroll-driven timeline
  const timeline = gsap.timeline({
    defaults: { ease: 'sine.inOut' },
    scrollTrigger: {
      trigger: wrapper,
      start: 'top bottom', // Start when top of wrapper hits bottom of viewport
      end: 'bottom top', // End when bottom of wrapper hits top of viewport
      scrub: true, // Smooth animation based on scroll position
    },
  });

  timeline
    .fromTo(carousel, { rotationY: 0 }, { rotationY: -180 }, 0) // Rotate carousel horizontally
    .fromTo(
      carousel,
      { rotationZ: 3, rotationX: 3 },
      { rotationZ: -3, rotationX: -3 },
      0
    ) // Subtle 3D tilt
    
    .fromTo(cards, { rotationZ: 10 }, { rotationZ: -10, ease: 'none' }, 0); // Rotate cards around Z

  // Animate title characters in on scroll
  if (chars.length > 0) {
    gsap.fromTo(
      chars,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.02,
        ease: 'none',
        stagger: { each: 0.04, from: 'start' },
        scrollTrigger: {
          trigger: wrapper,
          start: 'top center',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  return timeline;
};

/**
 * Initializes SplitText instances on scene titles
 *
 * @returns {void}
 */
const initTextsSplit = () => {
  document.querySelectorAll('.scene__title span').forEach((span) => {
    const split = SplitText.create(span, {
      type: 'chars', // Split by characters
      charsClass: 'char', // Assign class to each character
      autoSplit: true, // Revert and re-split whenever the fonts finish loading
    });
    splitMap.set(span, split); // Store split instance for reuse
  });
};

/**
 * Initializes all carousels on the page
 *
 * @returns {void}
 */
const initCarousels = () => {
  document.querySelectorAll('.carousel').forEach((carousel) => {
    setupCarouselCells(carousel); // Position carousel cells in 3D
    carousel._timeline = createScrollAnimation(carousel); // Attach scroll animation timeline
  });
};

/**
 * Initializes text splitting and carousels
 *
 * @returns {void}
 */
const init = () => {
  initTextsSplit();
  initCarousels();

  // Mobile browsers can report a viewport width before the address bar
  // settles; re-measure shortly after load to correct for that.
  setTimeout(() => {
    document.querySelectorAll('.carousel').forEach(setupCarouselCells);
    ScrollTrigger.refresh();
  }, 300);

  window.addEventListener('resize', () => {
    document.querySelectorAll('.carousel').forEach(setupCarouselCells);
    ScrollTrigger.refresh();
  });
};;

// Start app once images are preloaded
preloadImages('.card__face').then(() => {
  document.body.classList.remove('loading'); // Remove loading state from body
  init(); // Begin initialization
});
