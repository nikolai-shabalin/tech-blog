---
title: 'Управление прокруткой с помощью CSS Scroll Snap Module Level 1'
description: ''
pubDate: 'Mar 14 2026'
---

Практически все веб-интерфейсы используют плавную прокрутку для создания эффекта смены страниц, каруселей, галерей или длинных лендингов с секциями. Однако стандартное поведение скролла не всегда позволяет точно остановиться на нужном элементе — пользователь может случайно остановиться между секциями, оставив элемент частично видимым. Спецификация **[CSS Scroll Snap Module Level 1](https://www.w3.org/TR/css-scroll-snap-1/)** решает эту проблему, позволяя разработчикам задавать «точки привязки» (snap positions), к которым «прилипает» прокрутка после завершения скролла.

## Что такое CSS Scroll Snap?

Scroll Snap — это набор CSS-свойств, которые управляют поведением прокрутки в scroll-контейнере. Они позволяют «привязывать» позицию прокрутки к определённым элементам или выравниваниям. Разработчик не управляет каждым пикселем прокрутки вручную, а задаёт набор допустимых позиций, возле которых браузер может корректировать финальную остановку скролла.
 Это полезно для:

- постраничной прокрутки (pagination);
- горизонтальных галерей изображений;
- вертикальных лендингов с секциями на весь экран;
- любого интерфейса, где важно точно позиционировать прокручиваемый контент.

Модуль находится на стадии **Candidate Recommendation Snapshot** и достаточно хорошо поддерживается современными браузерами (включая мобильные). Он не заменяет существующие механизмы скролла, а дополняет их.

## Основные понятия

Прежде чем перейти к свойствам, выстроим терминологию.

> Все слайдеры специально сделаны вертикальными, чтобы удобнее работать с колёсиком мышки, но это также будет работать для стандартынх горизонтальных слайдеров.
> Чтобы лучше ощутить понятия - скрольте примеры =)

### 1) Сцена: `scroll container`

Это элемент с реальной прокруткой (`overflow: auto|scroll`). Именно этот контейнер участвует в snapping.

**Основные механизмы `scroll conainer`:**
- Именно здесь прокручивается весь контент внутри;
- именно этот контейнер потом “ловит” snap-позиции, о которых узнаете чуть позже.

<div class="ssx-demo ssx-scroll-container-wrap">
  <div class="ssx-slider-demo ssx-scroll-container">
    <div class="ssx-cards">
      <div class="ssx-card">1</div>
      <div class="ssx-card">2</div>
      <div class="ssx-card">3</div>
      <div class="ssx-card">4</div>
    </div>
  </div>
</div>

```html
<div class="gallery">
  <div class="slide">1</div>
  <div class="slide">2</div>
  <div class="slide">3</div>
  <div class="slide">4</div>
</div>
```

```css
.gallery {
  overflow: auto; /* без этого scroll container не появляется */
}
```

### 2) Видимая часть: `scrollport`

`scrollport` — видимая внутренняя область scroll контейнера, «окно» прокрутки.
Это не `position: fixed` относительно страницы, а фиксированная область внутри самого скролл-контейнера.

**Основные механизмы `scroll conainer`:**
- видимая внутренняя область контейнера;
- это “окно”, через которое мы смотрим на прокручиваемый контент.

<div class="ssx-demo ssx-scrollport-demo">
  <div class="ssx-slider-demo ssx-scrollport-demo__scroller">
    <div class="ssx-cards">
      <div class="ssx-card">1</div>
      <div class="ssx-card">2</div>
      <div class="ssx-card">3</div>
      <div class="ssx-card">4</div>
    </div>
  </div>
  <div class="ssx-overlay ssx-overlay--scrollport">scrollport</div>
</div>

### 3) Смещение целевой области: `scroll-padding`

`scroll-padding` не двигает layout, а меняет предпочтительную область, куда браузер стремится привести элемент.

<div class="ssx-demo ssx-slider-demo">
  <div class="ssx-fixed-head">fixed header</div>
  <div class="ssx-cards">
    <div class="ssx-card">1</div>
    <div class="ssx-card">2</div>
    <div class="ssx-card">3</div>
    <div class="ssx-card">4</div>
  </div>
  <div class="ssx-overlay ssx-overlay--padding">область после scroll-padding</div>
</div>

### 4) `snapport`

`Snapport = scrollport`, уменьшенный с учётом `scroll-padding`.

<div class="ssx-demo ssx-slider-demo ssx-snapport-demo">
  <div class="ssx-cards">
    <div class="ssx-card">1</div>
    <div class="ssx-card">2</div>
    <div class="ssx-card">3</div>
  </div>
  <div class="ssx-overlay ssx-overlay--snapport">snapport</div>
</div>

### 5) Сторона элемента: `scroll snap area`

`Scroll snap area` строится из `border box` элемента и может расширяться `scroll-margin`.

<div class="ssx-demo ssx-area-demo">
  <div class="ssx-area-item">border box</div>
</div>

### 6) Подпункт: `scroll-margin`

`scroll-margin` расширяет snap area наружу и влияет на расчёт snap/scrollTo/якорей.

<div class="ssx-margin-grid">
  <div class="ssx-demo ssx-area-demo">
    <div class="ssx-area-item ssx-area-item--plain">без scroll-margin</div>
  </div>
  <div class="ssx-demo ssx-area-demo">
    <div class="ssx-area-item">с scroll-margin</div>
  </div>
</div>

### 7) Правило выравнивания: `scroll-snap-align`

`scroll-snap-align` задаёт, как выровнять `snap area` элемента относительно `snapport`: `start`, `center`, `end`.
Для наглядности ниже использую неофициальный термин `snap-line`.

<div class="ssx-align-grid">
  <div class="ssx-align ssx-align--start"><span>start ↔ start</span></div>
  <div class="ssx-align ssx-align--center"><span>center ↔ center</span></div>
  <div class="ssx-align ssx-align--end"><span>end ↔ end</span></div>
</div>

### 8) `snap position` (singular)

Это конкретное значение `scrollTop`/`scrollLeft`, при котором выбранное выравнивание выполнено.

<div class="ssx-demo ssx-slider-demo ssx-position-demo">
  <div class="ssx-position-track">
    <div class="ssx-position-slide">1</div>
    <div class="ssx-position-slide ssx-position-slide--active">2</div>
    <div class="ssx-position-slide">3</div>
  </div>
  <div class="ssx-snap-line ssx-snap-line--port"></div>
</div>

Формула: **snap area + snapport + align-правило = snap position**.

### 9) `snap positions` (plural)

У контейнера обычно много кандидатов; браузер выбирает подходящий.

<div class="ssx-demo ssx-slider-demo ssx-positions-demo">
  <div class="ssx-cards">
    <div class="ssx-card">1</div>
    <div class="ssx-card">2</div>
    <div class="ssx-card">3</div>
    <div class="ssx-card">4</div>
  </div>
  <div class="ssx-candidate-dots">
    <span></span><span></span><span></span><span></span>
  </div>
</div>

### 10) Включатель режима: `scroll-snap-type`

`scroll-snap-type` включает snapping на контейнере и задаёт ось/строгость.

<div class="ssx-type-grid">
  <code>x mandatory</code>
  <code>y proximity</code>
  <code>both mandatory</code>
</div>

### 11) Процесс: `snapping`

После естественного end-point браузер может довести прокрутку до ближайшей уместной snap-позиции.

<svg class="ssx-snapping-svg" viewBox="0 0 760 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="snapping process">
  <rect x="10" y="24" width="740" height="42" rx="8" fill="#f1f5f9"/>
  <line x1="200" y1="18" x2="200" y2="72" stroke="#94a3b8" stroke-width="3"/>
  <line x1="540" y1="18" x2="540" y2="72" stroke="#dc2626" stroke-width="3"/>
  <text x="132" y="14" font-size="12" fill="#475569">natural end-point</text>
  <text x="488" y="14" font-size="12" fill="#b91c1c">snapped position</text>
  <path d="M220 45 C320 45 420 45 520 45" fill="none" stroke="#0ea5e9" stroke-width="3" marker-end="url(#ssxArrow)"/>
  <defs>
    <marker id="ssxArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#0ea5e9"/>
    </marker>
  </defs>
</svg>

<style>
.ssx-demo {
  position: relative;
  margin: 12px 0 24px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  min-height: 110px;
}

.ssx-slider-demo {
  overscroll-behavior: none;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: y mandatory;
  height: 248px;
  padding: 12px;
}

.ssx-scrollport-demo__scroller {
  position: relative;
}

.ssx-scroll-container {
  overflow-y: auto;
  overflow-x: hidden;
  border: 3px dashed #ef4444;
  border-radius: 12px;
  padding: 12px;
}

.ssx-scroll-container-wrap {
  padding: 12px;
}

.ssx-scroll-container-wrap::before {
  content: "scroll container";
  position: absolute;
  top: 3px;
  left: 12px;
  background: #ef4444;
  color: #fff;
  border-radius: 999px;
  font-size: 11px;
  padding: 2px 8px;
}

.ssx-scroll-container .ssx-cards {
  gap: 14px;
}

.ssx-long-content {
  height: 220px;
  border-radius: 10px;
  background: linear-gradient(180deg, #dbeafe 0 30%, #bfdbfe 30% 60%, #93c5fd 60% 100%);
}

.ssx-overlay {
  position: absolute;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.ssx-overlay--scrollport {
  inset: 12px;
  border: 2px dashed #475569;
  color: #334155;
  z-index: 5;
}

.ssx-fixed-head {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  height: 30px;
  border-radius: 8px;
  background: #0f172a;
  color: #fff;
  font-size: 11px;
  display: grid;
  place-items: center;
  z-index: 2;
}

.ssx-overlay--padding {
  top: 50px;
  right: 12px;
  bottom: 12px;
  left: 12px;
  border: 2px dashed #dc2626;
  color: #b91c1c;
  background: rgba(254, 226, 226, .22);
}

.ssx-snapport-demo {
  overflow-y: auto;
  scroll-padding: 56px 0;
}

.ssx-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ssx-card {
  flex: 0 0 96px;
  min-height: 96px;
  border-radius: 10px;
  background: #e2e8f0;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 28px;
  color: #0f172a;
  scroll-snap-align: center;
}

.ssx-overlay--snapport {
  top: 56px;
  bottom: 56px;
  left: 8px;
  right: 8px;
  border: 2px dashed #dc2626;
  color: #b91c1c;
}

.ssx-area-demo {
  display: grid;
  place-items: center;
  border-color: #f59e0b;
  background: #fffbeb;
}

.ssx-area-item {
  width: 220px;
  height: 70px;
  border-radius: 10px;
  border: 2px solid #d97706;
  background: #fde68a;
  display: grid;
  place-items: center;
  position: relative;
}

.ssx-area-item::before {
  content: "scroll snap area";
  position: absolute;
  top: -18px;
  font-size: 11px;
  color: #92400e;
}

.ssx-area-item::after {
  content: "outset от scroll-margin";
  position: absolute;
  inset: -10px -22px;
  border: 2px dashed #f59e0b;
  border-radius: 12px;
  font-size: 10px;
  color: #92400e;
  display: grid;
  place-items: end center;
  padding-bottom: 2px;
}

.ssx-margin-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ssx-area-item--plain::after {
  content: "без outsets";
  inset: 0;
  border-style: dotted;
}

.ssx-align-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 12px 0 22px;
}

.ssx-align {
  min-height: 100px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  position: relative;
}

.ssx-align span {
  position: absolute;
  top: 6px;
  left: 8px;
  font-size: 11px;
  font-weight: 700;
}

.ssx-align::before {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  border-top: 2px dashed #dc2626;
}

.ssx-align::after {
  content: "";
  position: absolute;
  left: 26px;
  right: 26px;
  border-top: 2px dotted #f59e0b;
}

.ssx-align--start::before,
.ssx-align--start::after { top: 36px; }

.ssx-align--center::before,
.ssx-align--center::after { top: 54px; }

.ssx-align--end::before,
.ssx-align--end::after { top: 74px; }

.ssx-position-demo {
  overflow-y: auto;
  overflow-x: hidden;
}

.ssx-position-track {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ssx-position-slide {
  flex: 0 0 96px;
  min-height: 96px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fecaca, #fda4af);
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 28px;
  position: relative;
  scroll-snap-align: center;
}

.ssx-position-slide--active::after {
  content: "snap area center";
  position: absolute;
  left: 8px;
  right: 8px;
  top: 50%;
  border-top: 2px dotted #b45309;
  font-size: 10px;
  color: #92400e;
  padding-top: 4px;
}

.ssx-snap-line--port {
  position: absolute;
  left: 8px;
  right: 8px;
  top: 50%;
  border-top: 2px dashed #dc2626;
}

.ssx-candidate-dots {
  display: grid;
  justify-items: center;
  gap: 6px;
  margin-top: 8px;
}

.ssx-candidate-dots span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #2563eb;
}

.ssx-type-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 10px 0 20px;
}

.ssx-type-grid code {
  display: block;
  text-align: center;
  border-radius: 10px;
  padding: 12px 8px;
  background: #111827;
  color: #e5e7eb;
}

.ssx-snapping-svg {
  width: 100%;
  height: auto;
  margin: 8px 0 24px;
  border-radius: 10px;
  background: #fff;
}
</style>

Именно поэтому свойства в модуле разделены на две группы:

- контейнер описывает, **по какой оси** и **с какой строгостью** нужно искать snap-позиции;
- дочерний элемент описывает, **какую область** считать значимой и **как именно** её выравнивать.

## Свойства для scroll-контейнера

### 1. `scroll-snap-type`

Это главное свойство, которое активирует механизм привязки для контейнера. Оно определяет, по каким осям работает snapping и насколько строго он применяется.

```css
scroll-snap-type: none | [ x | y | block | inline | both ] [ mandatory | proximity ]?;
```

- **Ось (axis)**:
  - `x` — горизонтальная ось;
  - `y` — вертикальная;
  - `block` — ось, соответствующая направлению блока (зависит от writing mode);
  - `inline` — строчная ось;
  - `both` — обе оси независимо.
- **Строгость (strictness)**:
  - `none` — отключает привязку (значение по умолчанию);
  - `mandatory` — браузер *обязан* остановиться на snap-позиции после завершения прокрутки;
  - `proximity` — браузер *может* остановиться на snap-позиции, если пользователь остановился достаточно близко к ней (рекомендуется для мягкого взаимодействия).

**Пример: простой вертикальный слайдер**

```html
<div class="gallery">
  <img src="photo1.jpg" alt="">
  <img src="photo2.jpg" alt="">
  <img src="photo3.jpg" alt="">
</div>
```

```css
.gallery {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 320px;
  scroll-snap-type: y mandatory; /* Принудительная привязка по вертикали */
}

.gallery img {
  scroll-snap-align: center;   /* Центрировать каждый слайд по вертикали */
  flex: 0 0 220px;
  width: 100%;
  margin-bottom: 1rem;
}
```

Здесь при прокрутке слайдер всегда остановится так, чтобы очередное изображение оказалось по центру контейнера.

### 2. `scroll-padding`

Свойство определяет внутренние отступы для snapport — области, которая считается «видимой» для расчёта привязки. Это полезно, когда часть контента перекрывается фиксированными элементами (шапка, подвал, тулбары).

```css
scroll-padding: [ auto | <length-percentage> ]{1,4};
```

Значения задаются аналогично `padding`. `auto` позволяет браузеру самостоятельно определить отступ (например, под фиксированную панель).

**Пример: контент с фиксированным тулбаром справа**

```html
<div class="container">
  <div class="toolbar">Панель инструментов</div>
  <div class="content">
    <section>...</section>
    <section>...</section>
    <section>...</section>
  </div>
</div>
```

```css
.container {
  position: relative;
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-padding: 0 200px 0 0; /* справа 200px под тулбар */
}

.toolbar {
  position: fixed;
  top: 0;
  right: 0;
  width: 200px;
  height: 100%;
  background: #eee;
}

.content section {
  height: 100vh;
  scroll-snap-align: start;   /* привязать к началу каждой секции */
}
```

Благодаря `scroll-padding` snapport смещается влево на 200px, и секции выравниваются относительно оставшейся области, не заходя под тулбар.

## Свойства для дочерних элементов (snap areas)

### 3. `scroll-margin`

Определяет внешние отступы для snap area, расширяя или сжимая область, участвующую в привязке. Отступы задаются как абсолютные длины и добавляются к границам элемента.

```css
scroll-margin: <length>{1,4};
```

**Пример: добавим немного воздуха между элементами**

Возьмём предыдущую галерею, но теперь хотим, чтобы при привязке между изображениями был небольшой зазор. Можно увеличить snap area:

```css
.gallery img {
  scroll-snap-align: center;
  scroll-margin: 0 20px;   /* добавить по 20px слева и справа */
}
```

В результате snap-позиция будет соответствовать не центру самого изображения, а центру расширенной области.

### 4. `scroll-snap-align`

Задаёт выравнивание snap area внутри snapport. Может принимать одно или два значения (для блочной и строчной осей соответственно).

```css
scroll-snap-align: [ none | start | end | center ]{1,2};
```

- `none` — элемент не создаёт snap-позиции.
- `start` — выравнивание по начальному краю (например, верх для вертикального скролла).
- `end` — по конечному краю.
- `center` — по центру.

Если указано одно значение, оно применяется к обеим осям.

**Пример: вертикальный лендинг с секциями на весь экран**

```html
<div class="slides">
  <section>Слайд 1</section>
  <section>Слайд 2</section>
  <section>Слайд 3</section>
</div>
```

```css
.slides {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

.slides section {
  height: 100vh;
  scroll-snap-align: start;   /* каждая секция приклеится к верхнему краю */
}
```

### 5. `scroll-snap-stop`

Управляет тем, можно ли «перепрыгнуть» через snap-позицию при быстрой прокрутке. Полезно, когда нужно остановиться на каждом элементе, не пропуская их.

```css
scroll-snap-stop: normal | always;
```

- `normal` — разрешено проскальзывать мимо (по умолчанию).
- `always` — запрещено проходить мимо; прокрутка остановится на первой же snap-позиции.

**Пример: пошаговая прокрутка**

```css
.strict-slides section {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

При таком подходе даже быстрое движение колесом мыши или свайп не позволит пропустить слайд — прокрутка остановится на каждом.

## Особые случаи и рекомендации

### Элементы больше области просмотра

Если snap area превышает размер snapport, браузер позволяет свободно прокручивать внутри такого элемента, пока он полностью не поместится. Принудительное выравнивание применяется только когда элемент снова становится меньше области просмотра.

Это важно для случаев, когда в секции много контента — пользователь может прокручивать её внутри, но при переходе к другой секции сработает привязка.

### Изменение контента (re-snapping)

Если содержимое динамически меняется (добавляются/удаляются элементы), браузер обязан пересчитать snap-позиции и, если контейнер был привязан к определённому элементу, остаться привязанным к нему (если он всё ещё существует). Это обеспечивает предсказуемое поведение в чатах, логах и лентах.

Пример с лог-консолью, которая всегда привязана к последнему сообщению:

```css
.log {
  scroll-snap-type: y proximity;
  align-content: end;
}

.log::after {
  content: "";
  display: block;
  scroll-snap-align: end;   /* псевдоэлемент в конце создаёт точку привязки */
}
```

### `mandatory` vs `proximity`

- Используйте `mandatory` только когда уверены, что все snap-позиции достижимы и контент не создаст «ловушек» (например, между элементами большие расстояния). Иначе пользователь может застрять на одном месте, не имея возможности прокрутить дальше.
- `proximity` более безопасен: он даёт плавность, но не гарантирует остановку на каждом элементе. Хорошо подходит для интерфейсов, где snapping — приятное дополнение, а не обязательное условие.

## Поддержка браузерами

Scroll Snap добавляен в инициативу [Interop 2026](https://wpt.fyi/interop-2026). Это для нас значит, что до конца года поддержка всему браузерами будет практически идеальной.

CSS Scroll Snap Level 1 поддерживается во всех современных браузерах (Chrome, Firefox, Safari, Edge) начиная с 2018–2019 годов. Для старых версий могут потребоваться префиксы, но сейчас они не обязательны. Рекомендуется всегда проверять актуальную информацию на [caniuse.com](https://caniuse.com/css-snappoints).

## Заключение

Спецификация CSS Scroll Snap Module Level 1 даёт веб-разработчикам мощный инструмент для создания удобных и предсказуемых интерфейсов с прокруткой. Она проста в освоении, но требует внимания к деталям (особенно при использовании `mandatory`). Комбинируя `scroll-snap-type`, `scroll-padding`, `scroll-margin`, `scroll-snap-align` и `scroll-snap-stop`, вы можете реализовать практически любой сценарий — от простой фотогалереи до сложного постраничного приложения.

Документация и актуальный статус спецификации доступны на [w3.org/TR/css-scroll-snap-1](https://www.w3.org/TR/css-scroll-snap-1/). Экспериментируйте и делайте прокрутку удобной!
