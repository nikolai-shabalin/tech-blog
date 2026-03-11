import * as siteConsts from '../consts';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

export const GET = (context) =>
	getCollection('blog').then((posts) => {
		const items = posts.map((post) => {
			const rssItem = Object.assign(Object.create(null), post.data);
			rssItem.link = `/blog/${post.id}/`;
			return rssItem;
		});

		return rss({
			description: siteConsts.SITE_DESCRIPTION,
			items,
			site: context.site,
			title: siteConsts.SITE_TITLE,
		});
	});
