import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const mascotMessageSchema = z.object({
	index: z.number(),
	text: z.string(),
});

const blogSchema = z.object({
	description: z.string(),
	heroImage: z.string().optional(),
	isDigest: z.boolean().optional(),
	mascotMessages: z.array(mascotMessageSchema).optional(),
	pubDate: z.coerce.date(),
	title: z.string(),
	updatedDate: z.coerce.date().optional(),
});

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: blogSchema,
});

export const collections = {
	blog,
};
