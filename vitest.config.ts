import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: '/src' },
      { find: '@pages', replacement: '/src/pages' },
      { find: '@components', replacement: '/src/components' },
      { find: '@global', replacement: '/src/global' },
      { find: '@utils', replacement: '/src/utils' },
    ],
  },
  test: {
    environment: 'jsdom',
  },
});
