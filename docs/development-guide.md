# Руководство по разработке

Это руководство поможет вам настроить окружение для разработки и понять процесс работы с проектом.

## Требования

### Системные требования

- **Node.js** версии 18.0.0 или выше
- **npm** или **pnpm** (рекомендуется)
- **Git** для работы с репозиторием

### Проверка версий

```bash
node --version
npm --version
git --version
```

## Настройка окружения

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/tech-blog.git
cd tech-blog
```

### 2. Установка зависимостей

```bash
# Используя npm
npm install

# Или используя pnpm (рекомендуется)
pnpm install
```

### 3. Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Основные настройки
SITE_URL=https://your-site.com
SITE_TITLE=Tech Blog
SITE_DESCRIPTION=Современный блог о веб-разработке

# Аналитика (опционально)
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Социальные сети (опционально)
TWITTER_USERNAME=your_twitter
GITHUB_USERNAME=your_github
```

## Структура проекта

```
tech-blog/
├── public/                 # Статические файлы
│   ├── images/            # Изображения
│   ├── icons/             # Иконки
│   └── manifest.json      # PWA манифест
├── src/
│   ├── components/        # React/Astro компоненты
│   ├── content/           # Контент (статьи, курсы)
│   │   ├── blog/          # Статьи блога
│   │   ├── courses/       # Курсы
│   │   └── lessons/       # Уроки курсов
│   ├── data/              # Данные (баннеры, конфиги)
│   ├── layouts/           # Макеты страниц
│   ├── pages/             # Страницы сайта
│   ├── styles/            # CSS стили
│   └── types/             # TypeScript типы
├── docs/                  # Документация
├── astro.config.mjs       # Конфигурация Astro
├── package.json           # Зависимости и скрипты
└── tsconfig.json          # Конфигурация TypeScript
```

## Команды разработки

### Основные команды

```bash
# Запуск в режиме разработки
npm run dev

# Сборка проекта
npm run build

# Предварительный просмотр сборки
npm run preview

# Проверка типов TypeScript
npm run type-check

# Линтинг кода
npm run lint

# Форматирование кода
npm run format
```

### Дополнительные команды

```bash
# Очистка кэша
npm run clean

# Проверка зависимостей
npm audit

# Обновление зависимостей
npm update
```

## Процесс разработки

### 1. Создание новой ветки

```bash
git checkout -b feature/your-feature-name
```

### 2. Разработка

1. Внесите изменения в код
2. Запустите `npm run dev` для локальной разработки
3. Проверьте изменения в браузере
4. Запустите `npm run type-check` для проверки типов
5. Запустите `npm run lint` для проверки кода

### 3. Тестирование

```bash
# Проверка типов
npm run type-check

# Линтинг
npm run lint

# Сборка
npm run build

# Предварительный просмотр
npm run preview
```

### 4. Коммит изменений

```bash
git add .
git commit -m "feat: добавлена новая функция"
```

### 5. Push и Pull Request

```bash
git push origin feature/your-feature-name
```

## Технологии

### Основной стек

- **Astro** - фреймворк для статических сайтов
- **TypeScript** - типизированный JavaScript
- **Markdown/MDX** - разметка для контента
- **CSS** - стили (без препроцессоров)

### Компоненты

- **React** - для интерактивных компонентов
- **Astro Components** - для статических компонентов

### Инструменты

- **ESLint** - линтинг кода
- **Prettier** - форматирование кода
- **TypeScript** - проверка типов

## Конфигурация

### Astro (`astro.config.mjs`)

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: 'https://your-site.com',
  base: '/',
  trailingSlash: 'always',
  build: {
    assets: 'assets',
  },
});
```

### TypeScript (`tsconfig.json`)

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### ESLint (`.eslintrc.js`)

```javascript
module.exports = {
  extends: ['@astrojs/eslint-config'],
  rules: {
    // Ваши правила
  }
};
```

## Работа с контентом

### Создание статьи

1. Создайте папку в `src/content/blog/category/`
2. Добавьте файл `index.md` с frontmatter
3. Напишите контент в Markdown
4. Добавьте изображения в папку статьи

### Создание курса

1. Создайте файл в `src/content/courses/`
2. Добавьте frontmatter с информацией о курсе
3. Создайте файлы уроков в `src/content/lessons/`
4. Свяжите курс и уроки через slug'и

## Стили и CSS

### Структура стилей

```
src/styles/
├── global.css      # Глобальные стили
└── transitions.css # Анимации и переходы
```

### CSS переменные

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

### Рекомендации по стилям

1. Используйте CSS переменные для консистентности
2. Придерживайтесь методологии BEM для классов
3. Используйте логические свойства CSS
4. Обеспечивайте доступность (a11y)

## Компоненты

### Создание компонента

```astro
---
// src/components/MyComponent.astro
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<div class="my-component">
  <h2 class="my-component__title">{title}</h2>
  {description && (
    <p class="my-component__description">{description}</p>
  )}
</div>

<style>
  .my-component {
    padding: var(--space-md);
    border: 1px solid rgba(var(--gray), 0.2);
    border-radius: 8px;
  }
  
  .my-component__title {
    font-size: var(--text-xl);
    margin-bottom: var(--space-sm);
  }
  
  .my-component__description {
    color: rgb(var(--gray-dark));
    line-height: 1.6;
  }
</style>
```

### React компоненты

```tsx
// src/components/MyReactComponent.tsx
import React from 'react';

interface Props {
  title: string;
  onClick?: () => void;
}

export default function MyReactComponent({ title, onClick }: Props) {
  return (
    <button 
      className="my-react-component"
      onClick={onClick}
    >
      {title}
    </button>
  );
}
```

## Отладка

### DevTools

1. **Chrome DevTools** - для отладки CSS и JavaScript
2. **React DevTools** - для отладки React компонентов
3. **Astro DevTools** - для отладки Astro

### Логи

```bash
# Подробные логи сборки
npm run build -- --verbose

# Логи разработки
npm run dev -- --verbose
```

### Проверка производительности

```bash
# Lighthouse CI
npm run lighthouse

# Bundle analyzer
npm run analyze
```

## Деплой

### Подготовка к деплою

```bash
# Сборка проекта
npm run build

# Проверка сборки
npm run preview
```

### Платформы деплоя

- **Vercel** - рекомендуемая платформа
- **Netlify** - альтернатива
- **GitHub Pages** - для статических сайтов

### Переменные окружения для продакшена

```env
SITE_URL=https://your-production-site.com
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## Лучшие практики

### Код

1. **Типизация** - используйте TypeScript везде
2. **Компоненты** - разбивайте на мелкие компоненты
3. **Именование** - используйте понятные имена
4. **Документация** - комментируйте сложный код

### Производительность

1. **Изображения** - оптимизируйте размеры
2. **Бандл** - минимизируйте размер JavaScript
3. **Кэширование** - используйте правильные заголовки
4. **Lazy loading** - для изображений и компонентов

### Доступность

1. **Семантика** - используйте правильные HTML теги
2. **ARIA** - добавляйте атрибуты доступности
3. **Контраст** - обеспечьте достаточный контраст
4. **Клавиатура** - поддерживайте навигацию с клавиатуры

## Поддержка

### Полезные ссылки

- [Astro Documentation](https://docs.astro.build/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Сообщество

- [Astro Discord](https://astro.build/chat)
- [GitHub Issues](https://github.com/your-username/tech-blog/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/astro)

### Отладка проблем

1. Проверьте консоль браузера
2. Изучите логи сборки
3. Проверьте документацию
4. Создайте issue в репозитории 