/**
 * Preloads images specified by the CSS selector.
 * @function
 * @param {string} [selector='img'] - CSS selector for target images.
 * @returns {Promise} - Resolves when all specified images are loaded.
 */
const preloadImages = (selector = 'img') => {
  const elements = document.querySelectorAll(selector);
  return new Promise((resolve) => {
      // The imagesLoaded library is used to ensure all images (including backgrounds) are fully loaded.
      imagesLoaded(elements, {background: true}, resolve);
  }).then(() => {
      // Loaded isn't decoded: without this the big AVIFs decode on first paint, stalling the first scroll
      const urls = new Set();
      elements.forEach((el) => {
        const match = /url\(["']?(.*?)["']?\)/.exec(getComputedStyle(el).backgroundImage);
        if (match) urls.add(match[1]);
      });
      return Promise.all(
        [...urls].map((url) => {
          const img = new Image();
          img.src = url;
          return img.decode().catch(() => {});
        }),
      );
  });
};

// Exporting utility functions for use in other modules.
export {
  preloadImages
};