/**
 * Astro для Markdown в content collections подставляет один <img> + webp.
 * Расширяем updateImageReferencesInBody: при наличии `formats` в JSON картинки
 * выводим <picture> с <source> на каждый формат и <img> как фолбэк.
 *
 * При обновлении Astro проверьте совпадение фрагмента в astro/dist/content/runtime.js.
 */
export function vitePatchContentMarkdownPicture() {
	const marker = 'const CONTENT_LAYER_IMAGE_REGEX = /__ASTRO_IMAGE_="([^"]+)"/g;\nasync function updateImageReferencesInBody(html, fileName) {';

	const replacement = `const IMG_TAG_WITH_ASTRO_IMAGE_RE = /<img\\b[^>]*__ASTRO_IMAGE_="([^"]+)"[^>]*>/g;
async function updateImageReferencesInBody(html, fileName) {
  const fallbackFormatFromSrc = (src) => {
    const clean = src.split("?")[0].toLowerCase();
    if (clean.endsWith(".gif")) return "gif";
    if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "jpeg";
    if (clean.endsWith(".webp")) return "webp";
    return "png";
  };
  const mimeForFormat = (format) => {
    switch (format) {
      case "avif":
        return "image/avif";
      case "webp":
        return "image/webp";
      case "png":
        return "image/png";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "gif":
        return "image/gif";
      default:
        return \`image/\${format}\`;
    }
  };
  const sourceSrcsetAttribute = (image) => {
    if (!image.srcSet.values?.length) return escape(image.src);
    return escape(\`\${image.src}, \${image.srcSet.attribute}\`);
  };
  const imgAttributesString = (image) => {
    const { index, ...attributes } = image.attributes;
    return Object.entries({
      ...attributes,
      src: image.src,
      srcset: image.srcSet.attribute,
      ...import.meta.env.DEV ? { "data-image-component": "true" } : {}
    }).map(([key, value]) => value ? \`\${key}="\${escape(value)}"\` : "").filter(Boolean).join(" ");
  };
  const { default: imageAssetMap } = await import("astro:asset-imports");
  const slotResults = /* @__PURE__ */ new Map();
  const { getImage } = await import("astro:assets");
  const resolveGetImage = async (opts) => {
    if (URL.canParse(opts.src)) {
      return getImage(opts);
    }
    const id = imageSrcToImportId(opts.src, fileName);
    const imported = imageAssetMap.get(id);
    if (!id || !imported) return null;
    return getImage({ ...opts, src: imported });
  };
  for (const match of html.matchAll(IMG_TAG_WITH_ASTRO_IMAGE_RE)) {
    const fullTag = match[0];
    const imagePath = match[1];
    try {
      const decoded = JSON.parse(imagePath.replaceAll("&#x22;", '"'));
      const formats = decoded.formats;
      if (Array.isArray(formats) && formats.length > 0) {
        const { formats: _formats, fallbackFormat, index, ...rest } = decoded;
        const fbFmt = fallbackFormat ?? fallbackFormatFromSrc(decoded.src);
        const sources = [];
        for (const format of formats) {
          const img = await resolveGetImage({ ...rest, format });
          if (img) sources.push({ format, image: img });
        }
        const fallback = await resolveGetImage({ ...rest, format: fbFmt });
        if (sources.length && fallback) {
          slotResults.set(fullTag, { type: "picture", sources, fallback });
          continue;
        }
      }
      const { formats: _f, fallbackFormat: _fb, index, ...rest } = decoded;
      const image = await resolveGetImage(rest);
      if (!image) continue;
      slotResults.set(fullTag, { type: "img", image });
    } catch {
      throw new Error(\`Failed to parse image reference: \${imagePath}\`);
    }
  }
  return html.replaceAll(IMG_TAG_WITH_ASTRO_IMAGE_RE, (full) => {
    const result = slotResults.get(full);
    if (!result) return full;
    if (result.type === "img") {
      const attrString = imgAttributesString(result.image);
      return full.replace(/\\s__ASTRO_IMAGE_="[^"]+"/, attrString ? \` \${attrString}\` : "");
    }
    const { sources, fallback } = result;
    const parts = ["<picture>"];
    for (const { format, image } of sources) {
      parts.push(
        \`<source srcset="\${sourceSrcsetAttribute(image)}" type="\${mimeForFormat(format)}" />\`
      );
    }
    parts.push(\`<img \${imgAttributesString(fallback)} />\`);
    parts.push("</picture>");
    return parts.join("");
  });
}`;

	/** @type {import('vite').Plugin} */
	const plugin = {
		enforce: 'pre',
		name: 'vite-patch-content-markdown-picture',
		transform(code, id) {
			if (!id.includes('astro/dist/content/runtime.js')) return null;
			if (!code.includes(marker)) {
				console.warn(
					'[vite-patch-content-markdown-picture] Маркер не найден в runtime.js — патч пропущен (версия Astro?).'
				);
				return null;
			}
			if (!code.includes('function updateImageReferencesInData')) return null;
			const endMarker = '\nfunction updateImageReferencesInData';
			const start = code.indexOf(marker);
			const end = code.indexOf(endMarker, start);
			if (start === -1 || end === -1) return null;
			return (
				code.slice(0, start) +
				replacement +
				code.slice(end)
			);
		}
	};
	return plugin;
}
