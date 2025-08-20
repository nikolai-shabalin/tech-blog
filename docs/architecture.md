# Архитектура проекта

Этот документ описывает архитектуру проекта tech-blog, включая структуру, компоненты, принципы проектирования и технические решения.

## Обзор архитектуры

Tech Blog построен на основе **Astro** - современного фреймворка для создания статических сайтов. Проект использует компонентный подход с поддержкой React для интерактивных элементов.

### Основные принципы

1. **Статическая генерация** - все страницы генерируются на этапе сборки
2. **Компонентный подход** - переиспользуемые компоненты
3. **Типизация** - полная поддержка TypeScript
4. **Производительность** - минимальный JavaScript в браузере
5. **Доступность** - соответствие стандартам WCAG

## Технологический стек

### Основные технологии

- **Astro** - основной фреймворк
- **TypeScript** - типизация
- **React** - интерактивные компоненты
- **Markdown/MDX** - контент
- **CSS** - стили (без препроцессоров)

### Инструменты

- **ESLint** - линтинг кода
- **Prettier** - форматирование
- **pnpm** - менеджер пакетов

## Структура проекта

```
tech-blog/
├── public/                 # Статические файлы
│   ├── images/            # Изображения
│   ├── icons/             # Иконки для PWA
│   ├── screenshots/       # Скриншоты
│   └── manifest.json      # PWA манифест
├── src/
│   ├── components/        # Компоненты
│   ├── content/           # Контент
│   ├── data/              # Данные
│   ├── layouts/           # Макеты
│   ├── pages/             # Страницы
│   ├── styles/            # Стили
│   └── types/             # TypeScript типы
├── docs/                  # Документация
├── astro.config.mjs       # Конфигурация Astro
├── package.json           # Зависимости
└── tsconfig.json          # Конфигурация TypeScript
```

## Компонентная архитектура

### Типы компонентов

#### 1. Astro компоненты (`.astro`)

Используются для статических элементов:

```astro
---
// src/components/Header.astro
interface Props {
  title?: string;
}

const { title = "Tech Blog" } = Astro.props;
---

<header class="header">
  <h1>{title}</h1>
</header>

<style>
  .header {
    padding: var(--space-md);
    background: var(--accent);
  }
</style>
```

#### 2. React компоненты (`.tsx`)

Используются для интерактивных элементов:

```tsx
// src/components/Quiz.tsx
import React, { useState } from 'react';

interface QuizProps {
  questions: Question[];
}

export default function Quiz({ questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  return (
    <div className="quiz">
      {/* Интерактивная логика */}
    </div>
  );
}
```

### Иерархия компонентов

```
App
├── BaseHead (SEO, мета-теги)
├── Header (навигация)
├── Main Content
│   ├── PostsList (список статей)
│   ├── CourseCard (карточки курсов)
│   ├── DigestBanner (баннеры дайджестов)
│   └── FrontieMascot (интерактивный маскот)
└── Footer (подвал)
```

## Система контента

### Content Collections

Проект использует Astro Content Collections для типизированного управления контентом:

```typescript
// src/content/config.ts
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // ... другие поля
  }),
});
```

### Структура контента

#### Блог (`src/content/blog/`)

```
blog/
├── css/                   # Статьи о CSS
│   ├── flexbox-guide/
│   │   ├── index.md
│   │   └── images/
│   └── grid-tutorial/
├── javascript/            # Статьи о JavaScript
├── ally/                  # Статьи о доступности
├── digest/                # Еженедельные дайджесты
└── other/                 # Прочие статьи
```

#### Курсы (`src/content/courses/`)

```
courses/
├── css-grid.md           # Курс по CSS Grid
├── flexbox.md            # Курс по Flexbox
└── msw.md                # Курс по MSW
```

#### Уроки (`src/content/lessons/`)

```
lessons/
├── introduction.md       # Вводный урок
├── container-items.md    # Урок о контейнерах
└── named-lines-areas.md  # Урок о именованных линиях
```

## Система стилей

### CSS переменные

Централизованная система дизайн-токенов:

```css
:root {
  /* Цвета */
  --accent: #007acc;
  --accent-light: #3291ff;
  --accent-dark: #0761d1;

  /* Размеры */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;

  /* Типографика */
  --text-sm: 0.875rem;
  --text-md: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
}
```

### Методология именования

Используется **BEM** (Block Element Modifier):

```css
.course-card {              /* Block */
  padding: var(--space-md);
}

.course-card__title {       /* Element */
  font-size: var(--text-xl);
}

.course-card--premium {     /* Modifier */
  border-color: var(--accent);
}
```

## Система маршрутизации

### Файловая маршрутизация

Astro использует файловую систему для маршрутизации:

```
src/pages/
├── index.astro            # Главная страница (/)
├── blog/
│   ├── [...slug].astro    # Динамические страницы статей
│   └── category/
│       └── [category].astro # Страницы категорий
├── course/
│   └── [...slug].astro    # Страницы курсов
└── digest/
    └── index.astro        # Страница дайджестов
```

### Динамические маршруты

```astro
---
// src/pages/blog/[...slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}
---
```

## Система данных

### Конфигурационные данные

```typescript
// src/consts.ts
export const SITE_TITLE = "Tech Blog";
export const SITE_DESCRIPTION = "Современный блог о веб-разработке";
export const SITE_URL = "https://your-site.com";
```

### Динамические данные

```typescript
// src/data/banners.ts
export const banners = [
  {
    id: "course-css-grid",
    title: "CSS Grid курс",
    description: "Изучите CSS Grid",
    image: "/images/banners/grid.jpg",
    link: "/course/css-grid/"
  }
];
```

## SEO и метаданные

### BaseHead компонент

Централизованное управление SEO:

```astro
---
// src/components/BaseHead.astro
interface Props {
  title: string;
  description?: string;
  image?: string;
}

const { title, description, image } = Astro.props;
---

<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  {image && <meta property="og:image" content={image} />}
</head>
```

### Open Graph и Twitter Cards

Автоматическая генерация социальных мета-тегов для всех страниц.

## Система изображений

### Оптимизация

- Автоматическая оптимизация через Astro
- Поддержка WebP формата
- Lazy loading для изображений
- Responsive images

### Структура

```
public/images/
├── banners/               # Баннеры для курсов
├── frontie/               # Изображения маскота
└── screenshots/           # Скриншоты
```

## Производительность

### Стратегии оптимизации

1. **Статическая генерация** - все страницы генерируются на этапе сборки
2. **Минимальный JavaScript** - только для интерактивных компонентов
3. **Оптимизация изображений** - автоматическое сжатие и конвертация
4. **CSS оптимизация** - удаление неиспользуемых стилей
5. **Кэширование** - правильные заголовки кэширования

### Метрики

- **Lighthouse Score**: 100/100
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## Доступность (A11y)

### Принципы

1. **Семантическая разметка** - правильное использование HTML тегов
2. **ARIA атрибуты** - для сложных интерактивных элементов
3. **Контрастность** - достаточный контраст цветов
4. **Навигация с клавиатуры** - полная поддержка
5. **Screen readers** - совместимость с программами чтения

### Компоненты

```astro
---
// Пример доступного компонента
---

<button
  class="course-card__button"
  aria-label="Купить курс CSS Grid"
  aria-describedby="course-description"
>
  Купить курс
</button>
```

## Безопасность

### Принципы

1. **Content Security Policy** - защита от XSS
2. **HTTPS** - обязательное использование
3. **Валидация данных** - проверка всех входных данных
4. **Безопасные зависимости** - регулярные обновления

### CSP настройки

```javascript
// astro.config.mjs
export default defineConfig({
  security: {
    headers: {
      'Content-Security-Policy': "default-src 'self'"
    }
  }
});
```

## Масштабируемость

### Архитектурные решения

1. **Модульная структура** - легко добавлять новые функции
2. **Компонентный подход** - переиспользование кода
3. **Типизация** - предотвращение ошибок
4. **Документация** - облегчение поддержки

### Расширение функциональности

- Добавление новых типов контента
- Интеграция с CMS
- Многоязычность
- Аналитика и метрики

## Мониторинг и аналитика

### Инструменты

- **Google Analytics** - отслеживание пользователей
- **Lighthouse CI** - мониторинг производительности
- **Error tracking** - отслеживание ошибок

### Метрики

- Количество посетителей
- Время на странице
- Конверсии (подписки, покупки курсов)
- Производительность страниц

## Деплой и CI/CD

### Платформы
- **Vercel** - основная платформа
- **Netlify** - альтернатива
- **GitHub Pages** - для статических сайтов

### Процесс деплоя
1. Push в main ветку
2. Автоматическая сборка
3. Тестирование
4. Деплой на продакшен

### Переменные окружения
```env
SITE_URL=https://your-production-site.com
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
NODE_ENV=production
```

## Заключение
Архитектура проекта tech-blog построена на современных принципах веб-разработки с акцентом на производительность, доступность и масштабируемость. Использование Astro обеспечивает отличную производительность, а компонентный подход упрощает разработку и поддержку.

### Ключевые преимущества
- ⚡ Высокая производительность
- 🎯 Отличная доступность
- 🔧 Легкость разработки
- 📈 Хорошая масштабируемость
- 🛡️ Безопасность
- 📱 Адаптивность
