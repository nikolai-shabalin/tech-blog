const EMPTY_LENGTH = 0;
const SVG_EXTENSION = '.svg';
const URL_QUERY_SEPARATOR = '?';

const isSvg = (src) => {
	const [pathname] = src.toLowerCase().split(URL_QUERY_SEPARATOR);
	return pathname.endsWith(SVG_EXTENSION);
};

const getImagePaths = (astroData) => {
	if (!astroData) {
		return {
			localImagePaths: new Set(),
			remoteImagePaths: new Set(),
		};
	}

	const { localImagePaths, remoteImagePaths } = astroData;
	return { localImagePaths, remoteImagePaths };
};

const shouldUsePictureFormats = (src, localImagePaths, remoteImagePaths) => {
	const hasImages = localImagePaths.size !== EMPTY_LENGTH || remoteImagePaths.size !== EMPTY_LENGTH;
	return hasImages && !isSvg(src) && (localImagePaths.has(src) || remoteImagePaths.has(src));
};

/**
 * Помечает оптимизируемые <img> в Markdown/MD (content collections),
 * чтобы патч runtime подставлял <picture> с AVIF/WebP.
 */
const satteriMarkdownPicture = (options = {}) => {
	const { formats = ['avif', 'webp'] } = options;

	return {
		element: {
			filter: ['img'],
			visit(node, context) {
				const properties = node.properties || {};
				if (typeof properties.src !== 'string') {
					return;
				}

				const src = decodeURI(properties.src);
				const { localImagePaths, remoteImagePaths } = getImagePaths(context.data.astro);

				if (shouldUsePictureFormats(src, localImagePaths, remoteImagePaths)) {
					context.setProperty(node, 'formats', formats);
				}
			},
		},
		name: 'markdown-picture-formats',
	};
};

export { satteriMarkdownPicture };
