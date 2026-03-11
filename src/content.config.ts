import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		isDigest: z.boolean().optional(),
		mascotMessages: z.array(z.object({
			text: z.string(),
			index: z.number()
		})).optional(),
	}),
});

export const collections = {
	'blog': blog,
};
