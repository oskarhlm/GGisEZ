import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	css: {
		postcss: {},
		preprocessorOptions: {
			scss: {
				additionalData: `
				  @import '$lib/scss/mixins';
					@import '$lib/scss/variables';
				`
			}
		}
	}
});
