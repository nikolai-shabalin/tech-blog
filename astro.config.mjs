// @ts-check
/* eslint-disable sort-imports */
import { defineConfig, fontProviders } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { vitePatchContentMarkdownPicture } from './src/plugins/vite-patch-content-picture.mjs';
import mdx from '@astrojs/mdx';
import { satteriMarkdownPicture } from './src/plugins/satteri-markdown-picture.mjs';
import sitemap from '@astrojs/sitemap';

/** @type {[string, ...string[]]} */
const LATIN_UNICODE_RANGE = [
	'U+0000-00FF',
	'U+0131',
	'U+0152-0153',
	'U+02BB-02BC',
	'U+02C6',
	'U+02DA',
	'U+02DC',
	'U+0304',
	'U+0308',
	'U+0329',
	'U+2000-206F',
	'U+20AC',
	'U+2122',
	'U+2191',
	'U+2193',
	'U+2212',
	'U+2215',
	'U+FEFF',
	'U+FFFD',
];

/** @type {[string, ...string[]]} */
const CYRILLIC_UNICODE_RANGE = [
	'U+0301',
	'U+0400-045F',
	'U+0490-0491',
	'U+04B0-04B1',
	'U+2116',
];

// https://astro.build/config
export default defineConfig({
	base: '',
	fonts: [
		{
			cssVariable: '--font-inter',
			name: 'Inter',
			options: {
				variants: [
					{
						display: 'swap',
						src: ['./src/assets/fonts/inter-latin-wght-normal.woff2'],
						style: 'normal',
						unicodeRange: LATIN_UNICODE_RANGE,
						weight: '100 900',
					},
					{
						display: 'swap',
						src: ['./src/assets/fonts/inter-cyrillic-wght-normal.woff2'],
						style: 'normal',
						unicodeRange: CYRILLIC_UNICODE_RANGE,
						weight: '100 900',
					},
				]
			},
			provider: fontProviders.local()
		},
		{
			cssVariable: '--font-montserrat',
			name: 'Montserrat',
			options: {
				variants: [
					{
						display: 'swap',
						src: ['./src/assets/fonts/montserrat-latin-wght-normal.woff2'],
						style: 'normal',
						unicodeRange: LATIN_UNICODE_RANGE,
						weight: '100 900',
					},
					{
						display: 'swap',
						src: ['./src/assets/fonts/montserrat-cyrillic-wght-normal.woff2'],
						style: 'normal',
						unicodeRange: CYRILLIC_UNICODE_RANGE,
						weight: '100 900',
					},
				]
			},
			provider: fontProviders.local()
		}
	],
	image: {
		service: {
			config: {
				avif: {
					chromaSubsampling: '4:2:0',
					effort: 5,
					quality: 75
				},
				jpeg: {
					chromaSubsampling: '4:2:0',
					mozjpeg: true,
					progressive: true,
					quality: 80
				},
				png: {
					adaptiveFiltering: true,
					compressionLevel: 9
				},
				webp: {
					alphaQuality: 85,
					effort: 5,
					quality: 80
				}
			},
			entrypoint: 'astro/assets/services/sharp'
		}
	},
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
	markdown: {
		processor: satteri({
			hastPlugins: [satteriMarkdownPicture({ formats: ['avif', 'webp'] })],
		}),
	},
	site: 'https://shabalin.online',
	vite: {
		plugins: [vitePatchContentMarkdownPicture()]
	},
});
