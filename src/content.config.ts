import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* eslint-disable sort-vars -- Values in grouped declarations have dependency order. */
const mascotMessageSchema = z.object({
	index: z.number(),
	text: z.string(),
}),

 blogSchema = z.object({
	description: z.string(),
	heroImage: z.string().optional(),
	isDigest: z.boolean().optional(),
	mascotMessages: z.array(mascotMessageSchema).optional(),
	pubDate: z.coerce.date(),
	title: z.string(),
	updatedDate: z.coerce.date().optional(),
}),

 blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: blogSchema,
});

/* eslint-disable-next-line one-var -- The collection export follows its schema setup. */
export const collections = {
	blog,
};
