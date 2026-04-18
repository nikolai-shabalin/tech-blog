---
title: 'Scroll-driven Animations: Анимация, привязанная к прокрутке'
description: ''
pubDate: 'Apr 12 2026'
---

Анимации традиционно управляются временем: они запускаются, длятся заданное количество миллисекунд и заканчиваются. Но что, если нужно, чтобы прогресс анимации зависел не от времени, а от положения полосы прокрутки? Именно эту задачу решает спецификация **[Scroll-driven Animations](https://www.w3.org/TR/scroll-animations-1/)**.

Scroll-driven Animations позволяют привязать анимацию к прокрутке страницы или любого другого контейнера. Вместо `animation-duration` мы используем расстояние прокрутки: чем дальше прокручен контейнер, тем ближе анимация к своему завершению. Грубо говоря, если блок был прокручен на 50%, то анимация будет завершена на 50%.

Это открывает огромные возможности для создания интерактивных историй, параллакс‑эффектов, индикаторов чтения, анимаций появления при скролле и многого другого — всё это без единой строки JavaScript, только на CSS.

## Два типа временных шкал

Спецификация определяет два вида шкал, которые можно использовать для управления анимацией:

1. **[Scroll Progress Timeline](https://www.w3.org/TR/scroll-animations-1/#scroll-timelines)** — привязана к прогрессу прокрутки самого контейнера.
   0% — это начальное положение скролла, 100% — конечное.

2. **[View Progress Timeline](https://www.w3.org/TR/scroll-animations-1/#view-timelines)** — привязана к моменту, когда определённый элемент появляется в зоне видимости (вьюпорте) своего ближайшего скроллируемого предка.
   0% — момент, когда элемент только начинает показываться, 100% — когда он полностью скрывается при дальнейшей прокрутке. Пока может звучать сложно, но на практике всё просто. Дальше разберёмся на примерах.

Анимации, использующие эти шкалы, называются *scroll‑driven animations* (анимации, управляемые прокруткой).

## Способы объявления: анонимные и именованные шкалы

Связать анимацию со шкалой можно двумя способами:

- **Анонимно**, прямо в свойстве `animation-timeline` с помощью функций `scroll()` или `view()`.
- **Именованно**, сначала объявив шкалу у какого‑то элемента (с помощью свойств `scroll-timeline-*` или `view-timeline-*`), а затем сославшись на имя в `animation-timeline` у любого элемента в нужной области видимости.

Рассмотрим оба подхода на примерах.

## Scroll Progress Timeline — анимация, следующая за скроллом

Представим горизонтальную линию, которая заполняется по мере прокрутки страницы. Это классический индикатор чтения.

```html
<div class="scroll-container"> <!-- scroll container -->
  <div class="progress-bar"></div> <!-- progress bar -->
  <div class="content"> <!-- content -->
    <!-- много контента -->
    <p>Lorem ipsum ...</p>
  </div>
</div>
```

```css
/* Контейнер с горизонтальной прокруткой */
.scroll-container {
  overflow-x: auto;
}

.progress-bar {
  /* Фиксированная полоса прогресса над контентом */
  position: fixed;
  top: 0;
  left: 0;
  height: 10px;
  background-color: orange;
  transform-origin: left;

  /* Анимация заполнения полосы прогресса */
  animation: scaleProgress auto linear;
  /* привязка анимации к прогрессу прокрутки скролл-контейнера */
  animation-timeline: scroll();
}

/* Заполнение полосы прогресса от 0 до 100% по ширине */
@keyframes scaleProgress {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
```

<figure class="scroll-progress-demo">
  <figcaption>
    Прокрутите карточку вниз: индикатор сверху будет заполняться по мере скролла содержимого.
    <br>
    Обратите внимание, что 50% прокрутки это не середина контента, а середина полосы прогресса.
  </figcaption>

<div class="scroll-progress-demo__scroller">
  <div class="scroll-progress-demo__bar"></div>

  <div class="scroll-progress-demo__content">
    <p>
      Прокрутка этого блока напрямую управляет анимацией полосы прогресса сверху.
    </p>
    <p>
      Высота контента искусственно увеличена, чтобы было легче увидеть, как шкала заполняется от 0 до 100%.
    </p>
  </div>
</div>
</figure>

<style>
.scroll-progress-demo {
  margin: 24px 0 32px;
}

.scroll-progress-demo figcaption {
  margin-bottom: 12px;
  color: #4b5563;
  font-size: 0.95rem;
}

.scroll-progress-demo__scroller {
  overscroll-behavior: contain;
  max-height: 320px;
  overflow-y: auto;
  border: 1px solid #dbe4ff;
  border-radius: 18px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
  scroll-timeline-name: --scroll-progress-demo;
  scroll-timeline-axis: block;
}

.scroll-progress-demo__bar {
  position: sticky;
  top: 0;
  z-index: 1;
  height: 10px;
  width: 100%;
  transform: scaleX(0);
  transform-origin: left center;
  background: linear-gradient(90deg, #ef4444, #f97316 45%, #facc15);
  animation: scrollProgressDemoFill auto linear;
  animation-timeline: --scroll-progress-demo;
}

.scroll-progress-demo__content {
  height: 300vh;
  padding: 18px 20px 22px;
}

.scroll-progress-demo__content p {
  margin: 0 0 16px;
  line-height: 1.7;
}

.scroll-progress-demo__content p:last-child {
  margin-bottom: 0;
}

@keyframes scrollProgressDemoFill {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}
</style>

Объяснение:

- `animation: scaleProgress auto linear;` — длительность `auto` указывает, что анимация должна занимать весь доступный диапазон шкалы.
- `animation-timeline: scroll();` — используем анонимную шкалу прогресса прокрутки ближайшего скролл‑контейнера (в данном случае ближайшего родительского блока со скролом).
- По мере прокрутки страницы от самого верха до самого низа, значение `scaleX` меняется от 0 до 1, где 0 это крайний левый край блока, а 1 это крайний правый край блока.

### Параметры функции scroll()

Синтаксис `scroll()`:

```
scroll([<scroller> || <axis>]?)
```

У `scroll(  )` два необязательных аргумента: `<scroller>` (какой контейнер использовать) и `<axis>` (какую ось отслеживать).

- `<scroller>`:
  - `nearest` (по умолчанию) — ближайший скролл‑контейнер;
  - `root` — область просмотра документа;
  - `self` — сам элемент, если он является скролл‑контейнером.
- `<axis>`:
  - `block` (по умолчанию, направление блока) — ось, соответствующая направлению блока (зависит от writing mode);
  - `inline` — строчная ось;
  - `x` — горизонтальная ось;
  - `y` — вертикальная ось;

Пример использования горизонтальной прокрутки:

```css
.container {
  overflow-x: auto;
  animation-timeline: scroll(self x);
}
```

## Именованные Scroll Progress Timeline

Если нужно, чтобы несколько анимаций ссылались на одну и ту же шкалу, удобно дать ей имя с помощью свойства `scroll-timeline-name` (и опционально `scroll-timeline-axis` для оси).

```css
/* Контейнер с вертикальной прокруткой */
.scroller {
  overflow-y: auto;
  /* Имя шкалы */
  scroll-timeline-name: --my-scroll;
  /* Ось прокрутки */
  scroll-timeline-axis: y;
}

/* Три элемента, которые будут использовать одну и ту же шкалу */
/* Анимация заголовка */
.heading {
  animation: animationName auto linear;
  animation-timeline: --my-scroll;
}

/* Анимация полосы прогресса */
.progress-bar {
  animation: animationAnotherName auto linear;
  animation-timeline: --my-scroll;
}

/* Анимация карточки */
.card {
  animation: animationAnotherAnotherName auto linear;
  animation-timeline: --my-scroll;
}
```

<figure class="named-scroll-timeline-demo">
  <figcaption>
    Прокрутите контейнер ниже: все панели ниже используют одну и ту же именованную шкалу <code>--my-scroll</code>. При скроле увеличивается ширина полосы прогресса, размер текста в заголовке и анимации внутри карточек.
  </figcaption>

<div class="named-scroll-timeline-demo__scroller">
  <div class="named-scroll-timeline-demo__header">
    <p class="named-scroll-timeline-demo__label">Named Scroll Timeline</p>
    <h3 class="named-scroll-timeline-demo__title">Одна шкала, три разные анимации</h3>
    <div class="named-scroll-timeline-demo__track">
      <div class="named-scroll-timeline-demo__progress"></div>
    </div>
  </div>

  <div class="named-scroll-timeline-demo__panels">
    <section class="named-scroll-timeline-demo__panel">
      <div class="named-scroll-timeline-demo__copy">
        <strong>Вращение</strong>
        <p>Квадрат поворачивается по мере прокрутки, но использует ту же timeline, что и остальные элементы.</p>
      </div>
      <div class="named-scroll-timeline-demo__canvas">
        <div class="named-scroll-timeline-demo__shape named-scroll-timeline-demo__shape--spin"></div>
      </div>
    </section>
    <section class="named-scroll-timeline-demo__panel">
      <div class="named-scroll-timeline-demo__copy">
        <strong>Расширение</strong>
        <p>Во второй панели капсула растёт по ширине. Источник прогресса не меняется, меняется только keyframes.</p>
      </div>
      <div class="named-scroll-timeline-demo__canvas named-scroll-timeline-demo__canvas--wide">
        <div class="named-scroll-timeline-demo__shape named-scroll-timeline-demo__shape--grow"></div>
      </div>
    </section>
    <section class="named-scroll-timeline-demo__panel">
      <div class="named-scroll-timeline-demo__copy">
        <strong>Сужение</strong>
        <p>В третьей панели фигура сужается, хотя всё ещё привязана к той же самой именованной scroll timeline.</p>
      </div>
      <div class="named-scroll-timeline-demo__canvas named-scroll-timeline-demo__canvas--wide">
        <div class="named-scroll-timeline-demo__shape named-scroll-timeline-demo__shape--shrink"></div>
      </div>
    </section>
  </div>
</div>
</figure>

<style>
.named-scroll-timeline-demo {
  margin: 24px 0 32px;
}

.named-scroll-timeline-demo figcaption {
  margin-bottom: 12px;
  color: var(--gray);
  font-size: 0.95rem;
}

.named-scroll-timeline-demo__scroller {
  overscroll-behavior: contain;
  max-height: 520px;
  overflow-y: auto;
  border: 1px solid rgb(from var(--gray) r g b / 0.2);
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgb(from var(--accent) r g b / 0.14), transparent 28%),
    linear-gradient(180deg, var(--surface-color), var(--bg-color));
  scroll-timeline-name: --named-scroll-demo;
  scroll-timeline-axis: block;
}

.named-scroll-timeline-demo__header {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 20px 20px 18px;
  background: rgb(from var(--surface-color) r g b / 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgb(from var(--gray) r g b / 0.16);
}

.named-scroll-timeline-demo__label {
  margin: 0 0 8px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

.named-scroll-timeline-demo__title {
  margin: 0 0 14px;
  font-size: 1.5rem;
  line-height: 1.1;
  color: var(--black);
  transform-origin: left center;
  transform: translateY(18px) scale(0.94);
  animation: namedScrollTitle auto linear;
  animation-timeline: --named-scroll-demo;
}

.named-scroll-timeline-demo__track {
  overflow: hidden;
  height: 8px;
  border-radius: 999px;
  background: rgb(from var(--gray) r g b / 0.12);
}

.named-scroll-timeline-demo__progress {
  height: 100%;
  border-radius: inherit;
  transform: scaleX(0);
  transform-origin: left center;
  background: linear-gradient(90deg, var(--accent), var(--accent-dark));
  animation: namedScrollProgress auto linear;
  animation-timeline: --named-scroll-demo;
}

.named-scroll-timeline-demo__panels {
  min-height: 260vh;
  padding: 20px 20px 32px;
}

.named-scroll-timeline-demo__panel {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(220px, 0.9fr);
  gap: 18px;
  align-items: center;
  padding: 20px;
  border: 1px solid rgb(from var(--gray) r g b / 0.16);
  border-radius: 22px;
  background: rgb(from var(--surface-color) r g b / 0.9);
}

.named-scroll-timeline-demo__panel + .named-scroll-timeline-demo__panel {
  margin-top: 42vh;
}

.named-scroll-timeline-demo__copy strong {
  display: block;
  margin-bottom: 8px;
  color: var(--black);
  font-size: 1.05rem;
}

.named-scroll-timeline-demo__copy p {
  margin: 0;
  color: var(--gray-dark);
  line-height: 1.6;
}

.named-scroll-timeline-demo__canvas {
  display: grid;
  place-items: center;
  min-height: 170px;
  padding: 16px;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgb(from var(--gray-light) r g b / 0.5), rgb(from var(--gray) r g b / 0.05));
  border: 1px solid rgb(from var(--gray) r g b / 0.14);
}

.named-scroll-timeline-demo__canvas--wide {
  overflow: hidden;
}

.named-scroll-timeline-demo__shape {
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  box-shadow: 0 16px 28px rgb(from var(--accent) r g b / 0.18);
}

.named-scroll-timeline-demo__shape--spin {
  width: 92px;
  aspect-ratio: 1;
  border-radius: 22px;
  transform: rotate(0deg);
  animation: namedScrollSpin auto linear;
  animation-timeline: --named-scroll-demo;
}

.named-scroll-timeline-demo__shape--grow,
.named-scroll-timeline-demo__shape--shrink {
  width: 180px;
  height: 34px;
  border-radius: 999px;
  transform-origin: center center;
}

.named-scroll-timeline-demo__shape--grow {
  transform: scaleX(0.45);
  animation: namedScrollGrow auto linear;
  animation-timeline: --named-scroll-demo;
}

.named-scroll-timeline-demo__shape--shrink {
  transform: scaleX(1.25);
  animation: namedScrollShrink auto linear;
  animation-timeline: --named-scroll-demo;
}

@keyframes namedScrollProgress {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}

@keyframes namedScrollTitle {
  from {
    color: var(--gray-dark);
    letter-spacing: -0.03em;
    transform: translateY(18px) scale(0.94);
  }

  to {
    color: var(--black);
    letter-spacing: -0.01em;
    transform: translateY(0) scale(1);
  }
}

@keyframes namedScrollSpin {
  from {
    transform: rotate(0deg);
    border-radius: 22px;
  }

  to {
    transform: rotate(360deg);
    border-radius: 8px;
  }
}

@keyframes namedScrollGrow {
  from {
    transform: scaleX(0.45);
  }

  to {
    transform: scaleX(1.2);
  }
}

@keyframes namedScrollShrink {
  from {
    transform: scaleX(1.25);
  }

  to {
    transform: scaleX(0.45);
  }
}

@media (max-width: 720px) {
  .named-scroll-timeline-demo__panel {
    grid-template-columns: 1fr;
  }

  .named-scroll-timeline-demo__panel + .named-scroll-timeline-demo__panel {
    margin-top: 28vh;
  }
}
</style>

Имя шкалы должно начинаться с двух дефисов (`--`), чтобы не конфликтовать со стандартными ключевыми словами CSS.

Область видимости именованной шкалы — это элемент, на котором она объявлена, и все его потомки. С помощью свойства `timeline-scope` можно расширить область видимости на предков или другие элементы.

> 💡
> Я рекомендую использовать именованные шкалы, так как это повышает читаемость кода и позволяет легко определить с какой шкалой связана анимация. Если анимация происходит на главной шкале сайта, то использовать `animation-timeline: scroll(root y);` - также точно указывая с какой шкалой связана анимация.

Подведём промежуточный итог: у сайта или элемента может быть прокрутка, у прокрутки есть шкала на которую можно привязать анимацию. Шкалу по умолчанию анонимная, но её можно именовать. К любой шкале можно привязать сколько угодно анимаций вне зависимости от того, именованная она или анонимная. Приоритетнее всего использовать именованные шкалы, так как это повышает читаемость кода и позволяет легко определить с какой шкалой связана анимация.


## View Progress Timeline — анимация появления элемента при скролле

Этот тип шкалы часто используется для анимации элементов, когда они входят во вьюпорт или выходят из него. Давайте рассмотрим пример анимации появления карточки при прокрутке.

```html
<div class="view-demo__scroller"> <!-- scroll container -->
  <div class="view-demo__card">Карточка 1</div>
  <div class="view-demo__card">Карточка 2</div>
  <div class="view-demo__card">Карточка 3</div>
</div>
```

```css
.view-demo__scroller {
  overflow-y: auto;
}

.view-demo__card {
  animation-timeline: view();
  /* у карточки по умолчанию белая обводка */
  border: 3px dashed rgb(from **white** r g b / 1);
}

@keyframes appear {
  /* от непрозрачной **синей** обводки */
  from {
    border-color: rgb(from blue r g b / 1);
  }
  /* до прозрачной **синей** обводки */
  to {
    border-color: rgb(from blue r g b / 0);
  }
}
```

<figure class="view-progress-demo">
  <figcaption>
    Прокрутите контейнер: центральная рамка показывает активную область <code>view()</code>, ту которую видит пользователь. Полупрозрачные зоны сверху и снизу показывают, что карточки продолжают двигаться дальше, но уже вне этой области.
  </figcaption>

<div class="view-progress-demo__stage dark-theme">
  <div class="view-progress-demo__scroller">
    <div class="view-progress-demo__stack">
      <div class="view-progress-demo__card">Карточка 1</div>
      <div class="view-progress-demo__card">Карточка 2</div>
      <div class="view-progress-demo__card">Карточка 3</div>
    </div>
  </div>

  <div class="view-progress-demo__shade view-progress-demo__shade--top" aria-hidden="true">
    <span>Вне view()</span>
  </div>

  <div class="view-progress-demo__shade view-progress-demo__shade--bottom" aria-hidden="true">
    <span>Вне view()</span>
  </div>

  <div class="view-progress-demo__active-zone" aria-hidden="true">
    <span>Активная зона view()</span>
  </div>
</div>
</figure>

<style>
.view-progress-demo {
  margin: 24px 0 32px;
}

.view-progress-demo figcaption {
  margin-bottom: 12px;
  color: var(--gray);
  font-size: 0.95rem;
}

.view-progress-demo__stage {
  position: relative;
  isolation: isolate;
  border: 1px solid rgb(from var(--gray) r g b / 0.2);
  border-radius: 24px;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgb(from var(--accent) r g b / 0.12), transparent 30%),
    linear-gradient(180deg, var(--surface-color), rgb(from var(--gray-light) r g b / 0.35));
}

.view-progress-demo__scroller {
  overscroll-behavior: contain;
  height: 420px;
  overflow-y: auto;
  padding: 24px;
}

.view-progress-demo__stack {
  display: grid;
  gap: 18px;
  padding-block: 42vh;
  padding-inline: 40px;
}

.view-progress-demo__card {
  padding: 24px 22px;
  border-radius: 20px;
  border: 3px dashed rgb(from white r g b / 1);
  background: rgb(from var(--surface-color) r g b / 1);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--black);
  animation: viewProgressAppear auto linear;
  animation-timeline: view(block 22%);
  width: 100%;
}

.view-progress-demo__shade {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 3;
  height: 22%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgb(from var(--black) r g b / 0.55);
  backdrop-filter: blur(1.5px);
}

.view-progress-demo__shade span {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgb(from var(--black) r g b / 0.15);
  background: rgb(from var(--surface-color) r g b / 0.66);
}

.view-progress-demo__shade--top {
  top: 0;
  border-bottom: 1px dashed rgb(from var(--black) r g b / 0.18);
  background: linear-gradient(180deg, rgb(from var(--surface-color) r g b / 0.86), rgb(from var(--surface-color) r g b / 0.2));
}

.view-progress-demo__shade--bottom {
  bottom: 0;
  border-top: 1px dashed rgb(from var(--black) r g b / 0.18);
  background: linear-gradient(0deg, rgb(from var(--surface-color) r g b / 0.86), rgb(from var(--surface-color) r g b / 0.2));
}

.view-progress-demo__active-zone {
  position: absolute;
  left: 0;
  right: 0;
  top: 22%;
  bottom: 22%;
  z-index: 2;
  border: 2px dashed rgb(from var(--accent) r g b / 0.7);
  pointer-events: none;
}

.view-progress-demo__active-zone span {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgb(from var(--accent) r g b / 0.35);
  background: rgb(from var(--surface-color) r g b / 0.85);
  color: rgb(from var(--black) r g b / 0.8);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

@media (max-width: 720px) {
  .view-progress-demo__scroller {
    height: 360px;
    padding: 16px;
  }

  .view-progress-demo__stack {
    padding-block: 36vh;
    padding-inline: 8px;
  }

  .view-progress-demo__active-zone {
    left: 10px;
    right: 10px;
  }

  .view-progress-demo__shade span,
  .view-progress-demo__active-zone span {
    font-size: 0.68rem;
  }
}

@keyframes viewProgressAppear {
  from {
    border-color: rgb(from var(--accent) r g b / 1);
  }

  to {
    border-color: rgb(from var(--accent) r g b / 0);
  }
}
</style>

Полупрозрачные зоны сверху и снизу специально показывают участок контейнера, который исключён из активной области. Сделаны они исключительно для наглядности, чтобы было понятно, что карточки продолжают движение под этими слоями, но прогресс `view()` в них уже другой.

Шкала начинается, когда элемент пересекает границу активную границу `view()` этой области, и заканчивается, когда он полностью выходит за противоположную границу.

Алгоритм работы шкалы:
1. Элемент находится вне активной границы `view()`. Цвет обводки белый, по умолчанию указанный у `.view-demo__card`.
2. Элемент пересекает границу активной границу `view()` этой области. Цвет обводки меняется на цветной. Из-за анимации `viewProgressAppear`.
    ```css
    @keyframes viewProgressAppear {
      from {
        border-color: rgb(from var(--accent) r g b / 1);
      }
    }
    ```
3. Элемент находится внутри активной границы `view()`. Цвет обводки постепенно становится прозрачным по мере прокрутки.
4. Элемент почти полностью выходит за противоположную границу. Цвет обводки становится прозрачным из-за анимации `viewProgressAppear`.
    ```css
    @keyframes viewProgressAppear {
      to {
        border-color: rgb(from var(--accent) r g b / 0);
      }
    }
    ```
5. Шкала для элемента заканчивается. Элемент снова становится с белой обводкой.

Этот алгоритм работает для каждого элемента в контейнере по очереди.

### Уточнение диапазона: inset и ось

Синтаксис `view()`:

```
view([<axis> || <view-timeline-inset>]?)
```

если с `axis` уже всё понятно - это ось, по которой будет считаться прогресс, то с `view-timeline-inset` немного сложнее. `view-timeline-inset` позволяют сдвигать область, считающуюся «видимой».

```css
.card {
  animation-timeline: view(block 10%);
}
```

<figure class="view-inset-demo">
  <figcaption>
    Этот пример повторяет демо выше. Линиями отмечены дополнительные <code>10%</code> от верхней и нижней границы, с которых визуально показывается старт анимации.
  </figcaption>

<div class="view-inset-demo__stage dark-theme">
  <div class="view-inset-demo__scroller">
    <div class="view-inset-demo__stack">
      <div class="view-inset-demo__card">Карточка 1</div>
      <div class="view-inset-demo__card">Карточка 2</div>
      <div class="view-inset-demo__card">Карточка 3</div>
    </div>
  </div>

  <div class="view-inset-demo__shade view-inset-demo__shade--top" aria-hidden="true">
    <span>Вне view()</span>
  </div>

  <div class="view-inset-demo__shade view-inset-demo__shade--bottom" aria-hidden="true">
    <span>Вне view()</span>
  </div>

  <div class="view-inset-demo__active-zone" aria-hidden="true">
    <span>Активная зона view()</span>
  </div>

  <div class="view-inset-demo__guide view-inset-demo__guide--top" aria-hidden="true">
    <span>10%</span>
  </div>

  <div class="view-inset-demo__guide view-inset-demo__guide--bottom" aria-hidden="true">
    <span>10%</span>
  </div>
</div>
</figure>

<style>
.view-inset-demo {
  margin: 20px 0 32px;
}

.view-inset-demo figcaption {
  margin-bottom: 12px;
  color: var(--gray);
  font-size: 0.95rem;
}

.view-inset-demo__stage {
  position: relative;
  isolation: isolate;
  border: 1px solid rgb(from var(--gray) r g b / 0.2);
  border-radius: 24px;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgb(from var(--accent) r g b / 0.1), transparent 35%),
    linear-gradient(180deg, var(--surface-color), rgb(from var(--gray-light) r g b / 0.35));
}

.view-inset-demo__scroller {
  overscroll-behavior: contain;
  height: 520px;
  overflow-y: auto;
  padding: 24px;
}

.view-inset-demo__stack {
  display: grid;
  gap: 18px;
  padding-block: 52vh;
  padding-inline: 40px;
}

.view-inset-demo__card {
  padding: 24px 22px;
  border-radius: 20px;
  border: 3px dashed rgb(from white r g b / 1);
  background: rgb(from var(--surface-color) r g b / 1);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--black);
  animation: viewInsetAppear auto linear;
  animation-timeline: view(block 32%);
  width: 100%;
}

.view-inset-demo__shade {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 3;
  height: 22%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgb(from var(--black) r g b / 0.55);
  backdrop-filter: blur(1.5px);
}

.view-inset-demo__shade span {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgb(from var(--black) r g b / 0.15);
  background: rgb(from var(--surface-color) r g b / 0.66);
}

.view-inset-demo__shade--top {
  top: 0;
  border-bottom: 1px dashed rgb(from var(--black) r g b / 0.18);
  background: linear-gradient(180deg, rgb(from var(--surface-color) r g b / 0.86), rgb(from var(--surface-color) r g b / 0.2));
}

.view-inset-demo__shade--bottom {
  bottom: 0;
  border-top: 1px dashed rgb(from var(--black) r g b / 0.18);
  background: linear-gradient(0deg, rgb(from var(--surface-color) r g b / 0.86), rgb(from var(--surface-color) r g b / 0.2));
}

.view-inset-demo__active-zone {
  position: absolute;
  left: 0;
  right: 0;
  top: 22%;
  bottom: 22%;
  z-index: 2;
  border: 2px dashed rgb(from var(--accent) r g b / 0.72);
  pointer-events: none;
}

.view-inset-demo__active-zone span {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgb(from var(--accent) r g b / 0.35);
  background: rgb(from var(--surface-color) r g b / 0.85);
  color: rgb(from var(--black) r g b / 0.8);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.view-inset-demo__guide {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 5;
  border-top: 2px dashed rgb(from white r g b / 0.9);
  pointer-events: none;
}

.view-inset-demo__guide span {
  position: absolute;
  right: 12px;
  top: -12px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgb(from white r g b / 0.55);
  background: rgb(from var(--black) r g b / 0.5);
  color: rgb(from white r g b / 0.95);
  font-size: 0.72rem;
  font-weight: 700;
}

.view-inset-demo__guide--top {
  top: 32%;
}

.view-inset-demo__guide--bottom {
  bottom: 32%;
}

@media (max-width: 720px) {
  .view-inset-demo__scroller {
    height: 420px;
    padding: 16px;
  }

  .view-inset-demo__stack {
    padding-block: 44vh;
    padding-inline: 8px;
  }

  .view-inset-demo__active-zone {
    left: 10px;
    right: 10px;
  }

  .view-inset-demo__shade span,
  .view-inset-demo__active-zone span,
  .view-inset-demo__guide span {
    font-size: 0.68rem;
  }
}

@keyframes viewInsetAppear {
  from {
    border-color: rgb(from var(--accent) r g b / 1);
  }

  to {
    border-color: rgb(from var(--accent) r g b / 0);
  }
}
</style>

Линии <code>10%</code> показывают дополнительный сдвиг границ для запуска анимации.

Алгоритм работы шкалы здесь **не меняется** относительно предыдущего примера — меняются только точки старта и конца анимации (они сдвинуты внутрь области `view()`).

Алгоритм работы шкалы:
1. Элемент находится вне активной границы `view()`. Цвет обводки белый, по умолчанию указанный у `.view-inset-demo__card`.
2. Элемент пересекает стартовую границу активной области. Ничего не меняется
3. Элемент пересекает смещённую стартовую границу активной области 10%. Цвет обводки становится синим из-за `viewInsetAppear`.
    ```css
    @keyframes viewInsetAppear {
      from {
        border-color: rgb(from var(--accent) r g b / 1);
      }
    }
    ```
3. Элемент находится внутри активной области. Цвет обводки постепенно становится прозрачным по мере прокрутки. Из-за того, что активная зона сузилась из-за смещения по 10% сверху и снизу - прозрачность элемента становится быстрее.
4. Элемент пересекает смещённую противоположную границу активной области 10%. Цвет обводки становится прозрачным из-за `viewInsetAppear`.
    ```css
    @keyframes viewInsetAppear {
      to {
        border-color: rgb(from var(--accent) r g b / 0);
      }
    }
    ```
5. Элемент полностью пересёк противоположную границу 10% активной области. Цвет обводки становится белым.
6. Шкала для элемента заканчивается. Элемент продолжает отображаться с белой обводкой.

Итог: поведение анимации то же самое, просто `inset` отодвигает момент её начала и завершения.


### Именованные View Progress Timeline

Аналогично "скролловым" шкалам, можно объявить именованную шкалу с помощью свойств `view-timeline-name`.

```css
.wrapper {
  view-timeline-name: --card-view;
}

.element {
  animation-timeline: --card-view;
}
```

Полной записью View Progress Timeline является:

```css
.wrapper {
  view-timeline-name: --card-view;
  view-timeline-axis: block;
  view-timeline-inset: 10%;
}

.element {
  animation-timeline: --card-view;
}
```

> 💡
> Я всё ещё рекомендую отдавать приоритет именованным шкалам.

## Управление диапазоном: animation-range

Иногда нужно, чтобы анимация происходила не на всём протяжении шкалы, а только в её определённой части. Например, элемент появляется только в первой половине своего вхождения во вьюпорт, а затем уже не меняется. Для этого существует свойство `animation-range` (а также его составляющие `animation-range-start` и `animation-range-end`).

### Именованные диапазоны View Progress Timeline

Для View Progress Timeline определены стандартные именованные отрезки:

- `cover` — полный диапазон от первого появления элемента до полного исчезновения.

<figure class="view-progress-demo">
  <figcaption>
    Прокрутите контейнер: центральная рамка показывает активную область <code>view()</code>, ту которую видит пользователь. Полупрозрачные зоны сверху и снизу показывают, что карточки продолжают двигаться дальше, но уже вне этой области.
  </figcaption>

<div class="view-progress-demo__stage dark-theme">
  <div class="view-progress-demo__scroller">
    <div class="view-progress-demo__stack">
      <div class="view-progress-demo__card">Карточка 1</div>
    </div>
  </div>

  <div class="view-progress-demo__shade view-progress-demo__shade--top" aria-hidden="true">
    <span>Вне view()</span>
  </div>

  <div class="view-progress-demo__shade view-progress-demo__shade--bottom" aria-hidden="true">
    <span>Вне view()</span>
  </div>

  <div class="view-progress-demo__active-zone" aria-hidden="true">
    <span>Активная зона view()</span>
  </div>
</div>
</figure>

<style>
.view-progress-demo {
  margin: 24px 0 32px;
}

.view-progress-demo figcaption {
  margin-bottom: 12px;
  color: var(--gray);
  font-size: 0.95rem;
}

.view-progress-demo__stage {
  position: relative;
  isolation: isolate;
  border: 1px solid rgb(from var(--gray) r g b / 0.2);
  border-radius: 24px;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgb(from var(--accent) r g b / 0.12), transparent 30%),
    linear-gradient(180deg, var(--surface-color), rgb(from var(--gray-light) r g b / 0.35));
}

.view-progress-demo__scroller {
  overscroll-behavior: contain;
  height: 420px;
  overflow-y: auto;
  padding: 24px;
}

.view-progress-demo__stack {
  display: grid;
  gap: 18px;
  padding-block: 42vh;
  padding-inline: 40px;
}

.view-progress-demo__card {
  padding: 24px 22px;
  border-radius: 20px;
  border: 3px dashed rgb(from white r g b / 1);
  background: rgb(from var(--surface-color) r g b / 1);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--black);
  animation: viewProgressAppear auto linear;
  animation-timeline: view(block 22%);
  width: 100%;
}

.view-progress-demo__shade {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 3;
  height: 22%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgb(from var(--black) r g b / 0.55);
  backdrop-filter: blur(1.5px);
}

.view-progress-demo__shade span {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgb(from var(--black) r g b / 0.15);
  background: rgb(from var(--surface-color) r g b / 0.66);
}

.view-progress-demo__shade--top {
  top: 0;
  border-bottom: 1px dashed rgb(from var(--black) r g b / 0.18);
  background: linear-gradient(180deg, rgb(from var(--surface-color) r g b / 0.86), rgb(from var(--surface-color) r g b / 0.2));
}

.view-progress-demo__shade--bottom {
  bottom: 0;
  border-top: 1px dashed rgb(from var(--black) r g b / 0.18);
  background: linear-gradient(0deg, rgb(from var(--surface-color) r g b / 0.86), rgb(from var(--surface-color) r g b / 0.2));
}

.view-progress-demo__active-zone {
  position: absolute;
  left: 0;
  right: 0;
  top: 22%;
  bottom: 22%;
  z-index: 2;
  border: 2px dashed rgb(from var(--accent) r g b / 0.7);
  pointer-events: none;
}

.view-progress-demo__active-zone span {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgb(from var(--accent) r g b / 0.35);
  background: rgb(from var(--surface-color) r g b / 0.85);
  color: rgb(from var(--black) r g b / 0.8);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

@media (max-width: 720px) {
  .view-progress-demo__scroller {
    height: 360px;
    padding: 16px;
  }

  .view-progress-demo__stack {
    padding-block: 36vh;
    padding-inline: 8px;
  }

  .view-progress-demo__active-zone {
    left: 10px;
    right: 10px;
  }

  .view-progress-demo__shade span,
  .view-progress-demo__active-zone span {
    font-size: 0.68rem;
  }
}

@keyframes viewProgressAppear {
  from {
    border-color: rgb(from var(--accent) r g b / 1);
  }

  to {
    border-color: rgb(from var(--accent) r g b / 1);
  }
}
</style>


- `contain` — диапазон, когда элемент полностью находится внутри вьюпорта.

<figure class="view-progress-demo">
  <figcaption>
    Прокрутите контейнер: центральная рамка показывает активную область <code>view()</code>, ту которую видит пользователь. Полупрозрачные зоны сверху и снизу показывают, что карточки продолжают двигаться дальше, но уже вне этой области.
  </figcaption>

<div class="view-progress-demo__stage dark-theme">
  <div class="view-progress-demo__scroller">
    <div class="view-progress-demo__stack">
      <div class="view-progress-demo__card">Карточка 1</div>
    </div>
  </div>

  <div class="view-progress-demo__shade view-progress-demo__shade--top" aria-hidden="true">
    <span>Вне view()</span>
  </div>

  <div class="view-progress-demo__shade view-progress-demo__shade--bottom" aria-hidden="true">
    <span>Вне view()</span>
  </div>

  <div class="view-progress-demo__active-zone" aria-hidden="true">
    <span>Активная зона view()</span>
  </div>
</div>
</figure>

<style>
.view-progress-demo {
  margin: 24px 0 32px;
}

.view-progress-demo figcaption {
  margin-bottom: 12px;
  color: var(--gray);
  font-size: 0.95rem;
}

.view-progress-demo__stage {
  position: relative;
  isolation: isolate;
  border: 1px solid rgb(from var(--gray) r g b / 0.2);
  border-radius: 24px;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgb(from var(--accent) r g b / 0.12), transparent 30%),
    linear-gradient(180deg, var(--surface-color), rgb(from var(--gray-light) r g b / 0.35));
}

.view-progress-demo__scroller {
  overscroll-behavior: contain;
  height: 420px;
  overflow-y: auto;
  padding: 24px;
}

.view-progress-demo__stack {
  display: grid;
  gap: 18px;
  padding-block: 42vh;
  padding-inline: 40px;
}

.view-progress-demo__card {
  padding: 24px 22px;
  border-radius: 20px;
  border: 3px dashed rgb(from white r g b / 1);
  background: rgb(from var(--surface-color) r g b / 1);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--black);
  animation: viewProgressAppear auto linear;
  animation-timeline: view(block 42%);
  width: 100%;
}

.view-progress-demo__shade {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 3;
  height: 22%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgb(from var(--black) r g b / 0.55);
  backdrop-filter: blur(1.5px);
}

.view-progress-demo__shade span {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgb(from var(--black) r g b / 0.15);
  background: rgb(from var(--surface-color) r g b / 0.66);
}

.view-progress-demo__shade--top {
  top: 0;
  border-bottom: 1px dashed rgb(from var(--black) r g b / 0.18);
  background: linear-gradient(180deg, rgb(from var(--surface-color) r g b / 0.86), rgb(from var(--surface-color) r g b / 0.2));
}

.view-progress-demo__shade--bottom {
  bottom: 0;
  border-top: 1px dashed rgb(from var(--black) r g b / 0.18);
  background: linear-gradient(0deg, rgb(from var(--surface-color) r g b / 0.86), rgb(from var(--surface-color) r g b / 0.2));
}

.view-progress-demo__active-zone {
  position: absolute;
  left: 0;
  right: 0;
  top: 22%;
  bottom: 22%;
  z-index: 2;
  border: 2px dashed rgb(from var(--accent) r g b / 0.7);
  pointer-events: none;
}

.view-progress-demo__active-zone span {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 3px 10px;
  border-radius: 999px;
  border: 1px solid rgb(from var(--accent) r g b / 0.35);
  background: rgb(from var(--surface-color) r g b / 0.85);
  color: rgb(from var(--black) r g b / 0.8);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.03em;
}

@media (max-width: 720px) {
  .view-progress-demo__scroller {
    height: 360px;
    padding: 16px;
  }

  .view-progress-demo__stack {
    padding-block: 36vh;
    padding-inline: 8px;
  }

  .view-progress-demo__active-zone {
    left: 10px;
    right: 10px;
  }

  .view-progress-demo__shade span,
  .view-progress-demo__active-zone span {
    font-size: 0.68rem;
  }
}

@keyframes viewProgressAppear {
  from {
    border-color: rgb(from var(--accent) r g b / 1);
  }

  to {
    border-color: rgb(from var(--accent) r g b / 1);
  }
}
</style>
- `entry` — диапазон входа элемента (от 0% `cover` до 0% `contain`).
- `exit` — диапазон выхода (от 100% `contain` до 100% `cover`).
- `entry-crossing` — когда элемент пересекает начальную (или конечную) границу вьюпорта.
- `exit-crossing` — аналогично при выходе.

Эти диапазоны можно указывать в `animation-range` и в ключевых кадрах `@keyframes`.

```css
.card {
  animation: fade auto linear;
  animation-timeline: view();
  animation-range: entry 0% entry 50%;
}

@keyframes fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

Здесь анимация будет проигрываться только на первой половине диапазона `entry`.

### Использование в ключевых кадрах

Ключевые кадры тоже можно привязывать к именованным диапазонам:

```css
@keyframes slide {
  entry 0% { opacity: 0; transform: translateX(-100%); }
  entry 100% { opacity: 1; transform: translateX(0); }
  exit 0% { opacity: 1; transform: translateX(0); }
  exit 100% { opacity: 0; transform: translateX(100%); }
}
```

Теперь анимация будет менять свойства по‑разному при входе и выходе элемента.

## Поддержка браузерами и будущее

На момент написания (начало 2026 года) Scroll-driven Animations поддерживаются в современных браузерах: Chrome, Edge, Opera, Safari (с 2024 года), Firefox (с 2025 года).
