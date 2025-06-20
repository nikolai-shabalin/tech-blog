# Руководство по созданию курсов

Это руководство поможет новым разработчикам добавить курс в проект. Здесь описана полная структура курса, все доступные настройки и примеры использования.

## Структура курса
Курс состоит из двух основных частей:
1. **Файл курса** - основная информация о курсе
2. **Файлы уроков** - отдельные уроки курса

### 1. Создание файла курса
Создайте файл в папке `src/content/courses/` с расширением `.md`. Например: `my-course.md`

#### Структура frontmatter курса
```yaml
---
title: "Название курса"
description: "Краткое описание курса"
level: "beginner" # или "intermediate", "advanced"
duration: "3 часа"
price: 1990 # опционально, только для платных курсов
isPremium: true # или false
tags: ["tag1", "tag2", "tag3"]
lessons:
  - title: "Название урока"
    slug: "lesson-slug"
    description: "Описание урока"
    isPremium: false # или true
    duration: "30 мин"
---
```

#### Описание полей

| Поле          | Тип     | Обязательное | Описание                                                  |
|---------------|---------|--------------|-----------------------------------------------------------|
| `title`       | string  | ✅            | Название курса                                            |
| `description` | string  | ✅            | Краткое описание курса                                    |
| `level`       | enum    | ✅            | Уровень сложности: `beginner`, `intermediate`, `advanced` |
| `duration`    | string  | ✅            | Общая продолжительность курса                             |
| `price`       | number  | ❌            | Цена курса в рублях (только для платных курсов)           |
| `isPremium`   | boolean | ❌            | Является ли курс платным (по умолчанию `false`)           |
| `tags`        | array   | ❌            | Массив тегов для категоризации                            |
| `lessons`     | array   | ✅            | Массив уроков курса                                       |

#### Структура урока в курсе

```yaml
lessons:
  - title: "Название урока"
    slug: "lesson-slug" # уникальный идентификатор урока
    description: "Описание урока"
    isPremium: false # платный ли урок
    duration: "30 мин" # продолжительность урока
```

### 2. Создание файлов уроков
Для каждого урока из списка `lessons` создайте отдельный файл в папке `src/content/lessons/` с расширением `.md`.

#### Структура frontmatter урока
```yaml
---
title: "Название урока"
course: "course-slug" # slug курса (без расширения .md)
lesson: "lesson-slug" # slug урока
description: "Описание урока"
duration: "30 мин" # опционально
isPremium: false # или true
order: 1 # порядковый номер урока
---
```

#### Описание полей урока

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `title` | string | ✅ | Название урока |
| `course` | string | ✅ | Slug курса (имя файла курса без .md) |
| `lesson` | string | ✅ | Slug урока (должен совпадать с slug в курсе) |
| `description` | string | ✅ | Описание урока |
| `duration` | string | ❌ | Продолжительность урока |
| `isPremium` | boolean | ❌ | Платный ли урок (по умолчанию `false`) |
| `order` | number | ✅ | Порядковый номер урока |

## Примеры
### Пример бесплатного курса

**Файл:** `src/content/courses/flexbox-basics.md`

```yaml
---
title: "Flexbox: Основы"
description: "Изучите основы Flexbox для создания гибких макетов"
level: "beginner"
duration: "2 часа"
isPremium: false
tags: ["css", "layout", "flexbox"]
lessons:
  - title: "Введение в Flexbox"
    slug: "introduction"
    description: "Основные концепции Flexbox"
    isPremium: false
    duration: "20 мин"
  - title: "Flex Container"
    slug: "container"
    description: "Настройка flex-контейнера"
    isPremium: false
    duration: "30 мин"
  - title: "Flex Items"
    slug: "items"
    description: "Управление flex-элементами"
    isPremium: false
    duration: "40 мин"
---
```

**Файл:** `src/content/lessons/introduction.md`

```yaml
---
title: "Введение в Flexbox"
course: "flexbox-basics"
lesson: "introduction"
description: "Основные концепции Flexbox"
duration: "20 мин"
isPremium: false
order: 1
---

# Введение в Flexbox

Содержимое урока...
```

### Пример платного курса
**Файл:** `src/content/courses/advanced-css.md`

```yaml
---
title: "Продвинутый CSS"
description: "Изучите продвинутые техники CSS"
level: "advanced"
duration: "5 часов"
price: 2990
isPremium: true
tags: ["css", "advanced", "techniques"]
lessons:
  - title: "CSS Grid"
    slug: "css-grid"
    description: "Двумерные макеты с CSS Grid"
    isPremium: false
    duration: "45 мин"
  - title: "CSS Custom Properties"
    slug: "custom-properties"
    description: "Работа с CSS переменными"
    isPremium: true
    duration: "60 мин"
  - title: "CSS Animations"
    slug: "animations"
    description: "Создание анимаций"
    isPremium: true
    duration: "90 мин"
---
```

## Важные моменты
### 1. Согласованность данных

- `course` в уроке должен совпадать с именем файла курса (без .md)
- `lesson` в уроке должен совпадать с `slug` в списке уроков курса
- `order` должен быть уникальным для каждого урока в рамках курса

### 2. Уровни сложности

- `beginner` - для начинающих разработчиков
- `intermediate` - для разработчиков со средним опытом
- `advanced` - для опытных разработчиков

### 3. Платные материалы

- Если `isPremium: true` для курса, то курс становится платным
- Можно делать отдельные уроки платными внутри бесплатного курса
- Цена указывается только для платных курсов

### 4. Теги

Используйте теги для категоризации курсов. Популярные теги:
- `css`, `javascript`, `html` - технологии
- `layout`, `responsive`, `animation` - темы
- `beginner`, `intermediate`, `advanced` - уровни

## Структура папок

```
src/
├── content/
│   ├── courses/
│   │   ├── my-course.md          # Файл курса
│   │   └── another-course.md     # Другой курс
│   └── lessons/
│       ├── lesson-1.md           # Урок 1
│       ├── lesson-2.md           # Урок 2
│       └── lesson-3.md           # Урок 3
```

## Проверка

После создания курса убедитесь, что:

1. ✅ Файл курса находится в `src/content/courses/`
2. ✅ Все файлы уроков находятся в `src/content/lessons/`
3. ✅ Frontmatter соответствует схеме
4. ✅ Связи между курсом и уроками корректны
5. ✅ Порядковые номера уроков уникальны
6. ✅ Slug'ы уникальны в рамках курса

## Полезные команды

```bash
# Проверка типов Astro
npm run type-check

# Запуск в режиме разработки
npm run dev

# Сборка проекта
npm run build
```

## Поддержка

Если у вас возникли вопросы или проблемы при создании курса, обратитесь к команде разработки или создайте issue в репозитории проекта.
