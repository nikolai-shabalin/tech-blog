import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
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
        'courses': defineCollection({
                type: 'content',
                schema: z.object({
                        title: z.string(),
                        description: z.string(),
                        duration: z.string().optional(),
                }),
        }),
};
