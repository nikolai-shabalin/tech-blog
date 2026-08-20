/* eslint-disable sort-vars -- Values in grouped declarations have dependency order. */
const EMPTY_LENGTH = 0,
 SVG_EXTENSION = '.svg',
 URL_QUERY_SEPARATOR = '?',

 isSvg = (src) => {
	const [pathname] = src.toLowerCase().split(URL_QUERY_SEPARATOR);
	return pathname.endsWith(SVG_EXTENSION);
},

 getImagePaths = (astroData) => {
	if (!astroData) {
		return {
			localImagePaths: new Set(),
			remoteImagePaths: new Set(),
		};
	}

	const { localImagePaths, remoteImagePaths } = astroData;
	return { localImagePaths, remoteImagePaths };
},

 shouldUsePictureFormats = (src, localImagePaths, remoteImagePaths) => {
	const hasImages = localImagePaths.size !== EMPTY_LENGTH || remoteImagePaths.size !== EMPTY_LENGTH;
	return hasImages && !isSvg(src) && (localImagePaths.has(src) || remoteImagePaths.has(src));
},

/**
 * Помечает оптимизируемые <img> в Markdown/MD (content collections),
 * чтобы патч runtime подставлял <picture> с AVIF/WebP.
 */
 satteriMarkdownPicture = (options = {}) => {
	const { formats = ['avif', 'webp'] } = options;

	return {
		element: {
			filter: ['img'],
			visit(node, context) {
				const properties = node.properties || {};
				if (typeof properties.src !== 'string') {
					return;
				}

				/* eslint-disable-next-line one-var -- The type guard must run before decoding the source. */
				const src = decodeURI(properties.src),
				 { localImagePaths, remoteImagePaths } = getImagePaths(context.data.astro);

				if (shouldUsePictureFormats(src, localImagePaths, remoteImagePaths)) {
					context.setProperty(node, 'formats', formats);
				}
			},
		},
		name: 'markdown-picture-formats',
	};
};

export { satteriMarkdownPicture };
