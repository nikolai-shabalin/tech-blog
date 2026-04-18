/**
 * Помечает оптимизируемые <img> в Markdown/MD (content collections),
 * чтобы патч runtime подставлял <picture> с AVIF/WebP (см. vite-patch-content-picture.mjs).
 */
export default function rehypeMarkdownPicture(options = {}) {
	const { formats = ['avif', 'webp'] } = options;

	return (tree, file) => {
		const local = file.data.astro?.localImagePaths ?? [];
		const remote = file.data.astro?.remoteImagePaths ?? [];
		if (local.length === 0 && remote.length === 0) {return;}

		const walk = (node) => {
			if (node?.type === 'element' && node.tagName === 'img' && typeof node.properties?.src === 'string') {
				const src = decodeURI(node.properties.src);
				if (local.includes(src) || remote.includes(src)) {
					node.properties.formats = formats;
				}
			}
			const children = node?.children;
			if (Array.isArray(children)) {
				for (const c of children) {walk(c);}
			}
		};
		walk(tree);
	};
}
