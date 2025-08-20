---
title: "Grid Container и Grid Items"
course: "css-grid"
lesson: "container-items"
description: "Настройка контейнера и элементов сетки"
duration: "45 мин"
isPremium: false
order: 2
---

# Grid Container и Grid Items

В этом уроке мы подробно изучим свойства Grid Container (контейнера сетки) и Grid Items (элементов сетки).

## Grid Container Properties

### display: grid

Первое и самое важное свойство — это `display: grid`, которое превращает элемент в grid container.

```css
.container {
  display: grid; /* или inline-grid */
}
```

### grid-template-columns и grid-template-rows

Эти свойства определяют размеры столбцов и строк сетки.

```css
.container {
  display: grid;
  
  /* Три столбца: 200px, 1fr, 100px */
  grid-template-columns: 200px 1fr 100px;
  
  /* Три строки: auto, 200px, auto */
  grid-template-rows: auto 200px auto;
}
```

#### Единицы измерения в Grid

1. **fr (fractional unit)** — доля свободного пространства
2. **auto** — размер по содержимому
3. **px, %, em, rem** — фиксированные размеры
4. **min-content** — минимальный размер содержимого
5. **max-content** — максимальный размер содержимого

```css
.container {
  display: grid;
  grid-template-columns: 
    200px        /* фиксированная ширина */
    1fr          /* займет оставшееся место */
    minmax(100px, 200px)  /* минимум 100px, максимум 200px */
    auto;        /* по размеру содержимого */
}
```

### repeat() функция

Для создания повторяющихся паттернов используйте `repeat()`:

```css
.container {
  display: grid;
  
  /* 5 одинаковых столбцов */
  grid-template-columns: repeat(5, 1fr);
  
  /* Паттерн: 100px 200px 100px 200px 100px 200px */
  grid-template-columns: repeat(3, 100px 200px);
  
  /* Автоматическое заполнение */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

#### auto-fill vs auto-fit

```css
/* auto-fill: создает столько колонок, сколько помещается */
.container-fill {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

/* auto-fit: растягивает существующие колонки на всю ширину */
.container-fit {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

### gap (grid-gap)

Свойство для задания промежутков между элементами:

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  
  /* Одинаковые промежутки для строк и столбцов */
  gap: 20px;
  
  /* Разные промежутки: строки столбцы */
  gap: 20px 30px;
  
  /* Раздельно */
  row-gap: 20px;
  column-gap: 30px;
}
```

### grid-template-areas

Именованные области для более понятного кода:

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  gap: 20px;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
```

## Grid Items Properties

### grid-column и grid-row

Размещение элементов по линиям сетки:

```css
.item {
  /* Занимает столбцы с 1 по 3 линию */
  grid-column: 1 / 3;
  
  /* Занимает строки с 2 по 4 линию */
  grid-row: 2 / 4;
  
  /* Короткая запись */
  grid-column: 1 / span 2; /* начинается с 1 линии, занимает 2 столбца */
  grid-row: 2 / span 2;    /* начинается с 2 линии, занимает 2 строки */
}
```

### grid-area

Краткая запись для позиционирования:

```css
.item {
  /* grid-row-start / grid-column-start / grid-row-end / grid-column-end */
  grid-area: 1 / 2 / 3 / 4;
  
  /* Или использование именованной области */
  grid-area: header;
}
```

### justify-self и align-self

Выравнивание отдельных элементов:

```css
.item {
  /* Горизонтальное выравнивание */
  justify-self: start | end | center | stretch;
  
  /* Вертикальное выравнивание */
  align-self: start | end | center | stretch;
  
  /* Сокращенная запись */
  place-self: center; /* center center */
  place-self: start end; /* start end */
}
```

## Практический пример

Создадим адаптивную карточную сетку:

```css
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.card.featured {
  /* Особая карточка занимает 2 столбца */
  grid-column: span 2;
}

.card.tall {
  /* Высокая карточка занимает 2 строки */
  grid-row: span 2;
}
```

```html
<div class="cards-grid">
  <div class="card">Обычная карточка</div>
  <div class="card featured">Широкая карточка</div>
  <div class="card">Обычная карточка</div>
  <div class="card tall">Высокая карточка</div>
  <div class="card">Обычная карточка</div>
  <div class="card">Обычная карточка</div>
</div>
```

## Полезные паттерны

### Центрирование элемента

```css
.container {
  display: grid;
  place-items: center;
  height: 100vh;
}
```

### Святой Грааль макет

```css
.holy-grail {
  display: grid;
  grid-template: auto 1fr auto / auto 1fr auto;
  min-height: 100vh;
}

.header { grid-column: 1 / -1; }
.footer { grid-column: 1 / -1; }
```

### Равновысокие карточки

```css
.equal-height-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.card {
  display: grid; /* Вложенный grid для содержимого */
  grid-template-rows: auto 1fr auto; /* header, content, footer */
}
```

## Задания для закрепления

1. Создайте сетку 3×3 с равными ячейками
2. Сделайте одну ячейку занимающей 2 столбца
3. Создайте адаптивную галерею изображений
4. Постройте макет блога с боковой панелью

В следующем уроке мы изучим именованные линии и области — более продвинутые техники работы с CSS Grid! 🚀 