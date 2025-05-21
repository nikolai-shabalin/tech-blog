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

const digest = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		weekNumber: z.number(),
		year: z.number(),
		news: z.array(z.object({
			title: z.string(),
			description: z.string(),
			link: z.string().url().optional(),
		})),
	}),
});

export const collections = { blog, digest };
