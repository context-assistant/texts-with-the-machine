import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  // GitHub Pages configuration
  base: '/texts-with-the-machine', // Repository name for GH pages base path
  // Don't set 'site' - let GitHub Pages handle the domain
});

