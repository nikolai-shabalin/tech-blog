// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import rehypeMarkdownPicture from './src/plugins/rehype-markdown-picture.mjs';
import { vitePatchContentMarkdownPicture } from './src/plugins/vite-patch-content-picture.mjs';

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
			name: 'Inter',
			cssVariable: '--font-inter',
			provider: fontProviders.local(),
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/inter-latin-wght-normal.woff2'],
						weight: '100 900',
						style: 'normal',
						display: 'swap',
						unicodeRange: LATIN_UNICODE_RANGE,
					},
					{
						src: ['./src/assets/fonts/inter-cyrillic-wght-normal.woff2'],
						weight: '100 900',
						style: 'normal',
						display: 'swap',
						unicodeRange: CYRILLIC_UNICODE_RANGE,
					},
				]
			}
		},
		{
			name: 'Montserrat',
			cssVariable: '--font-montserrat',
			provider: fontProviders.local(),
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/montserrat-latin-wght-normal.woff2'],
						weight: '100 900',
						style: 'normal',
						display: 'swap',
						unicodeRange: LATIN_UNICODE_RANGE,
					},
					{
						src: ['./src/assets/fonts/montserrat-cyrillic-wght-normal.woff2'],
						weight: '100 900',
						style: 'normal',
						display: 'swap',
						unicodeRange: CYRILLIC_UNICODE_RANGE,
					},
				]
			}
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
		rehypePlugins: [[rehypeMarkdownPicture, { formats: ['avif', 'webp'] }]],
		smartypants: {
			dashes: 'oldschool',
			openingQuotes: { double: '«', single: '‹' },
			closingQuotes: { double: '»', single: '›' },
			ellipses: 'unspaced',
		},
	},
	site: 'https://shabalin.online',
	vite: {
		plugins: [vitePatchContentMarkdownPicture()]
	},
});
