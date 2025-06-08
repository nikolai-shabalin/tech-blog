import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const initiative = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
	}),
});

export const collections = {
	'blog': blog,
	'initiative': initiative,
};
