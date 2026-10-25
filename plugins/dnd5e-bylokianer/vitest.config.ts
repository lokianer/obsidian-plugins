import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // The UI tests (test/ui, in happy-dom) import the renderers, which import `obsidian`; its npm
  // package has types only, so a small stand-in takes its place.
  resolve: {
    alias: { obsidian: fileURLToPath(new URL('./test/ui/obsidian.ts', import.meta.url)) },
  },
  test: {
    include: ['test/**/*.test.ts'],
  },
});
