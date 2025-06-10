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

const courses = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		level: z.enum(['beginner', 'intermediate', 'advanced']),
		duration: z.string(),
		price: z.number().optional(),
		isPremium: z.boolean().default(false),
		tags: z.array(z.string()).default([]),
		lessons: z.array(z.object({
			title: z.string(),
			slug: z.string(),
			description: z.string(),
			isPremium: z.boolean().default(false),
			duration: z.string().optional(),
		})),
	}),
});

const lessons = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		course: z.string(),
		lesson: z.string(),
		description: z.string(),
		duration: z.string().optional(),
		isPremium: z.boolean().default(false),
		order: z.number(),
	}),
});

export const collections = {
	'blog': blog,
	'initiative': initiative,
	'courses': courses,
	'lessons': lessons,
};
