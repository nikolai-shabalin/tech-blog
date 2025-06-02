---
title: "Еженедельный дайджест #1: Новости фронтенда"
description: "Самые интересные новости из мира фронтенд-разработки за последнюю неделю"
pubDate: "Apr 19 2024"
---

## Новые возможности CSS

### CSS Container Queries
Контейнерные запросы (Container Queries) теперь поддерживаются во всех основных браузерах. Это позволяет создавать адаптивные компоненты, которые реагируют на размер их контейнера, а не только на размер viewport.

```css
@container (min-width: 400px) {
  .card {
    grid-template-columns: 1fr 1fr;
  }
}
```

### CSS Scroll-Driven Animations
Новая спецификация позволяет создавать анимации, привязанные к прокрутке страницы. Это открывает новые возможности для создания интерактивных интерфейсов.

## JavaScript

### Новый метод Array.prototype.groupBy
В JavaScript появился новый метод для группировки элементов массива:

```javascript
const items = [
  { type: 'fruit', name: 'apple' },
  { type: 'vegetable', name: 'carrot' },
  { type: 'fruit', name: 'banana' }
];

const grouped = items.groupBy(item => item.type);
// Результат:
// {
//   fruit: [{ type: 'fruit', name: 'apple' }, { type: 'fruit', name: 'banana' }],
//   vegetable: [{ type: 'vegetable', name: 'carrot' }]
// }
```

## Инструменты и библиотеки

### Astro 4.0
Вышла новая версия Astro с улучшенной производительностью и новыми возможностями. Основные изменения:
- Улучшенная поддержка View Transitions
- Новая система кэширования
- Улучшенная поддержка TypeScript

## Полезные ресурсы

1. [CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
2. [Scroll-Driven Animations](https://developer.chrome.com/docs/web-platform/scroll-driven-animations/)
3. [Array.prototype.groupBy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupBy) 