import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

// Hashed filename is only known at build time, so inject the prefetch tag then.
const prefetchContactBundle = () => ({
  name: 'prefetch-contact-bundle',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      if (!ctx.bundle || !ctx.filename.endsWith('index.html')) return;
      const chunk = Object.values(ctx.bundle).find(
        (c) => c.type === 'chunk' && c.isEntry && c.name === 'contact',
      );
      if (!chunk) return;
      return [
        {
          tag: 'link',
          attrs: { rel: 'prefetch', as: 'script', crossorigin: '', href: `/${chunk.fileName}` },
          injectTo: 'head',
        },
      ];
    },
  },
});

// Mirrors Vercel's cleanUrls (see vercel.json) for the dev and preview servers.
const cleanUrls = () => {
  const rewrite = (req, _res, next) => {
    if (req.url === '/contact' || req.url.startsWith('/contact?')) {
      req.url = req.url.replace('/contact', '/contact.html');
    }
    next();
  };
  return {
    name: 'clean-urls',
    configureServer: (server) => server.middlewares.use(rewrite),
    configurePreviewServer: (server) => server.middlewares.use(rewrite),
  };
};

export default defineConfig({
  plugins: [glsl(), prefetchContactBundle(), cleanUrls()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        contact: 'contact.html',
      },
    },
  },
}); 