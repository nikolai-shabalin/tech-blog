# Шаблоны для создания курсов

Этот файл содержит готовые шаблоны для быстрого создания курсов и уроков.

## Шаблон курса

Скопируйте этот шаблон в файл `src/content/courses/your-course-name.md`:

```yaml
---
title: "Название вашего курса"
description: "Краткое описание курса в одно-два предложения"
level: "beginner"
duration: "3 часа"
price: 1990
isPremium: true
tags: ["tag1", "tag2", "tag3"]
lessons:
  - title: "Первый урок"
    slug: "lesson-1"
    description: "Описание первого урока"
    isPremium: false
    duration: "30 мин"
  - title: "Второй урок"
    slug: "lesson-2"
    description: "Описание второго урока"
    isPremium: true
    duration: "45 мин"
  - title: "Третий урок"
    slug: "lesson-3"
    description: "Описание третьего урока"
    isPremium: true
    duration: "60 мин"
---

# Название вашего курса

Введение в курс. Опишите, что изучат пользователи и для кого предназначен курс.

## Что вы изучите

- Первый навык
- Второй навык
- Третий навык

## Для кого этот курс

Опишите целевую аудиторию курса.

## Требования

Какие знания нужны для прохождения курса.

## Структура курса

Краткое описание каждого урока.
```

## Шаблон урока

Скопируйте этот шаблон в файл `src/content/lessons/your-lesson-name.md`:

```yaml
---
title: "Название урока"
course: "your-course-name"
lesson: "lesson-1"
description: "Описание урока"
duration: "30 мин"
isPremium: false
order: 1
---

# Название урока

Введение в тему урока.

## Что мы изучим

- Первый пункт
- Второй пункт
- Третий пункт

## Основная часть

Основное содержание урока.

### Подраздел 1

Описание подраздела.

```css
/* Пример кода */
.example {
  property: value;
}
```

### Подраздел 2

Еще один подраздел.

## Практический пример

```html
<div class="container">
  <div class="item">Элемент 1</div>
  <div class="item">Элемент 2</div>
</div>
```

```css
.container {
  display: flex;
  gap: 20px;
}

.item {
  padding: 20px;
  background: #f0f0f0;
}
```

## Важные моменты

- Важный момент 1
- Важный момент 2
- Важный момент 3

## Домашнее задание

1. Задание 1
2. Задание 2
3. Задание 3

## Что дальше?

В следующем уроке мы изучим...

## Полезные ссылки

- [Документация](https://example.com)
- [Статья на MDN](https://developer.mozilla.org)
- [Примеры](https://example.com/examples)
```

## Шаблон бесплатного курса

```yaml
---
title: "Бесплатный курс"
description: "Описание бесплатного курса"
level: "beginner"
duration: "2 часа"
isPremium: false
tags: ["free", "basics", "tutorial"]
lessons:
  - title: "Введение"
    slug: "introduction"
    description: "Вводный урок"
    isPremium: false
    duration: "20 мин"
  - title: "Основы"
    slug: "basics"
    description: "Основные концепции"
    isPremium: false
    duration: "30 мин"
  - title: "Практика"
    slug: "practice"
    description: "Практические задания"
    isPremium: false
    duration: "40 мин"
---
```

## Шаблон платного курса

```yaml
---
title: "Платный курс"
description: "Описание платного курса"
level: "advanced"
duration: "5 часов"
price: 2990
isPremium: true
tags: ["premium", "advanced", "professional"]
lessons:
  - title: "Введение"
    slug: "introduction"
    description: "Вводный урок (бесплатный)"
    isPremium: false
    duration: "30 мин"
  - title: "Продвинутые техники"
    slug: "advanced-techniques"
    description: "Продвинутые техники (платный)"
    isPremium: true
    duration: "60 мин"
  - title: "Практические проекты"
    slug: "projects"
    description: "Реальные проекты (платный)"
    isPremium: true
    duration: "90 мин"
---
```

## Быстрый старт

1. Создайте файл курса в `src/content/courses/`
2. Создайте файлы уроков в `src/content/lessons/`
3. Замените все placeholder'ы на реальные данные
4. Проверьте связи между курсом и уроками
5. Запустите проект для проверки

## Полезные команды для проверки

```bash
# Проверка типов
npm run type-check

# Запуск в режиме разработки
npm run dev

# Проверка сборки
npm run build
``` 