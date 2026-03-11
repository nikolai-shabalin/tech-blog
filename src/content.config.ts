import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		description: z.string(),
		heroImage: z.string().optional(),
		isDigest: z.boolean().optional(),
		mascotMessages: z.array(z.object({
			index: z.number(),
			text: z.string(),
		})).optional(),
		pubDate: z.coerce.date(),
		title: z.string(),
		updatedDate: z.coerce.date().optional(),
	}),
});

export const collections = {
	'blog': blog,
};
