import { defineConfig } from 'vite';

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
});
