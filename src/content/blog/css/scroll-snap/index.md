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
- Именно этот контейнер потом «ловит» snap-позиции, о которых узнаете чуть позже.

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
`scrollport` — это **видимая область `scroll container`**, то есть та часть контейнера, через которую пользователь видит прокручиваемый контент.

**Основные свойства:**

* это «окно» (viewport) внутри контейнера;
* показывает только часть содержимого, остальное находится за пределами и доступно через прокрутку;
* используется как базовая область для расчётов прокрутки и snap.

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
CSS-свойство `scroll-padding` задаёт *внутренние смещения* для `scrollport` и тем самым определяет **optimal viewing region** — область, в которую браузер старается приводить целевые элементы.

Свойство не меняет layout, но меняет геометрию целевой области для прокрутки. Это значит, что слайды внутри слайдера никак не изменят свои размеры из-за указанного `scroll-padding`.

**Основные механизмы `scroll-padding`:**
- задаёт отступы внутрь `scrollport` и «сужает» рабочую область навигации;
- в snap-контейнере эта область становится `snapport`;
- проценты считаются от размеров `scrollport`;
- значение `auto` оставляет расчёт браузеру (обычно эквивалентно `0px`).

<div class="ssx-demo ssx-padding-demo">
  <div class="ssx-slider-demo ssx-padding-demo__scroller">
    <div class="ssx-cards">
      <div class="ssx-card">1</div>
      <div class="ssx-card">2</div>
      <div class="ssx-card">3</div>
      <div class="ssx-card">4</div>
    </div>
  </div>
  <div class="ssx-overlay ssx-overlay--scrollport">scrollport</div>
  <div class="ssx-overlay ssx-overlay--padding">область после scroll-padding</div>
</div>

### 4) `snapport`

`snapport` — это рабочая область внутри `scrollport`, которая получается после применения `scroll-padding`.

Формула для понимания: `snapport = scrollport - scroll-padding`. В третьем примере, который чуть выше, мы получили область "область после scroll-padding" - это и есть `snapport`.
Без `scroll-padding`: `snapport = scrollport`

**Основные механизмы `snapport`:**
- размер и положение `snapport` напрямую зависят от `scroll-padding`.

**Про эти механизмы чуть ниже:**
- используется как опорная область для `scroll-snap-align`;
- именно относительно `snapport` браузер вычисляет snap positions;


<div class="ssx-demo ssx-snapport-demo">
  <div class="ssx-slider-demo ssx-snapport-demo__scroller">
    <div class="ssx-cards">
      <div class="ssx-card">1</div>
      <div class="ssx-card">2</div>
      <div class="ssx-card">3</div>
    </div>
  </div>
  <div class="ssx-overlay ssx-overlay--scrollport">scrollport</div>
  <div class="ssx-overlay ssx-overlay--snapport">snapport</div>
</div>

### 5) Сторона элемента: `scroll snap area`
Теперь перейдём к элементам.  `scroll snap area` — область элемента, которую браузер использует для snap-выравнивания.

`scroll snap area = border box элемента`

**Основные механизмы `scroll snap area`:**
- базой всегда является `border box` элемента;
- именно эта область участвует в вычислении `snap position`;
- итоговое выравнивание зависит от пары: `scroll snap area` + `snapport`.

<div class="ssx-demo ssx-snap-area-demo">
  <div class="ssx-slider-demo ssx-snap-area-demo__scroller">
    <div class="ssx-cards">
      <div class="ssx-card">1</div>
      <div class="ssx-card ssx-card--snap-area">2</div>
      <div class="ssx-card">3</div>
    </div>
  </div>
</div>

### 6) Подпункт: `scroll-margin`

`scroll-margin` расширяет snap area наружу и влияет на расчёт snap/scrollTo/якорей.

`snap area = border box элемента + scroll-margin`

То есть `scroll-margin` не меняет размер самого элемента в layout, а только расширяет область, которую браузер использует для snap-выравнивания.

<div class="ssx-margin-grid">
  <div class="ssx-demo ssx-area-demo">
    <div class="ssx-area-item ssx-area-item--plain">
      <span class="ssx-area-item-label">без scroll-margin</span>
      <span class="ssx-area-outset-label">без outsets</span>
    </div>
  </div>
  <div class="ssx-demo ssx-area-demo">
    <div class="ssx-area-item">
      <span class="ssx-area-item-label">с scroll-margin</span>
      <span class="ssx-area-outset-label">outset от scroll-margin</span>
    </div>
  </div>
</div>

Итоговый пример (`scroll-margin: 20px 0` у активного слайда):

<div class="ssx-demo ssx-margin-slider-demo">
  <div class="ssx-slider-demo ssx-margin-slider-demo__scroller">
    <div class="ssx-cards">
      <div class="ssx-card">1</div>
      <div class="ssx-card ssx-card--with-margin">2</div>
      <div class="ssx-card">3</div>
    </div>
  </div>
</div>

### 7) Правило выравнивания: `scroll-snap-align`
До этого пункта мы поняли, что у нас есть область прокрутки с возможностью изменить размер этой области. Также у нас есть элементы прокрутки с размерами, которые можно изменить. Перейдём к выравниванию.

`scroll-snap-align` задаёт, как выровнять `snap area` элемента относительно `snapport`: `start`, `center`, `end`.
Для наглядности ниже использую неофициальный термин `snap-line`.

<div class="ssx-align-grid">
  <div class="ssx-align ssx-align--start">
    <span class="ssx-align-title">start ↔ start</span>
    <span class="ssx-align-port-label">snapport</span>
    <span class="ssx-align-line-label">snap-line</span>
    <span class="ssx-align-boundary ssx-align-boundary--start">start boundary</span>
    <span class="ssx-align-boundary ssx-align-boundary--end">end boundary</span>
    <div class="ssx-align-slide"></div>
  </div>
  <div class="ssx-align ssx-align--center">
    <span class="ssx-align-title">center ↔ center</span>
    <span class="ssx-align-port-label">snapport</span>
    <span class="ssx-align-line-label">snap-line</span>
    <span class="ssx-align-boundary ssx-align-boundary--start">start boundary</span>
    <span class="ssx-align-boundary ssx-align-boundary--end">end boundary</span>
    <div class="ssx-align-slide"></div>
  </div>
  <div class="ssx-align ssx-align--end">
    <span class="ssx-align-title">end ↔ end</span>
    <span class="ssx-align-port-label">snapport</span>
    <span class="ssx-align-line-label">snap-line</span>
    <span class="ssx-align-boundary ssx-align-boundary--start">start boundary</span>
    <span class="ssx-align-boundary ssx-align-boundary--end">end boundary</span>
    <div class="ssx-align-slide"></div>
  </div>
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

.ssx-padding-demo__scroller {
  scroll-padding: 56px 0 0;
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

.ssx-overlay--padding {
  top: 68px;
  right: 12px;
  bottom: 12px;
  left: 12px;
  border: 2px dashed #dc2626;
  color: #b91c1c;
  background: rgba(254, 226, 226, .22);
  z-index: 6;
}

.ssx-overlay--padding::before {
  content: "scroll-padding-top: 56px";
  position: absolute;
  top: -56px;
  left: -2px;
  right: -2px;
  height: 56px;
  border: 2px dotted #f97316;
  border-bottom: 0;
  border-radius: 8px 8px 0 0;
  background: rgba(254, 215, 170, .24);
  color: #9a3412;
  font-size: 10px;
  display: grid;
  place-items: center;
}

.ssx-snapport-demo__scroller {
  scroll-padding: 56px 0 0;
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
  top: 68px;
  bottom: 12px;
  left: 12px;
  right: 12px;
  border: 2px dashed #dc2626;
  color: #b91c1c;
  background: rgba(254, 226, 226, .18);
  z-index: 6;
}

.ssx-snapport-demo .ssx-overlay--scrollport {
  place-items: start center;
  padding-top: 30px;
}

.ssx-card--snap-area {
  position: relative;
  background: #fde68a;
  border: 2px solid #d97706;
}

.ssx-card--snap-area::after {
  content: "scroll snap area = border box";
  position: absolute;
  inset: 0;
  border: 2px dashed #b45309;
  border-radius: inherit;
  color: #78350f;
  font-size: 10px;
  font-weight: 700;
  display: grid;
  place-items: start center;
  padding-top: 8px;
  background: rgba(254, 240, 138, .2);
}

.ssx-card--with-margin {
  position: relative;
  scroll-margin: 20px 0;
  background: #fde68a;
  border: 2px solid #d97706;
}

.ssx-card--with-margin::before {
  content: "border box";
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  font-size: 10px;
  color: #7c2d12;
  background: rgba(255, 255, 255, .9);
  border: 1px solid rgba(217, 119, 6, .45);
  border-radius: 999px;
  padding: 2px 8px;
  white-space: nowrap;
}

.ssx-card--with-margin::after {
  content: "snap area с scroll-margin";
  position: absolute;
  inset: -20px 0;
  border: 2px dashed #f59e0b;
  border-radius: 12px;
  z-index: 1;
  font-size: 10px;
  color: #7c2d12;
  background: rgba(254, 240, 138, .18);
  display: grid;
  place-items: start center;
  padding-top: 2px;
}

.ssx-area-demo {
  display: grid;
  place-items: center;
  border-color: #f59e0b;
  background: #fffbeb;
  min-height: 148px;
  padding-top: 24px;
  padding-bottom: 20px;
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
  color: #78350f;
  font-weight: 700;
}

.ssx-area-item-label {
  position: relative;
  z-index: 2;
  font-size: 12px;
  color: #7c2d12;
  background: rgba(255, 255, 255, .85);
  border: 1px solid rgba(217, 119, 6, .45);
  border-radius: 999px;
  padding: 3px 10px;
  line-height: 1.1;
}

.ssx-area-outset-label {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -16px;
  z-index: 2;
  font-size: 10px;
  color: #7c2d12;
  background: rgba(255, 251, 235, .96);
  border: 1px solid rgba(217, 119, 6, .45);
  border-radius: 999px;
  padding: 2px 8px;
  white-space: nowrap;
}

.ssx-area-item::before {
  content: "scroll snap area";
  position: absolute;
  top: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #78350f;
  background: rgba(255, 251, 235, .96);
  border: 1px solid rgba(217, 119, 6, .45);
  border-radius: 999px;
  padding: 2px 8px;
  white-space: nowrap;
  z-index: 2;
}

.ssx-area-item::after {
  content: "";
  position: absolute;
  inset: -10px -22px;
  border: 2px dashed #f59e0b;
  border-radius: 12px;
  z-index: 1;
}

.ssx-margin-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ssx-area-item--plain::after {
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
  --snap-ratio: 0;
  --slide-shift: 0px;
  --area-line: 0%;
  min-height: 156px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
}

.ssx-align-title {
  position: absolute;
  top: 6px;
  left: 8px;
  font-size: 11px;
  font-weight: 700;
  z-index: 5;
  background: rgba(255, 255, 255, .9);
  border: 1px solid rgba(148, 163, 184, .5);
  border-radius: 999px;
  padding: 2px 8px;
}

.ssx-align::before {
  content: "";
  position: absolute;
  top: 32px;
  bottom: 12px;
  left: 10px;
  right: 10px;
  border: 2px dashed #475569;
  border-radius: 8px;
  background: rgba(226, 232, 240, .24);
}

.ssx-align::after {
  content: "";
  position: absolute;
  left: 10px;
  right: 10px;
  top: calc(32px + (100% - 44px) * var(--snap-ratio));
  border-top: 2px dashed #dc2626;
  z-index: 4;
}

.ssx-align-port-label {
  position: absolute;
  top: 38px;
  left: 16px;
  z-index: 5;
  font-size: 10px;
  color: #334155;
  background: rgba(255, 255, 255, .92);
  border: 1px solid rgba(71, 85, 105, .35);
  border-radius: 999px;
  padding: 2px 8px;
}

.ssx-align-line-label {
  position: absolute;
  right: 14px;
  top: calc(32px + (100% - 44px) * var(--snap-ratio) - 12px);
  z-index: 5;
  font-size: 10px;
  color: #7f1d1d;
  background: rgba(255, 255, 255, .94);
  border: 1px solid rgba(220, 38, 38, .35);
  border-radius: 999px;
  padding: 2px 8px;
}

.ssx-align-boundary {
  position: absolute;
  right: 14px;
  z-index: 5;
  font-size: 9px;
  color: #1e293b;
  background: rgba(255, 255, 255, .94);
  border: 1px solid rgba(100, 116, 139, .35);
  border-radius: 999px;
  padding: 1px 7px;
}

.ssx-align-boundary--start {
  top: 34px;
}

.ssx-align-boundary--end {
  bottom: 14px;
}

.ssx-align-slide {
  position: absolute;
  left: 24px;
  right: 24px;
  height: 40px;
  top: calc(32px + (100% - 44px) * var(--snap-ratio) + var(--slide-shift));
  border-radius: 8px;
  border: 2px solid #0ea5e9;
  background: rgba(125, 211, 252, .3);
  z-index: 3;
}

.ssx-align-slide::after {
  content: "";
  position: absolute;
  left: -2px;
  right: -2px;
  top: var(--area-line);
  border-top: 2px dotted #b45309;
}

.ssx-align--start {
  --snap-ratio: 0;
  --slide-shift: 0px;
  --area-line: 0%;
}

.ssx-align--center {
  --snap-ratio: .5;
  --slide-shift: -20px;
  --area-line: 50%;
}

.ssx-align--end {
  --snap-ratio: 1;
  --slide-shift: -40px;
  --area-line: 100%;
}

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
