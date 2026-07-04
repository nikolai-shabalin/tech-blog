---
title: "text-fit: подгоняем текст под ширину строки"
description: "Разбираем новое CSS-свойство text-fit из CSS Text Module Level 5: grow, shrink, consistent, per-line, per-line-all и процентные ограничения с интерактивными примерами."
pubDate: "July 04 2026"
---

Ну что же добро пожаловать в будущее. 4 июня 2026 в спецификации [CSS Text Module Level 5](https://drafts.csswg.org/css-text-5/#text-fit-property) появилось новое CSS-свойство `text-fit`, которое автоматически масштабирует размер шрифта, чтобы текст идеально соответствовал ширине его блока.

А [Chrome 150](https://chromestatus.com/feature/5104141688635392?gate=5188568263426048) уже внедрил к себе реализацию, так что уже можно попробовать.

> Обновите Хром если ещё нет и продолжите чтение статье, так как все примеры в статье будут работать только начиная от 150 версии Хрома.

## Сразу пример
<figure>
  <div class="title-wrapper">
    <h1 class="title">Заголовок</h1>
  </div>
  <figcaption>В правом нижнем углу есть "тягалочка" - потяни её вправо/влево</figcaption>
</figure>

<style>
.title-wrapper {
  width: 50%;
  padding: 16px;
  border: 2px solid;

  /* Позволяет менять ширину блока мышью */
  resize: horizontal;
  overflow: auto;
}

.title {
  margin: 0;
  line-height: 1;
  white-space: nowrap;

  text-fit: grow;
}
</style>

Этого пример уже достаточно показательный. По умолчанию размер текста блока подстраивается таким образом, чтобы текст не обрезался и не выпадал из блока, но как только блок увеличивается по ширине, увеличивается размер текста - правда похоже на жидкую типографику?

На данный момент для такого эффекта нужно, либо [написать кучу JS-кода, либо заменить его на кучу современного CSS-кода](https://piccalil.li/blog/riffing-on-the-latest-css-fit-text-approach/). В общем, так или иначе потребуется кучка кода, неважно какого. Новая же CSS-фича позволяет это сделать за одну строчку:

```css
.title {
  text-fit: grow;
}
```

## Другие значения `text-fit`

У `text-fit` есть несколько значений и модификаторов:
- `none` — браузер не масштабирует строчные элементы под ширину строки.
- `grow` — браузер увеличивает текст, чтобы он занял доступную ширину строки.
- `shrink` — браузер уменьшает текст, чтобы он поместился в строку.
- `consistent` — все строки внутри контейнера масштабируются с одним коэффициентом. Если не указать `consistent`, `per-line` или `per-line-all`, браузер считает, что выбрано именно `consistent`.
- `per-line` — каждая строка получает свой коэффициент масштабирования, но последняя строка блока и строки с принудительным переносом не масштабируются.
- `per-line-all` — каждая строка получает свой коэффициент масштабирования, включая последнюю строку и строки с принудительным переносом.
- `<percentage>` — ограничивает коэффициент масштабирования. Для `grow` значение от `100%` задаёт максимум увеличения, для `shrink` значение от `0%` до `100%` задаёт минимум уменьшения.

### `none`

Значение `none` отключает автоматическое масштабирование. Если текст шире блока, он просто переполнит строку.

```css
.title {
  text-fit: none;
}
```

<figure class="text-fit-demo">
  <div class="text-fit-demo__wrapper text-fit-demo__wrapper--narrow">
    <h2 class="text-fit-demo__title text-fit-demo__title--none">Очень длинный заголовок</h2>
  </div>
  <figcaption>Потяни правый нижний угол: текст не будет подстраиваться под ширину блока</figcaption>
</figure>

### `grow`

Значение `grow` увеличивает текст, если в строке есть свободное место.

```css
.title {
  text-fit: grow;
}
```

<figure class="text-fit-demo">
  <div class="text-fit-demo__wrapper">
    <h2 class="text-fit-demo__title text-fit-demo__title--grow">Заголовок</h2>
  </div>
  <figcaption>Потяни блок шире: текст будет расти вместе с доступной строкой</figcaption>
</figure>

### `shrink`

Значение `shrink` уменьшает текст, если он не помещается в строку.

```css
.title {
  text-fit: shrink;
}
```

<figure class="text-fit-demo">
  <div class="text-fit-demo__wrapper text-fit-demo__wrapper--narrow">
    <h2 class="text-fit-demo__title text-fit-demo__title--shrink">Очень длинный заголовок</h2>
  </div>
  <figcaption>Сделай блок уже: текст будет уменьшаться, чтобы остаться внутри строки</figcaption>
</figure>

### `consistent`

Значение `consistent` заставляет все строки использовать один общий коэффициент масштабирования. Поэтому короткие строки не разгоняются сильнее длинных.

```css
.text {
  text-fit: grow consistent;
}
```

<figure class="text-fit-demo">
  <div class="text-fit-demo__wrapper text-fit-demo__wrapper--paragraph">
    <p class="text-fit-demo__text text-fit-demo__text--consistent">
      Первая строка заметно длиннее остальных строк
      <br>
      короткая строка
      <br>
      ещё одна короткая
    </p>
  </div>
  <figcaption>Все строки масштабируются одинаково, поэтому сохраняют общий ритм</figcaption>
</figure>

### `per-line`

Значение `per-line` масштабирует каждую строку отдельно, но не трогает последнюю строку и строки с принудительным переносом.

```css
.text {
  text-fit: grow per-line;
}
```

<figure class="text-fit-demo">
  <div class="text-fit-demo__wrapper text-fit-demo__wrapper--paragraph">
    <p class="text-fit-demo__text text-fit-demo__text--per-line">
      Первая строка может вырасти сильнее соседней
      вторая строка тоже получает свой размер
      последняя строка остаётся как есть
    </p>
  </div>
  <figcaption>Меняй ширину блока: строки подбирают размер независимо, кроме последней</figcaption>
</figure>

### `per-line-all`

Значение `per-line-all` похоже на `per-line`, но масштабирует вообще все строки, включая последнюю и строки с принудительным переносом.

```css
.text {
  text-fit: grow per-line-all;
}
```

<figure class="text-fit-demo">
  <div class="text-fit-demo__wrapper text-fit-demo__wrapper--paragraph">
    <p class="text-fit-demo__text text-fit-demo__text--per-line-all">
      Первая строка может вырасти сильнее соседней
      вторая строка тоже получает свой размер
      последняя строка теперь тоже растёт
    </p>
  </div>
  <figcaption>Последняя строка тоже заполняет доступную ширину</figcaption>
</figure>

### `<percentage>`

Процент задаёт предел масштабирования. Например, `grow 140%` разрешает тексту увеличиться максимум до `140%` от исходного размера.

```css
.title {
  text-fit: grow 140%;
}
```

<figure class="text-fit-demo">
  <div class="text-fit-demo__wrapper">
    <h2 class="text-fit-demo__title text-fit-demo__title--percentage">Заголовок</h2>
  </div>
  <figcaption>Потяни блок шире: текст растёт, но останавливается на заданном пределе</figcaption>
</figure>

А `shrink 70%` разрешает тексту уменьшиться максимум до `70%` от исходного размера.

```css
.title {
  text-fit: shrink 70%;
}
```

<figure class="text-fit-demo">
  <div class="text-fit-demo__wrapper text-fit-demo__wrapper--narrow">
    <h2 class="text-fit-demo__title text-fit-demo__title--percentage-shrink">Очень длинный заголовок</h2>
  </div>
  <figcaption>Сделай блок уже: текст уменьшается, но не становится меньше заданного предела</figcaption>
</figure>

<style>
.text-fit-demo {
  margin-block: 24px;
}

.text-fit-demo__wrapper {
  width: 50%;
  min-width: 160px;
  max-width: 100%;
  padding: 16px;
  border: 1px solid currentColor;

  resize: horizontal;
  overflow: auto;
}

.text-fit-demo__wrapper--narrow {
  width: 260px;
}

.text-fit-demo__wrapper--paragraph {
  width: 420px;
}

.text-fit-demo__title,
.text-fit-demo__text {
  margin: 0;
  line-height: 1;
}

.text-fit-demo__title {
  font-size: 48px;
  white-space: nowrap;
  margin-block: unset !important;

  &::before {
    display: none;
  }
}

.text-fit-demo__text {
  font-size: 32px;
}

.text-fit-demo__title--none {
  text-fit: none;
}

.text-fit-demo__title--grow {
  text-fit: grow;
}

.text-fit-demo__title--shrink {
  text-fit: shrink;
}

.text-fit-demo__text--consistent {
  text-fit: grow consistent;
}

.text-fit-demo__text--per-line {
  text-fit: grow per-line;
}

.text-fit-demo__text--per-line-all {
  text-fit: grow per-line-all;
}

.text-fit-demo__title--percentage {
  text-fit: grow 140%;
}

.text-fit-demo__title--percentage-shrink {
  text-fit: shrink 70%;
}
</style>
