---
title: "Еженедельный дайджест #6: Новости фронтенда"
description: "Самые интересные новости из мира фронтенд-разработки за последнюю неделю"
pubDate: "July 07 2025"
isDigest: true
mascotMessages: [
  { text: "PNG снова в моде — теперь с HDR! 🖼️", index: 0 },
  { text: "CSS умеет gap-декорации, вау! 💥", index: 1 },
  { text: "ES2025 принят — JavaScript растёт! 🚀", index: 2 },
  { text: "React всё ещё запутан? Не переживай! 🧩", index: 3 },
  { text: "Node.js теперь с Web API и import maps! ⚙️", index: 4 },
  { text: "Deno снова bundler — всё в одном файле! 📦", index: 5 },
  { text: "Пробовал blob-фигуры в CSS? 🎨", index: 6 },
  { text: "Вышел Polypane 25 — браузер для профи! 🕵️", index: 7 },
  { text: "Cloudflare запускает контейнеры! ☁️", index: 8 },
  { text: "Transformers.js теперь с Gemma 3n! 🤖", index: 9 }
]
---

import TelegramCTA from '../../../components/TelegramCTA.astro';

## Главные новости

<TelegramCTA/>

## HTML и API

### Коротко
- [📈 PNG снова с нами](https://www.programmax.net/articles/png-is-back/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — спустя 20 лет формат PNG получил обновление: поддержка HDR, анимаций и EXIF.
- [🧠 Как не "перемудрить" с Web Components](https://www.sanfordtech.xyz/posts/youre-overthinking-web-components/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — советы по постепенному внедрению Web Components без лишней сложности.
- [📱 Кастомный select, всплывающий снизу](https://frontendmasters.com/blog/custom-select-that-comes-up-from-the-bottom-on-mobile/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — удобно ли размещать выпадающий список снизу экрана на мобильных?
- [🌍 Пространственный web в Apple Vision Pro](https://webkit.org/blog/17118/a-step-into-the-spatial-web-the-html-model-element-in-apple-vision-pro/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — 3D-модели прямо в браузере под гарнитуру Apple.
- [📄 Оптимизация и доступность SVG](https://dbushell.com/2025/06/25/svg-optimization-and-accessibility-basics/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)

## CSS
### [💥 Gap теперь можно стилизовать](https://css-tricks.com/the-gap-strikes-back-now-stylable/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Появляется новая возможность стилизовать отступы между элементами с помощью так называемых "gap decorations". Это открывает массу интересных визуальных решений, например, полоски между карточками или рамки между строками без лишнего HTML.

Также можно [почитать статью](https://shabalin.online/blog/css/gap-decoration/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) на русском основанную на спецификации.

### [🎨 Функции работы с цветом в CSS](https://css-tricks.com/css-color-functions/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Хороший обзор всех новых цветовых функций и цветовых пространств: `rgb()`, `hsl()`, `oklch()` и других. Также объясняется разница между `sRGB`, `OKLab`, и когда использовать какие варианты.

### [🔮 Свойство `corner-shape` и супэрэллипсы](https://frontendmasters.com/blog/understanding-css-corner-shape-and-the-power-of-the-superellipse/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Новое экспериментальное свойство `corner-shape` расширяет возможности `border-radius`. Оно позволяет создавать плавные и необычные формы углов без SVG. Пока доступно только в Chrome Canary.

### [🧬 CSS Cascade Layers + Tailwind](https://css-tricks.com/using-css-cascade-layers-with-tailwind-utilities/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Руководство по использованию каскадных слоёв в CSS совместно с утилитами Tailwind. Это поможет избежать конфликтов между классами и кастомными стилями.

### [💡 Рецепты для блобов в CSS](https://css-tricks.com/css-blob-recipes/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Автор делится, как можно создавать "blob"-формы не только с помощью генераторов, но и используя CSS: `border-radius`, `shape()` и SVG.


## 🌐 JavaScript
### ✅ [ECMAScript 2025 утверждён Ecma International](https://2ality.com/2025/06/ecmascript-2025.html?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Обновлён стандарт языка JavaScript. В статье от Dr. Axel вы найдёте краткий обзор нововведений: улучшения синтаксиса, новые возможности и небольшие улучшения языка. Полезно для общего понимания, куда движется JavaScript. [Читать спецификацию полностью](https://tc39.es/ecma262/2025/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)

### 📦 [Что нового в JavaScript по версии TC39](https://deno.com/blog/updates-from-tc39?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Команда Deno делится новыми предложениями, которые обсуждаются в рабочей группе языка. Простые примеры кода и краткое объяснение — отлично подойдёт новичкам.

### [Что нового в ECMAScript 2025 (ещё один взгляд)](https://pawelgrzybek.com/whats-new-in-ecmascript-2025/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Павел Гжибек делится своим взглядом на нововведения в ES2025. В отличие от официального описания, он приводит примеры, которые делают понимание проще и интереснее для новичков.

### [Головоломка на парсинг JavaScript](https://www.hillelwayne.com/post/javascript-puzzle/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Интересная задачка, в которой всего 14 символов кода — но чтобы её решить, придётся подумать. Отличная возможность освежить знания о том, как работает JavaScript-интерпретатор.

- [Создание реактивного состояния с помощью Proxy в JavaScript](https://www.lorenstew.art/blog/reactive-state-manager-with-proxies?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — пример, как можно сделать своё маленькое "MobX" без зависимостей.

## React
### React всё ещё кажется... запутанным, и об этом почти никто не говорит?

В статье [React Still Feels.. Foolish, and No One is Talking About It?](https://mbrizic.com/blog/react-is-insane/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) автор размышляет о том, почему React-проекты иногда становятся сложными и запутанными. Он говорит, что благодаря гибкости React разработчики могут создавать мощные одностраничные приложения, но если не следить за архитектурой, проект быстро превращается в "клубок". При этом проблема не только в React, а в современном фронтенде в целом. Обсуждения этой статьи набрали много откликов на [Reddit](https://www.reddit.com/r/programming/comments/1lokxnv/react_still_feels_insane_and_no_one_is_talking/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) и [Hacker News](https://news.ycombinator.com/item?id=44428489&utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online).

### Коротко
- 🧊 [Reactylon](https://www.reactylon.com/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — 3D/VR фреймворк для React на базе Babylon.js. Теперь есть [демо-страница с примерами](https://www.reactylon.com/showcase?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online).
- 🤖 Anthropic добавили возможность создавать и делиться AI-приложениями с React-интерфейсом прямо из Claude — [подробнее](https://www.anthropic.com/news/claude-powered-artifacts?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online).
- 📄 [Стоит ли учить новый веб-фреймворк?](https://brainbaking.com/post/2025/06/no-time-to-learn-web-framework-x/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — как решить, стоит ли тратить время на изучение новой технологии. Автор: Wouter Groeneveld.
- 📄 [Используем useOptimistic, чтобы приложение казалось мгновенным](https://www.epicreact.dev/use-optimistic-to-make-your-app-feel-instant-zvyuv?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — приём от Кента С. Доддса для улучшения UX.
- 📄 [Пособие по загрузке данных в React](https://reactpractice.dev/articles/study-guide-data-fetching-in-react/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — хорошее руководство от React Practice.
- 📄 [Автоматизация доступности в Storybook 9](https://storybook.js.org/blog/the-accessibility-pipeline-for-frontend-teams/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — как упростить проверку accessibility. Автор: Dominic Nguyen.
- [Что React-разработчику стоит знать о Signals](https://www.youtube.com/watch?v=VgGl9i-OBBI&utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — видеоматериал от Райана Карниато, автора SolidJS.

## ⚙️ Node.js
### 🚀 [Современные практики разработки на Node.js в 2025 году](https://kashw1n.com/blog/nodejs-2025/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Хороший обзор от Ashwin о том, какие возможности Node стали стандартом: ES-модули, встроенные Web API, import maps, тест-раннер, режим наблюдения за файлами и система прав доступа. Отличный материал, чтобы освежить знания или узнать, что уже стало "новой нормой".

### 🧪 [Node.js v22.17.0 (LTS) — важное обновление](https://nodejs.org/en/blog/release/v22.17.0?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Стабилизирована функция `assert.partialDeepStrictEqual()` и перенесены некоторые возможности из Node.js 24. Это надёжная версия для использования в продакшене.

### 🔐 [Как защитить Express API с помощью Cedar за 5 минут](https://aws.amazon.com/blogs/opensource/secure-your-application-apis-in-5-minutes-with-cedar/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Если вы работаете с Express, эта статья объясняет, как использовать язык политик безопасности Cedar от AWS для разграничения доступа в API. Это просто, быстро и подходит даже для небольших проектов.

### 💬 [Почему моя многопользовательская игра на Node тормозит при 500 игроках?](https://news.ycombinator.com/item?id=44389408&utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Публичное обсуждение причин лагов в игре при высокой нагрузке. Полезно, если вы планируете real-time системы и масштабирование.

### [Deno 2.4: возвращается `deno bundle`](https://deno.com/blog/v2.4?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
В версии Deno 2.4 снова доступна команда `deno bundle`, которая позволяет собрать весь проект в один файл — как для сервера, так и для клиента. Теперь есть поддержка зависимостей из npm и JSR, автоматическое "очищение дерева" (tree-shaking), а также стабильная интеграция с OpenTelemetry. Также теперь можно [включать произвольные файлы через `import`](https://deno.com/blog/v2.4?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online#importing-text-and-bytes).

### Коротко
- 🛰️ [Использование NestJS в качестве сигнального сервера для WebRTC](https://www.telerik.com/blogs/how-to-use-nestjs-signaling-server-webrtc-video-chat?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- [Node.js v24.3.0](https://nodejs.org/en/blog/release/v24.3.0?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) тоже вышел, но без значимых изменений.
- [Вышел Bun v1.2.18](https://bun.sh/blog/bun-v1.2.18?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)

## Коротко
- 📤 [Как писать интересные анонсы к релизам](https://refactoringenglish.com/chapters/release-announcements/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- ⚙️ [Автоматизация с GitHub Actions и Claude](https://www.youtube.com/watch?v=VC6dmPcin2E&utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- 🕹️ [Расширение WhatsApp API](https://github.com/Secreto31126/whatsapp-api-js?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- 🧳 [Cloudflare Containers](https://blog.cloudflare.com/containers-are-available-in-public-beta-for-simple-global-and-programmable/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — контейнеры как альтернатива Workers.
- ⏳ [API Temporal вышел на Stage 3](https://tc39.es/proposal-temporal/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- [🔎 Обновления веб-платформы за последний месяц (Rachel Andrew)](https://web.dev/blog/web-platform-06-2025?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- [📊 Обновлённый интерфейс в Google Search Console](https://developers.google.com/search/blog/2025/06/search-console-insights?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- [🚀 Новая версия браузера Polypane (v25)](https://polypane.app/blog/polypane-25-browser-extensions-with-manifest-v-3-form-outlines-and-chromium-138/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- [🤞 Приоритеты разработчиков от команды Edge](https://blogs.windows.com/msedgedev/2025/06/26/the-edge-2025-web-platform-top-developer-needs-dashboard/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- [🪐 Что нового в Astro](https://astro.build/blog/whats-new-june-2025/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- [🎨 Как создать нескучную дизайн-систему](https://bradfrost.com/blog/link/how-to-make-a-design-system-thats-not-boring/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- [🔊 Аудиоэффекты для сайтов](https://www.telerik.com/blogs/adding-audio-effects-dynamic-websites?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)


## 🧪 Инструменты и библиотеки
- [Rspack 1.4](https://rspack.rs/blog/announcing-1-4?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — Web-бандлер на Rust, теперь работает в браузере благодаря WebAssembly.
- [ESLint 9.30.0 и 9.30.1](https://eslint.org/blog/2025/06/eslint-v9.30.0-released/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- [Electron 37.0](https://www.electronjs.org/blog/electron-37-0?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- [Astro 5.11](https://astro.build/blog/astro-5110/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- [Babel 7.28.0](https://babeljs.io/blog/2025/06/30/7.28.0?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
- [Three.js r178](https://github.com/mrdoob/three.js/releases/tag/r178?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)

### 🤖 [Transformers.js 3.6: Поддержка Gemma 3n от Google](https://github.com/huggingface/transformers.js/releases/tag/3.6.0?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online)
Библиотека для запуска моделей машинного обучения из мира Python прямо в Node.js. Теперь можно использовать и новую модель от Google — Gemma 3n. Подходит для обработки текста, изображений и звука.

### Коротко
- 📦 [dotenv v17.0](https://github.com/motdotla/dotenv?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — теперь ещё проще подключать переменные окружения.
- 🧩 [Electron v37.0.0](https://www.electronjs.org/blog/electron-37-0?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — обновление платформы для создания десктопных приложений.
- 🔍 [npm-package-json-lint 9.0](https://github.com/tclindner/npm-package-json-lint?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — линтер для `package.json`.
- 🌐 [OpenAI v5.8.0](https://github.com/openai/openai-node?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — поддержка вебхуков и функций "глубокого поиска".
- 📚 [Marked 16.0](https://marked.js.org/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — быстрый Markdown-парсер.
- 📱 [whatsapp-api-js](https://github.com/Secreto31126/whatsapp-api-js?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — библиотека для работы с WhatsApp API от Meta.
- 🧠 [Repomix 1.0](https://repomix.com/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — утилита для подготовки репозиториев к работе с AI.
- ⛏ [Mineflayer 4.30](https://github.com/PrismarineJS/mineflayer?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — создание Minecraft-ботов на JavaScript.
- 🌍 [Undici 7.11](https://github.com/nodejs/undici/releases/tag/v7.11.0?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — HTTP-клиент от команды Node.js.
- [🧪 HTML Form Inspector](https://polypane.app/form-inspector/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — онлайн-инструмент для проверки структуры HTML-форм.
- [🔄 SVG to CSS Shape Converter](https://css-generators.com/svg-to-css/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — конвертер SVG path в CSS-фигуры.
- [🎞️ FliiipBook](https://www.fliiipbook.com/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — веб-приложение для создания gif-анимаций в стиле "флипбука".
- [🧪 Params Editor (расширение Chrome)](https://params-editor.isolpro.in/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — редактирование URL-параметров прямо в браузере.
- [🌱 PicoSSG](https://picossg.dev/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — статический генератор сайтов без конфигурации.
- [📑 CSV to HTML Table](https://github.com/derekeder/csv-to-html-table?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — отображение CSV в виде фильтруемой HTML-таблицы.
- [Milkdown](https://milkdown.dev/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — WYSIWYG Markdown-редактор с поддержкой плагинов.
- [Repomix 1.0](https://repomix.com/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — инструмент для подготовки кода в LLM-дружественный формат.
- [snapDOM 1.8](https://zumerlab.github.io/snapdom/?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — создаёт SVG-изображения из HTML-элементов, сохраняя стили.
- [Spectral.js](https://github.com/rvanwijnen/spectral.js?utm_source=frontend&utm_medium=digest&utm_campaign=shabalin_online) — библиотека для плавного перехода между цветами, как в настоящей краске.
