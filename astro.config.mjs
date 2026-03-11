// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	base: '',
	integrations: [
		mdx(),
		sitemap({
			changefreq: 'weekly',
			customPages: [],
			lastmod: new Date(),
			priority: 0.7,
			serialize: (item) => {
				const serializedItem = Object.assign(Object.create(null), item);

				if (item.lastmod) {
					serializedItem.lastmod = new Date(item.lastmod).toISOString();
				} else {
					delete serializedItem.lastmod;
				}

				return serializedItem;
			},
		})
	],
	site: 'https://shabalin.online'
});
