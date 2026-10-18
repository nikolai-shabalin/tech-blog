/* eslint-disable one-var, sort-vars -- Keep dimensions, fonts and helpers grouped by purpose. */
/* eslint-disable sort-imports -- Astro route types follow their runtime imports. */
/* eslint-disable oxc/no-async-await -- Image rendering and content loading are asynchronous. */
/* eslint-disable no-magic-numbers -- Font size candidates are explicit design values. */
import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 1200,
 HEIGHT = 630,
 TITLE_WIDTH = 960,
 TITLE_HEIGHT = 320,
 TITLE_TOP = 174,
 HALF = 2,
 FIRST_SEGMENT = 0,
 TITLE_SIZES = [68, 62, 56, 50, 44, 38, 32],
 TITLE_FONT = path.resolve('src/assets/fonts/montserrat-cyrillic-wght-normal.woff2'),
 LABEL_CYRILLIC_FONT = path.resolve('src/assets/fonts/inter-cyrillic-wght-normal.woff2'),
 LABEL_LATIN_FONT = path.resolve('src/assets/fonts/inter-latin-wght-normal.woff2'),
 CATEGORY_NAMES: Record<string, string> = {
  ally: 'ДОСТУПНОСТЬ',
  css: 'CSS',
  devtools: 'DEVTOOLS',
  digest: 'ДАЙДЖЕСТ',
  html: 'HTML',
  javascript: 'JAVASCRIPT',
  longrid: 'ЛОНГРИД',
  other: 'РАЗНОЕ',
 };

interface OgImageProps {
 title: string;
 category: string;
}

interface TextOptions {
 font: string;
 fontfile: string;
 width?: number;
}

export const getStaticPaths: GetStaticPaths = async () => {
 const posts = await getCollection('blog');

 return posts.map((post) => ({
  params: { slug: post.id },
  props: {
   category: CATEGORY_NAMES[post.id.split('/')[FIRST_SEGMENT]] ?? 'СТАТЬЯ',
   title: post.data.title,
  } satisfies OgImageProps,
 }));
};

const escapeMarkup = (value: string): string => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const makeText = async (value: string, { font, fontfile, width }: TextOptions): Promise<{ input: Buffer; width: number; height: number }> => {
 const { data, info } = await sharp({
  text: {
   font,
   fontfile,
   rgba: true,
   text: escapeMarkup(value),
   width,
   wrap: 'word-char',
  },
 }).png().toBuffer({ resolveWithObject: true });

 return { height: info.height, input: data, width: info.width };
};

const makeTitle = async (title: string): Promise<{ input: Buffer; width: number; height: number }> => {
 for (const size of TITLE_SIZES) {
  /* eslint-disable-next-line no-await-in-loop -- Stop after finding the largest size that fits. */
  const image = await makeText(title, { font: `Montserrat ${size}`, fontfile: TITLE_FONT, width: TITLE_WIDTH });

  if (image.height <= TITLE_HEIGHT) {
   return image;
  }
 }

 throw new Error(`Заголовок не помещается на OG-картинке: ${title}`);
};

const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#eaf0ff"/>
  <circle cx="1090" cy="90" r="380" fill="#cbdcff"/>
  <circle cx="1140" cy="600" r="310" fill="#dbe7ff"/>
  <rect x="55" y="52" width="1090" height="526" rx="30" fill="#ffffff"/>
  <path d="M86 52h-1a30 30 0 0 0-30 30v466a30 30 0 0 0 30 30h1z" fill="#2563eb"/>
  <path d="M105 508h990" stroke="#d9e3f2" stroke-width="2"/>
  <rect x="1014" y="88" width="78" height="78" rx="18" fill="#2563eb"/>
  <path d="M1036 108v38m17-38v38m17-38v38m-34 0h34" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
</svg>`);

export const GET: APIRoute = async ({ props }) => {
 const { title, category } = props as OgImageProps,
  categoryFont = (/[А-Яа-яЁё]/u.test(category) && LABEL_CYRILLIC_FONT) || LABEL_LATIN_FONT,
  [titleImage, categoryImage, siteImage] = await Promise.all([
   makeTitle(title),
   makeText(category, { font: 'Inter 20', fontfile: categoryFont }),
   makeText('shabalin.online', { font: 'Inter 18', fontfile: LABEL_LATIN_FONT }),
  ]),
  png = await sharp(background).composite([
   { input: categoryImage.input, left: 106, top: 107 },
   { input: titleImage.input, left: 105, top: TITLE_TOP + Math.floor((TITLE_HEIGHT - titleImage.height) / HALF) },
   { input: siteImage.input, left: 106, top: 529 },
  ]).png().toBuffer();

 return new Response(new Uint8Array(png), {
  headers: {
   'Content-Type': 'image/png',
  },
 });
};
