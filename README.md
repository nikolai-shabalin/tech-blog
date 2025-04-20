# Tech Blog

Современный блог, построенный на Astro с использованием минималистичного дизайна.

## ✨ Особенности

- 🎨 Минималистичный дизайн
- ⚡ 100/100 Lighthouse производительность
- 🔍 SEO-оптимизация с каноническими URL и OpenGraph данными
- 🗺️ Поддержка Sitemap
- 📰 Поддержка RSS Feed
- 📝 Поддержка Markdown & MDX

## 📁 Структура проекта

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

### Описание структуры

- `src/pages/` - содержит `.astro` или `.md` файлы, которые автоматически становятся маршрутами на основе их имени файла
- `src/components/` - место для компонентов Astro/React/Vue/Svelte/Preact
- `src/content/` - содержит "коллекции" связанных Markdown и MDX документов. Используйте `getCollection()` для получения постов из `src/content/blog/`
- `public/` - директория для статических ресурсов, таких как изображения

