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

**Основные свойства `scroll conainer`:**
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

### 3) Смещение области: `scroll-padding`
CSS-свойство `scroll-padding` задаёт *внутренние смещения* для `scrollport` и тем самым определяет **optimal viewing region** — область, в которую браузер старается приводить целевые элементы.

Свойство не меняет layout, но меняет геометрию целевой области для прокрутки. Это значит, что слайды внутри слайдера никак не изменят свои размеры из-за указанного `scroll-padding`.

**Основные свойства `scroll-padding`:**
- задаёт отступы внутрь `scrollport` и «сужает» рабочую область навигации;
- в snap-контейнере эта область становится `snapport`;
- проценты считаются от размеров `scrollport`;
- значение `auto` оставляет расчёт браузеру (обычно эквивалентно `0px`).

Отдельно полезно помнить поведение корневого элемента из спецификации: если `scroll-padding` задан на root-элементе документа, он применяется к **viewport**, а не «переезжает» с `body`. То есть для управления snap-геометрией всей страницы ориентироваться нужно именно на корневой scrolling box.

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

Формула для понимания: `snapport` = `scrollport - scroll-padding`. В третьем примере, который чуть выше, мы получили "область после scroll-padding" - это и есть `snapport`.

Без `scroll-padding`: `snapport = scrollport`

**Основные свойства `snapport`:**
- размер и положение `snapport` напрямую зависят от `scroll-padding`.

**Про эти свойства, про которые чуть позже:**
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

Если упрощать, то:

`scroll snap area = border box элемента`

Но точнее по спецификации всё немного интереснее: за основу берётся **transformed border box**, затем браузер строит его **axis-aligned bounding box** в координатах scroll container, и уже от этой области дальше считает snap area.

**Основные механизмы `scroll snap area`:**
- в простом объяснении базой можно считать `border box` элемента;
- именно эта область участвует в вычислении `snap position`;
- итоговое выравнивание зависит от пары: `scroll snap area` + `snapport`.

<div class="ssx-demo ssx-snap-area-demo">
  <div class="ssx-slider-demo ssx-snap-area-demo__scroller">
    <div class="ssx-cards">
      <div class="ssx-card">1</div>
      <div class="ssx-card ssx-card--snap-area">2</div>
      <div class="ssx-card">3</div>
      <div class="ssx-card">4</div>
    </div>
  </div>
</div>

### 6) Изменение области span area: `scroll-margin`

CSS-свойство `scroll-margin` расширяет snap area наружу и влияет на расчёт snap/scrollTo/якорей.

`snap area` = `border box элемента + roll-margin`

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
      <div class="ssx-card">4</div>
      <div class="ssx-card">5</div>
    </div>
  </div>
</div>

### 7) Правило выравнивания: `scroll-snap-align`

Вот здесь наконец складываются все предыдущие детали:

- у контейнера уже есть `snapport`;
- у элемента уже есть `snap area`;
- осталось только указать, **как именно их выровнять друг относительно друга**.

Именно это и делает `scroll-snap-align`. В спецификации свойство определяется как выравнивание `snap area` элемента внутри `snapport` контейнера. Это не «включатель snapping», а правило: **какая линия элемента должна совпасть с какой линией `snapport`**.

```css
scroll-snap-align: [ none | start | end | center ]{1,2};
```

- `start` — совместить начало `snap area` с началом `snapport`;
- `center` — совместить центры;
- `end` — совместить концы;
- `none` — этот элемент не создаёт snap position по указанной оси.

Если указано одно значение, оно применяется к обеим осям. Если два, то первое задаёт выравнивание по **block axis**, а второе по **inline axis**. Это важный момент из спецификации: порядок здесь логический, а не «сначала X, потом Y».

Для наглядности я буду использовать неофициальный термин **snap-line**. Это воображаемая линия `start`, `center` или `end` у `snapport` и у `snap area`. Когда такие линии совпадают, получается `snap position`.

Чтобы увидеть это буквально, сначала разложим обе стороны по одной горизонтальной оси. Здесь схема специально упрощена: у `snap area` есть начало, центр и конец, и у `snapport` есть такие же три опорные линии.

<div class="ssx-sa-intro">
  <div class="ssx-sa-axis-card">
    <div class="ssx-sa-axis-header">
      <code>snap area</code>
      <span>линии самого элемента</span>
    </div>
    <div class="ssx-sa-axis-frame">
      <div class="ssx-sa-axis-box ssx-sa-axis-box--area">
        <div class="ssx-sa-axis-name">scroll snap area</div>
        <div class="ssx-sa-axis-rulers">
          <div class="ssx-sa-axis-ruler ssx-sa-axis-ruler--start"><span>начало</span></div>
          <div class="ssx-sa-axis-ruler ssx-sa-axis-ruler--center"><span>центр</span></div>
          <div class="ssx-sa-axis-ruler ssx-sa-axis-ruler--end"><span>конец</span></div>
        </div>
      </div>
    </div>
    <p class="ssx-sa-axis-note">У <code>snap area</code> браузер может ориентироваться на три линии: <code>start</code>, <code>center</code> и <code>end</code>.</p>
  </div>

  <div class="ssx-sa-axis-card">
    <div class="ssx-sa-axis-header">
      <code>snapport</code>
      <span>линии области, внутри которой идёт выравнивание</span>
    </div>
    <div class="ssx-sa-axis-frame">
      <div class="ssx-sa-axis-box ssx-sa-axis-box--port">
        <div class="ssx-sa-axis-name">snapport</div>
        <div class="ssx-sa-axis-rulers">
          <div class="ssx-sa-axis-ruler ssx-sa-axis-ruler--start"><span>начало</span></div>
          <div class="ssx-sa-axis-ruler ssx-sa-axis-ruler--center"><span>центр</span></div>
          <div class="ssx-sa-axis-ruler ssx-sa-axis-ruler--end"><span>конец</span></div>
        </div>
      </div>
    </div>
    <p class="ssx-sa-axis-note">У <code>snapport</code> есть такой же набор линий: <code>start</code>, <code>center</code> и <code>end</code>.</p>
  </div>
</div>

<p class="ssx-sa-summary">Итого: <code>scroll-snap-align</code> просто выбирает, какая линия <code>snap area</code> должна совпасть с такой же линией <code>snapport</code>: <code>start ↔ start</code>, <code>center ↔ center</code> или <code>end ↔ end</code>.</p>

Теперь можно показать три базовых варианта:

<div class="ssx-sa-grid">
  <div class="ssx-sa-box">
    <div class="ssx-sa-header"><code>scroll-snap-align: start</code></div>
    <div class="ssx-sa-port">
      <div class="ssx-sa-port-tag">snapport</div>
      <div class="ssx-sa-sline ssx-sa-sline--top"><span>snap-line: start</span></div>
      <div class="ssx-sa-track ssx-sa-track--start">
        <div class="ssx-sa-c">1</div>
        <div class="ssx-sa-c ssx-sa-c--hi">2</div>
        <div class="ssx-sa-c">3</div>
        <div class="ssx-sa-c">4</div>
      </div>
    </div>
    <p class="ssx-sa-note"><code>start ↔ start</code>: верхняя линия <code>snap area</code> совпала с верхней линией <code>snapport</code>.</p>
  </div>

  <div class="ssx-sa-box">
    <div class="ssx-sa-header"><code>scroll-snap-align: center</code></div>
    <div class="ssx-sa-port">
      <div class="ssx-sa-port-tag">snapport</div>
      <div class="ssx-sa-sline ssx-sa-sline--mid"><span>snap-line: center</span></div>
      <div class="ssx-sa-track ssx-sa-track--center">
        <div class="ssx-sa-c">1</div>
        <div class="ssx-sa-c">2</div>
        <div class="ssx-sa-c">3</div>
        <div class="ssx-sa-c ssx-sa-c--hi">4</div>
      </div>
    </div>
    <p class="ssx-sa-note"><code>center ↔ center</code>: центр <code>snap area</code> совпал с центром <code>snapport</code>.</p>
  </div>

  <div class="ssx-sa-box">
    <div class="ssx-sa-header"><code>scroll-snap-align: end</code></div>
    <div class="ssx-sa-port">
      <div class="ssx-sa-port-tag">snapport</div>
      <div class="ssx-sa-sline ssx-sa-sline--bottom"><span>snap-line: end</span></div>
      <div class="ssx-sa-track ssx-sa-track--end">
        <div class="ssx-sa-c">1</div>
        <div class="ssx-sa-c">2</div>
        <div class="ssx-sa-c">3</div>
        <div class="ssx-sa-c ssx-sa-c--hi">4</div>
      </div>
    </div>
    <p class="ssx-sa-note"><code>end ↔ end</code>: нижняя линия <code>snap area</code> совпала с нижней линией <code>snapport</code>.</p>
  </div>
</div>

### 8) `snap position`
Теперь можно назвать кульминационный термин. Спецификация определяет `snap position` как **scroll position, которая удовлетворяет заданному выравниванию `snap area` внутри `snapport`**.

Проще говоря:

- `snap area` — это область элемента;
- `scroll-snap-align` — это правило выравнивания;
- `snap position` — это уже **конкретное значение прокрутки**, при котором правило выполнено.

Удобная формула для запоминания:

`snap area + snapport + правило align = snap position`

Ниже один и тот же элемент в двух состояниях. Слева линии ещё не совпали, справа совпали. В этот момент текущий `scroll offset` контейнера и есть `snap position`.

<div class="ssx-pos-compare">
  <div class="ssx-pos-panel">
    <div class="ssx-pos-panel-title">Линии ещё не совпали</div>
    <div class="ssx-pos-stage">
      <div class="ssx-pos-line ssx-pos-line--port"></div>
      <div class="ssx-pos-line ssx-pos-line--card"></div>
      <div class="ssx-pos-gap"></div>
      <div class="ssx-pos-elem ssx-pos-elem--off">item</div>
    </div>
    <div class="ssx-pos-badge ssx-pos-badge--no">Это ещё не `snap position`: правило `center ↔ center` пока не выполнено.</div>
  </div>

  <div class="ssx-pos-arrow" aria-hidden="true">→</div>

  <div class="ssx-pos-panel">
    <div class="ssx-pos-panel-title">Линии совпали</div>
    <div class="ssx-pos-stage">
      <div class="ssx-pos-line ssx-pos-line--snap"></div>
      <div class="ssx-pos-elem ssx-pos-elem--on">item</div>
    </div>
    <div class="ssx-pos-badge ssx-pos-badge--yes">Это уже `snap position`: текущий `scroll offset` удовлетворяет правилу выравнивания.</div>
  </div>
</div>

Именно поэтому полезно разделять термины:

- `scroll-snap-align` отвечает на вопрос «**как выравнивать**?»;
- `snap position` отвечает на вопрос «**при каком offset это выравнивание выполнено**?».

### 9) `snap positions`
У контейнера почти никогда нет только одной возможной позиции привязки. Обычно у него есть **набор кандидатов**: каждый элемент со своим `scroll-snap-align` добавляет одну или несколько возможных `snap positions` по осям, а браузер затем выбирает, к какой из них притянуться.

То есть:

- `snap position` — одна конкретная позиция;
- `snap positions` — весь набор допустимых позиций-кандидатов в контейнере.

Ниже длинная лента карточек. У каждой карточки есть своя потенциальная точка остановки, а синий viewport показывает, что браузер в каждый момент выбирает одну из них как финальную.

<div class="ssx-ruler">
  <div class="ssx-ruler-bar">
    <div class="ssx-ruler-tick ssx-ruler-tick--1"><span>card 1</span></div>
    <div class="ssx-ruler-tick ssx-ruler-tick--2"><span>card 2</span></div>
    <div class="ssx-ruler-tick ssx-ruler-tick--3"><span>card 3</span></div>
    <div class="ssx-ruler-tick ssx-ruler-tick--4"><span>card 4</span></div>
    <div class="ssx-ruler-vp"></div>
  </div>
  <div class="ssx-ruler-note">Каждая отметка — возможная `snap position`. Вместе они образуют набор `snap positions`.</div>
</div>

Именно этот набор браузер рассматривает дальше, когда применяет правила выбора из раздела *[Choosing Snap Positions](https://www.w3.org/TR/css-scroll-snap-1/#choosing)* в спецификации: обычно он старается подобрать ближайший уместный кандидат, но точный алгоритм остаётся на стороне user agent.

### 10) Процесс: `snapping`

После естественного end-point браузер может довести прокрутку до ближайшей уместной snap-позиции.

Здесь важно разделить два шага:

1. Пользователь скроллит контейнер колесом, тачпадом, свайпом или клавиатурой.
2. Браузер получает **естественную точку остановки** прокрутки и уже после этого решает, нужно ли чуть скорректировать её до ближайшей подходящей `snap position`.

Эта естественная точка остановки и есть `natural end-point`. Она появляется из обычной физики скролла: инерции, скорости жеста, текущего `scroll offset` и поведения платформы. То есть сначала контейнер почти «доезжает сам», а уже потом Scroll Snap проверяет, не стоит ли закончить движение в более аккуратной позиции.

Если рядом есть подходящий кандидат, браузер может изменить финальный `scroll offset` так, чтобы он удовлетворял правилу выравнивания. Именно этот короткий переход от естественной остановки к snap-позиции и называется `snapping`.

Проще говоря:

- `natural end-point` — место, где прокрутка закончилась бы без snap;
- `snapped position` — место, куда браузер решил довести контейнер после проверки snap-правил;
- `snapping` — сам процесс этого доведения.

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

На схеме серой линией отмечен `natural end-point`, красной — итоговая `snapped position`, а синяя стрелка показывает, что браузер может немного «дотянуть» прокрутку до более подходящего кандидата.

При этом важно, что браузер не обязан слепо выбирать абсолютно ближайшую точку в любой ситуации. Он учитывает ось, строгость (`mandatory` или `proximity`), направление движения, достижимость позиции и другие правила выбора из спецификации. Поэтому snapping лучше понимать не как «мгновенный прыжок к ближайшей карточке», а как **корректировку финальной остановки по правилам Scroll Snap**.

### 11) Включатель режима: `scroll-snap-type`

До этого мы разобрали геометрию snapping: у контейнера есть `snapport`, у карточек есть `snap area`, у них есть правила `scroll-snap-align`, а браузер уже умеет вычислять набор `snap positions`.

Но всё это ещё не означает, что контейнер **вообще обязан использовать snapping**. Именно `scroll-snap-type` включает этот режим на scroll-контейнере и отвечает сразу на два вопроса:

- **по какой оси** искать кандидатов на привязку;
- **с какой строгостью** доводить прокрутку до ближайшей `snap position`.

```css
scroll-snap-type:
  none |
  [ x | y | block | inline | both ]
  [ mandatory | proximity ]?;
```

Если коротко, `scroll-snap-type` — это переключатель режима для контейнера:

- `x`, `y`, `inline`, `block`, `both` — говорят, **где именно** искать snap positions;
- `mandatory` или `proximity` — говорят, **насколько настойчиво** к ним притягиваться.

Без `scroll-snap-type` даже карточки с `scroll-snap-align` не будут снапиться: геометрия уже описана, но сам режим ещё не включён.

Для вертикальных секций и экранов чаще всего нужен `y`: контейнер ищет snap positions сверху вниз.

По строгости есть два основных режима:

- `mandatory` заставляет контейнер закончить прокрутку на одной из `snap positions`;
- `proximity` снапит мягче и только если естественная остановка уже достаточно близко к подходящей позиции.

Ниже слайдер: контейнер включает режим <code>y mandatory</code>, а карточки отдают свои snap positions через <code>scroll-snap-align: start</code>.

<div class="ssx-demo ssx-type-demo">
  <div class="ssx-type-demo__header"><code>scroll-snap-type: y mandatory</code></div>
  <div class="ssx-type-demo__viewport">
    <div class="ssx-type-demo__track">
      <div class="ssx-type-demo__card">1</div>
      <div class="ssx-type-demo__card">2</div>
      <div class="ssx-type-demo__card">3</div>
      <div class="ssx-type-demo__card">4</div>
      <div class="ssx-type-demo__card">5</div>
      <div class="ssx-type-demo__card">6</div>
      <div class="ssx-type-demo__card">7</div>
      <div class="ssx-type-demo__card">8</div>
      <div class="ssx-type-demo__card">9</div>
      <div class="ssx-type-demo__card">10</div>
    </div>
  </div>
  <p class="ssx-type-demo__note">Скрольте по вертикали: контейнер ищет кандидатов по оси <code>y</code> и обязан завершить прокрутку на одном из них. Также обратите внимание, что из-за <code>scroll-snap-align: start</code> карточки будут снапиться к верхнему краю snapport к snap area. Удобно понять смысл если вы склавиатуры будете нажимать стрелки вверх и вниз.</p>
</div>

```html
<div class="gallery">
  <article class="card">1</article>
  <article class="card">2</article>
  <article class="card">3</article>
  <article class="card">4</article>
  <article class="card">…</article>
</div>
```

```css
.gallery {
  display: flex;
  flex-direction: column;
  …
  scroll-snap-type: y mandatory;
}

.card {
  scroll-snap-align: start;
}
```

Тот же контейнер можно сделать мягче, если заменить `mandatory` на `proximity`.

<div class="ssx-demo ssx-type-demo">
  <div class="ssx-type-demo__header"><code>scroll-snap-type: y proximity</code></div>
  <div class="ssx-type-demo__viewport ssx-type-demo__viewport--proximity">
    <div class="ssx-type-demo__track">
      <div class="ssx-type-demo__card">1</div>
      <div class="ssx-type-demo__card">2</div>
      <div class="ssx-type-demo__card">3</div>
      <div class="ssx-type-demo__card">4</div>
      <div class="ssx-type-demo__card">5</div>
      <div class="ssx-type-demo__card">6</div>
      <div class="ssx-type-demo__card">7</div>
      <div class="ssx-type-demo__card">8</div>
      <div class="ssx-type-demo__card">9</div>
      <div class="ssx-type-demo__card">10</div>
    </div>
  </div>
  <p class="ssx-type-demo__note">Здесь ось та же самая, но притяжение мягче: если остановиться близко к карточке, браузер поможет дотянуться до неё, а если остановка далеко, может оставить естественную позицию прокрутки.</p>
</div>

В итоге разница между `mandatory` и `proximity` такая:

- `mandatory` ведёт себя строго и почти всегда доводит прокрутку до одной из `snap positions`;
- `proximity` ведёт себя мягче и снапит только когда пользователь уже остановился достаточно близко;
- если нужна явная постраничность, обычно выбирают `mandatory`, а если snapping должен быть лишь удобным дополнением, чаще подходит `proximity`.

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
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
  margin: 12px 0 22px;
}

.ssx-align-slider {
  --snap-ratio: .5;
  --track-shift: -71px;
  position: relative;
  min-height: 296px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  padding: 8px;
}

.ssx-align-slider__title {
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
  background: rgba(255, 255, 255, .92);
  border: 1px solid rgba(148, 163, 184, .55);
  border-radius: 999px;
  padding: 2px 8px;
  display: inline-block;
  margin-bottom: 8px;
}

.ssx-align-slider__viewport {
  position: relative;
  height: 248px;
  border-radius: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: y mandatory;
  overscroll-behavior: none;
  background: rgba(226, 232, 240, .18);
}

.ssx-align-slider__track {
  display: flex;
  flex-direction: column;
  gap: 10px;
  transform: translateY(var(--track-shift));
}

.ssx-align-card {
  height: 70px;
  border-radius: 8px;
  background: #e2e8f0;
  color: #0f172a;
  font-weight: 700;
  display: grid;
  place-items: center;
  scroll-snap-align: center;
}

.ssx-align-card--active {
  position: relative;
  background: #fde68a;
  border: 2px solid #d97706;
}

.ssx-align-card--active::before {
  content: "snap area";
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  color: #78350f;
  background: rgba(255, 255, 255, .9);
  border: 1px solid rgba(217, 119, 6, .45);
  border-radius: 999px;
  padding: 1px 6px;
}

.ssx-align-card--start::before {
  content: "scroll-snap-align: start";
}

.ssx-align-card--center::before {
  content: "scroll-snap-align: center";
}

.ssx-align-card--end::before {
  content: "scroll-snap-align: end";
}

.ssx-align-card--active::after {
  content: "";
  position: absolute;
  left: 6px;
  right: 6px;
  top: var(--card-line);
  border-top: 2px dotted #b45309;
}

.ssx-align-card--start {
  --card-line: 0%;
  scroll-snap-align: start;
}

.ssx-align-card--center {
  --card-line: 50%;
  scroll-snap-align: center;
}

.ssx-align-card--end {
  --card-line: 100%;
  scroll-snap-align: end;
}

.ssx-align-slider__snapport {
  position: absolute;
  inset: 40px 8px 8px;
  border: 2px dashed #475569;
  border-radius: 8px;
  pointer-events: none;
  font-size: 10px;
  color: #334155;
  display: grid;
  place-items: start start;
  padding: 4px 6px;
}

.ssx-align-slider__line {
  position: absolute;
  left: 8px;
  right: 8px;
  top: calc(40px + (248px * var(--snap-ratio)));
  border-top: 2px dashed #dc2626;
  pointer-events: none;
}

.ssx-align-slider__line::after {
  content: "snap-line";
  position: absolute;
  right: 6px;
  top: -12px;
  font-size: 10px;
  color: #7f1d1d;
  background: rgba(255, 255, 255, .94);
  border: 1px solid rgba(220, 38, 38, .35);
  border-radius: 999px;
  padding: 1px 7px;
}

.ssx-align-slider--start {
  --snap-ratio: 0;
  --track-shift: 0px;
}

.ssx-align-slider--center {
  --snap-ratio: .5;
  --track-shift: 0px;
}

.ssx-align-slider--end {
  --snap-ratio: 1;
  --track-shift: 0px;
}

.ssx-position-demo {
  overflow: hidden;
}

.ssx-position-single {
  min-height: 204px;
  display: grid;
  place-items: center;
}

.ssx-position-slide {
  width: 72%;
  min-width: 220px;
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
  content: "snap area line";
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

.ssx-position-note {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  font-size: 10px;
  color: #7f1d1d;
  background: rgba(255, 255, 255, .94);
  border: 1px solid rgba(220, 38, 38, .3);
  border-radius: 8px;
  padding: 4px 8px;
  text-align: center;
}

.ssx-candidate-dots {
  display: grid;
  justify-items: start;
  gap: 6px;
  margin-top: 8px;
}

.ssx-candidate-dots span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #1e3a8a;
  background: rgba(255, 255, 255, .9);
  border: 1px solid rgba(37, 99, 235, .35);
  border-radius: 999px;
  padding: 2px 8px;
}

.ssx-candidate-dots span i {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #2563eb;
  display: inline-block;
}

.ssx-type-demo {
  padding-top: 42px;
}

.ssx-type-demo__header {
  position: absolute;
  top: 10px;
  left: 12px;
  z-index: 3;
}

.ssx-type-demo__header code {
  display: inline-block;
  border-radius: 999px;
  padding: 4px 10px;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 11px;
}

.ssx-type-demo__viewport {
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: y mandatory;
  height: 320px;
  border-radius: 10px;
  border: 2px dashed #475569;
  background: #f1f5f9;
  padding: 12px;
}

.ssx-type-demo__viewport--proximity {
  scroll-snap-type: y proximity;
}

.ssx-type-demo__track {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ssx-type-demo__card {
  min-height: 120px;
  border-radius: 10px;
  background: #e2e8f0;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 28px;
  color: #0f172a;
  scroll-snap-align: start;
}

.ssx-type-demo__card--active {
  background: #fde68a;
  border: 2px solid #d97706;
  color: #78350f;
}

.ssx-type-demo__note {
  margin: 10px 0 0;
  font-size: 11px;
  color: #475569;
  line-height: 1.45;
}

.ssx-stop-demo {
  padding-top: 42px;
}

.ssx-stop-demo__header {
  position: absolute;
  top: 10px;
  left: 12px;
  z-index: 3;
}

.ssx-stop-demo__header code {
  display: inline-block;
  border-radius: 999px;
  padding: 4px 10px;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 11px;
}

.ssx-stop-demo__viewport {
  overflow-y: auto;
  overflow-x: hidden;
  height: 320px;
  border-radius: 10px;
  border: 2px dashed #475569;
  background: #f1f5f9;
  padding: 12px;
  scroll-snap-type: y mandatory;
}

.ssx-stop-demo__track {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ssx-stop-demo__card {
  min-height: 120px;
  border-radius: 10px;
  background: #e2e8f0;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 28px;
  color: #0f172a;
  scroll-snap-align: start;
}

.ssx-stop-demo--normal .ssx-stop-demo__card {
  scroll-snap-stop: normal;
}

.ssx-stop-demo--always .ssx-stop-demo__card {
  scroll-snap-stop: always;
}

.ssx-stop-demo__card--active {
  background: #fde68a;
  border: 2px solid #d97706;
  color: #78350f;
}

.ssx-stop-demo__note {
  margin: 10px 0 0;
  font-size: 11px;
  color: #475569;
  line-height: 1.45;
}

.ssx-snapping-svg {
  width: 100%;
  height: auto;
  margin: 8px 0 24px;
  border-radius: 10px;
  background: #fff;
}

/* ===== Section 7: scroll-snap-align — X-ray diagram ===== */

.ssx-sa-intro {
  display: grid;
  gap: 12px;
  margin: 12px 0 16px;
}

.ssx-sa-axis-card {
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  padding: 10px;
}

.ssx-sa-axis-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.ssx-sa-axis-header code {
  display: inline-block;
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 11px;
}

.ssx-sa-axis-header span {
  font-size: 11px;
  color: #64748b;
}

.ssx-sa-axis-frame {
  border-radius: 10px;
  background: #e2e8f0;
  padding: 14px;
  overflow: visible;
}

.ssx-sa-axis-box {
  position: relative;
  min-height: 146px;
  border-radius: 10px;
  padding: 18px 18px 14px;
  overflow: visible;
}

.ssx-sa-axis-box--area {
  width: min(100%, 420px);
  margin: 0 auto;
  background: #fef3c7;
  border: 2px solid #d97706;
  color: #b45309;
}

.ssx-sa-axis-box--port {
  width: min(100%, 460px);
  margin: 0 auto;
  background: #dbeafe;
  border: 2px solid #2563eb;
  color: #1d4ed8;
}

.ssx-sa-axis-name {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 700;
  color: inherit;
  background: rgba(255, 255, 255, .86);
  border: 1px solid currentColor;
  border-radius: 999px;
  padding: 2px 8px;
  white-space: nowrap;
}

.ssx-sa-axis-rulers {
  position: absolute;
  inset: 0;
}

.ssx-sa-axis-ruler {
  position: absolute;
  left: -34px;
  right: -34px;
  height: 0;
  border-top: 2px dashed currentColor;
  opacity: .85;
}

.ssx-sa-axis-ruler span {
  position: absolute;
  right: 0;
  transform: translateY(-50%);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  color: inherit;
  background: rgba(255, 255, 255, .92);
  border: 1px solid currentColor;
  border-radius: 999px;
  padding: 2px 8px;
}

.ssx-sa-axis-ruler--start { top: 0; }
.ssx-sa-axis-ruler--center { top: 50%; }
.ssx-sa-axis-ruler--end { bottom: 0; }

.ssx-sa-axis-note {
  margin: 8px 0 0;
  font-size: 11px;
  color: #475569;
  line-height: 1.4;
}

.ssx-sa-summary {
  margin: 0 0 14px;
  border-radius: 10px;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  color: #1e3a8a;
  padding: 10px 12px;
  line-height: 1.5;
}

.ssx-sa-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 12px 0 24px;
}

.ssx-sa-box {
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  padding: 8px;
}

.ssx-sa-header {
  margin-bottom: 8px;
}

.ssx-sa-header code {
  display: block;
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 11px;
  text-align: center;
}

.ssx-sa-port {
  position: relative;
  height: 200px;
  overflow: hidden;
  border: 2px dashed #475569;
  border-radius: 8px;
  background: #f1f5f9;
}

.ssx-sa-port-tag {
  position: absolute;
  top: 4px;
  left: 6px;
  font-size: 9px;
  font-weight: 700;
  color: #334155;
  background: rgba(255, 255, 255, .9);
  border: 1px solid #94a3b8;
  border-radius: 999px;
  padding: 1px 6px;
  z-index: 4;
  pointer-events: none;
}

.ssx-sa-track {
  position: absolute;
  left: 8px;
  right: 8px;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* card h=60, gap=10 → card2.top=70, card4.top=210, card4.bottom=270 */
.ssx-sa-track--start  { transform: translateY(-70px); }
.ssx-sa-track--center { transform: translateY(-140px); }
.ssx-sa-track--end    { transform: translateY(-70px); }

.ssx-sa-c {
  flex: 0 0 60px;
  height: 60px;
  border-radius: 8px;
  background: #e2e8f0;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 18px;
  color: #94a3b8;
}

.ssx-sa-c--hi {
  background: #fde68a;
  border: 2px solid #d97706;
  color: #78350f;
  position: relative;
  z-index: 1;
}

.ssx-sa-sline {
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  border-top: 2.5px solid #dc2626;
  z-index: 3;
  pointer-events: none;
}

.ssx-sa-sline span {
  position: absolute;
  right: 6px;
  font-size: 9px;
  font-weight: 700;
  color: #991b1b;
  background: rgba(255, 255, 255, .94);
  border: 1px solid rgba(220, 38, 38, .4);
  border-radius: 999px;
  padding: 1px 6px;
  white-space: nowrap;
}

.ssx-sa-sline--top         { top: 0; }
.ssx-sa-sline--top span    { top: 3px; }
.ssx-sa-sline--mid         { top: 50%; }
.ssx-sa-sline--mid span    { top: -16px; }
.ssx-sa-sline--bottom      { bottom: 0; top: auto; }
.ssx-sa-sline--bottom span { top: -16px; }

.ssx-sa-note {
  margin: 6px 0 0;
  font-size: 10px;
  color: #475569;
  text-align: center;
  line-height: 1.3;
}

@media (max-width: 860px) {
  .ssx-sa-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== Section 8: snap position — before / after ===== */

.ssx-pos-compare {
  display: flex;
  align-items: stretch;
  gap: 8px;
  margin: 12px 0 24px;
}

.ssx-pos-panel {
  flex: 1;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  padding: 10px 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ssx-pos-panel-title {
  font-size: 11px;
  font-weight: 700;
  color: #334155;
  text-align: center;
}

.ssx-pos-stage {
  position: relative;
  flex: 1;
  min-height: 130px;
  border: 2px dashed #475569;
  border-radius: 8px;
  background: #f1f5f9;
  overflow: hidden;
}

.ssx-pos-elem {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 70%;
  height: 56px;
  border-radius: 8px;
  background: #fde68a;
  border: 2px solid #d97706;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
  color: #78350f;
  z-index: 1;
}

.ssx-pos-elem--off { top: calc(50% + 24px); }
.ssx-pos-elem--on  { top: 50%; }

.ssx-pos-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  z-index: 2;
}

.ssx-pos-line--port {
  top: 50%;
  border-top: 2px dashed #dc2626;
}

.ssx-pos-line--port::after {
  content: "center snapport";
  position: absolute;
  right: 5px;
  top: 3px;
  font-size: 9px;
  color: #991b1b;
  background: rgba(255, 255, 255, .9);
  border: 1px solid rgba(220, 38, 38, .3);
  border-radius: 999px;
  padding: 1px 5px;
}

.ssx-pos-line--card {
  top: calc(50% + 24px);
  border-top: 2px dashed #d97706;
  z-index: 2;
}

.ssx-pos-line--card::after {
  content: "center snap area";
  position: absolute;
  right: 5px;
  bottom: 3px;
  font-size: 9px;
  color: #92400e;
  background: rgba(255, 255, 255, .9);
  border: 1px solid rgba(217, 119, 6, .3);
  border-radius: 999px;
  padding: 1px 5px;
}

.ssx-pos-line--snap {
  top: 50%;
  border-top: 2.5px solid #16a34a;
  z-index: 3;
}

.ssx-pos-line--snap::after {
  content: "snap-line (совпали!)";
  position: absolute;
  right: 5px;
  top: 3px;
  font-size: 9px;
  font-weight: 700;
  color: #166534;
  background: rgba(220, 252, 231, .95);
  border: 1px solid rgba(22, 163, 74, .3);
  border-radius: 999px;
  padding: 1px 5px;
}

.ssx-pos-gap {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: calc(50% + 1px);
  height: 23px;
  border-left: 1.5px dotted #ef4444;
  z-index: 3;
}

.ssx-pos-gap::after {
  content: "gap";
  position: absolute;
  top: 4px;
  left: 4px;
  font-size: 9px;
  color: #ef4444;
  white-space: nowrap;
}

.ssx-pos-badge {
  font-size: 10px;
  text-align: center;
  border-radius: 6px;
  padding: 4px 6px;
  line-height: 1.3;
}

.ssx-pos-badge--no  { background: #fee2e2; color: #991b1b; }
.ssx-pos-badge--yes { background: #dcfce7; color: #166534; }

.ssx-pos-arrow {
  font-size: 22px;
  color: #64748b;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* ===== Section 9: snap positions (plural) — animated ruler ===== */

.ssx-ruler {
  margin: 12px 0 24px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  padding: 32px 16px 14px;
}

.ssx-ruler-bar {
  position: relative;
  height: 44px;
  background: #e2e8f0;
  border-radius: 8px;
}

.ssx-ruler-bar::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 4%;
  right: 4%;
  height: 3px;
  background: #94a3b8;
  transform: translateY(-50%);
  border-radius: 2px;
}

.ssx-ruler-tick {
  position: absolute;
  top: 0;
  bottom: 0;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ssx-ruler-tick::before {
  content: "";
  position: absolute;
  top: 50%;
  width: 4px;
  height: 20px;
  background: #2563eb;
  transform: translateY(-50%);
  border-radius: 2px;
}

.ssx-ruler-tick span {
  position: absolute;
  bottom: calc(100% + 6px);
  font-size: 9px;
  font-weight: 700;
  color: #1e40af;
  white-space: nowrap;
  background: rgba(219, 234, 254, .95);
  border: 1px solid rgba(37, 99, 235, .35);
  border-radius: 999px;
  padding: 1px 6px;
}

.ssx-ruler-tick--1 { left: 10%; }
.ssx-ruler-tick--2 { left: 37%; }
.ssx-ruler-tick--3 { left: 63%; }
.ssx-ruler-tick--4 { left: 90%; }

.ssx-ruler-vp {
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: 16%;
  background: rgba(37, 99, 235, .15);
  border: 2px solid #2563eb;
  border-radius: 5px;
  transform: translateX(-50%);
  animation: ssx-ruler-slide 6s ease-in-out infinite;
}

.ssx-ruler-vp::after {
  content: "viewport";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8px;
  font-weight: 700;
  color: #1e40af;
  white-space: nowrap;
}

@keyframes ssx-ruler-slide {
  0%, 12%  { left: 10%; }
  22%      { left: 40%; }
  25%, 37% { left: 37%; }
  47%      { left: 66%; }
  50%, 62% { left: 63%; }
  72%      { left: 93%; }
  75%, 87% { left: 90%; }
  97%, 100% { left: 10%; }
}

.ssx-ruler-note {
  margin: 10px 0 0;
  font-size: 11px;
  color: #475569;
  text-align: center;
}

.ssx-oversized-demo__viewport {
  height: 248px;
  scroll-snap-type: y mandatory;
}

.ssx-oversized-demo__card {
  min-height: 96px;
  scroll-snap-align: start;
}

.ssx-oversized-demo__card--giant {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 540px;
  padding: 20px;
  background: #fde68a;
  border: 2px solid #d97706;
  color: #78350f;
  text-align: left;
}

.ssx-oversized-demo__card--giant p {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  font-weight: 500;
}

.ssx-oversized-demo__giant-label {
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: 800;
}

.ssx-oversized-demo__note {
  margin: 10px 0 0;
  font-size: 11px;
  line-height: 1.45;
  color: #475569;
}
</style>

Именно поэтому свойства в модуле разделены на две группы:

- контейнер описывает, **по какой оси** и **с какой строгостью** нужно искать snap-позиции;
- дочерний элемент описывает, **какую область** считать значимой и **как именно** её выравнивать.

## Свойства для scroll-контейнера
Уф! Мы прошлись по основной терминологии и поняли, как работает Scroll Snap. Уже сейчас имеется полное понимание геометрии и работы snap позиций Теперь давайте быстро рассмотрим CSS-свойства и их синтаксис для использования, которые будут использоваться в проекте.

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

Нюанс спецификации для всей страницы: если `scroll-snap-type` задан на root-элементе, он применяется к **document viewport**. При этом значение с `body` туда автоматически не переносится, поэтому для page-level snapping важно настраивать именно корневой элемент.

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

Определяет внешние отступы для snap area, расширяя или сжимая область, участвующую в привязке. Отступы задаются как абсолютные длины и добавляются не просто к `border box`, а к области, которую спецификация строит из **transformed border box** элемента как **axis-aligned bounding box**.

```css
scroll-margin: <length>{1,4};
```

**Пример: добавим немного воздуха между элементами**

Возьмём предыдущую галерею, но теперь хотим, чтобы при привязке между изображениями был небольшой зазор. Можно увеличить snap area:

```css
.gallery img {
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

### 5. `scroll-snap-stop`

Управляет тем, можно ли «перепрыгнуть» через snap-позицию при быстрой прокрутке. Полезно, когда нужно остановиться на каждом элементе, не пропуская их.

```css
scroll-snap-stop: normal | always;
```

- `normal` — разрешено проскальзывать мимо (по умолчанию).
- `always` — запрещено проходить мимо; прокрутка остановится на первой же snap-позиции.

**Пример 1: обычная вертикальная лента (`normal`)**

<div class="ssx-demo ssx-stop-demo ssx-stop-demo--normal">
  <div class="ssx-stop-demo__header"><code>scroll-snap-stop: normal</code></div>
  <div class="ssx-stop-demo__viewport">
    <div class="ssx-stop-demo__track">
      <article class="ssx-stop-demo__card">1</article>
      <article class="ssx-stop-demo__card">2</article>
      <article class="ssx-stop-demo__card">3</article>
      <article class="ssx-stop-demo__card">4</article>
      <article class="ssx-stop-demo__card">5</article>
      <article class="ssx-stop-demo__card">6</article>
      <article class="ssx-stop-demo__card">7</article>
      <article class="ssx-stop-demo__card">8</article>
    </div>
  </div>
  <p class="ssx-stop-demo__note">Здесь разрешено проскальзывать мимо: при быстром скролле браузер может перескочить через некоторые snap-позиции и остановиться дальше.</p>
</div>

```css
.news-feed article {
  scroll-snap-stop: normal;
}
```

**Пример 2: пошаговая вертикальная прокрутка (`always`)**

<div class="ssx-demo ssx-stop-demo ssx-stop-demo--always">
  <div class="ssx-stop-demo__header"><code>scroll-snap-stop: always</code></div>
  <div class="ssx-stop-demo__viewport">
    <div class="ssx-stop-demo__track">
      <section class="ssx-stop-demo__card">1</section>
      <section class="ssx-stop-demo__card">2</section>
      <section class="ssx-stop-demo__card">3</section>
      <section class="ssx-stop-demo__card">4</section>
      <section class="ssx-stop-demo__card">5</section>
      <section class="ssx-stop-demo__card">6</section>
      <section class="ssx-stop-demo__card">7</section>
      <section class="ssx-stop-demo__card">8</section>
    </div>
  </div>
  <p class="ssx-stop-demo__note">Здесь каждая snap-позиция обязательна: даже при быстром движении контейнер старается остановиться на ближайшей секции и не пропускать шаги.</p>
</div>

```css
.strict-slides section {
  scroll-snap-stop: always;
}
```

При таком подходе даже быстрое движение колесом мыши или свайп не позволит пропустить секцию — прокрутка остановится на каждой.

## Особые случаи и рекомендации

### Элементы больше области просмотра

Если snap area превышает размер snapport, браузер позволяет свободно прокручивать внутри такого элемента, пока он полностью не поместится. Принудительное выравнивание применяется только когда элемент снова становится меньше области просмотра.

Это важно для случаев, когда в секции много контента — пользователь может прокручивать её внутри, но при переходе к другой секции сработает привязка.

<div class="ssx-demo ssx-oversized-demo">
  <div class="ssx-slider-demo ssx-oversized-demo__viewport">
    <div class="ssx-cards ssx-oversized-demo__track">
      <section class="ssx-card ssx-oversized-demo__card">1</section>
      <section class="ssx-card ssx-oversized-demo__card">2</section>
      <section class="ssx-card ssx-oversized-demo__card ssx-oversized-demo__card--giant">
        <div class="ssx-oversized-demo__giant-label">Очень большой блок</div>
        <p>Этот элемент специально выше видимой области.</p>
        <p>Поэтому браузер не обязан сразу перескочить к следующему.</p>
        <p>Пока большой блок не прокручен, внутри него можно двигаться свободно.</p>
      </section>
      <section class="ssx-card ssx-oversized-demo__card">4</section>
      <section class="ssx-card ssx-oversized-demo__card">5</section>
      <section class="ssx-card ssx-oversized-demo__card">6</section>
      <section class="ssx-card ssx-oversized-demo__card">7</section>
    </div>
  </div>
  <p class="ssx-oversized-demo__note">Попробуйте прокрутить галерею: на высоком блоке snapping временно не мешает дочитать содержимое внутри него.</p>
</div>

```html
<div class="story-gallery">
  <section>...</section>
  <section class="story-gallery__giant">Очень большой блок</section>
  <section>...</section>
</div>
```

```css
.story-gallery {
  scroll-snap-type: y mandatory;
}

.story-gallery section {
  scroll-snap-align: start;
}
```

### Изменение контента (re-snapping)

Если содержимое динамически меняется (добавляются/удаляются элементы), браузер обязан пересчитать snap-позиции и, если контейнер был привязан к определённому элементу, остаться привязанным к нему (если он всё ещё существует). Это обеспечивает предсказуемое поведение в чатах, логах и лентах.

## Поддержка браузерами

Scroll Snap добавляен в инициативу [Interop 2026](https://wpt.fyi/interop-2026). Это для нас значит, что до конца года поддержка всему браузерами будет практически идеальной.

CSS Scroll Snap Level 1 поддерживается во всех современных браузерах (Chrome, Firefox, Safari, Edge) начиная с 2018–2019 годов. Для старых версий могут потребоваться префиксы, но сейчас они не обязательны. Рекомендуется всегда проверять актуальную информацию на [caniuse.com](https://caniuse.com/css-snappoints).
