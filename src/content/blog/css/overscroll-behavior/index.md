---
title: "Управляем «протягиванием» прокрутки: разбор overscroll‑behavior"
description: "Разбираем CSS-свойство overscroll-behavior: предотвращаем scroll chaining, управляем bounce и pull-to-refresh, улучшаем UX."
pubDate: "Aug 19 2025"
---

Распространённый сценарий: вы прокручиваете модальное окно, доезжаете до конца и… вместо того чтобы остановиться, браузер продолжает тянуть основной документ. Это так называемый «scroll chaining»: событие прокрутки передаётся родительскому контейнеру. На мобильных устройствах этот эффект сопровождается bounce‑анимацией или pull‑to‑refresh. Для некоторых интерфейсов такое поведение отвлекает пользователя и может мешать вашему коду.

В этой статье я расскажу, как CSS‑свойство `overscroll-behavior` помогает контролировать такие эффекты, избавится от хака `overflow: hidden`, а также рассмотрим практические примеры и подводные камни.

## Цепочка скролов

Чтобы было понятно, что такое цепочка скролов попробуй навести курсор мышки на самый тёмный блок и начните прокрутку вниз. Как только вы досколите до конца внутреннего блока, то продолжится прокрутка в среднем блоке, и так до самого глубокого.


<div class="grandfather">
  <div class="father">
    <div class="son"></div>
  </div>
</div>

<style>

.grandfather {
  max-height: 300px;
  overflow-y: auto;
  background: #e3f2fd;
  padding: 16px;
}

.grandfather::after {
  content: "";
  display: block;
  height: 900px;
}

.father {
  max-height: 200px;
  overflow-y: auto;
  background: #bbdefb;
  padding: 16px;
  border-radius: 12px;
}

.father::after {
  content: "";
  display: block;
  height: 700px; /* больше, чем 200px */
}

.son {
  max-height: 150px;
  overflow-y: auto;
  background: #90caf9;
  padding: 16px;
  border-radius: 12px;
}

.son::after {
  content: "";
  display: block;
  height: 600px; /* больше, чем 150px */
}
</style>

## Почему scroll chaining — проблема?
Когда элемент со своей прокруткой достигает границы, браузер по умолчанию передаёт прокрутку родительскому элементу. Такое поведение особенно заметно в следующих ситуациях:
- Модальные окна. Пользователь читает содержимое модального окна, но при достижении конца внезапно начинает прокручиваться страница под ним.

<div class="demo">
  <div class="demo-spacer top"></div>

  <section class="modal-like">
    <header class="modal-like__header">Модальное окно</header>
    <div class="modal-like__content"></div>
    <footer class="modal-like__footer">Футер</footer>
  </section>

  <div class="demo-spacer bottom"></div>
</div>

<style>
.demo{
  height: 1000px;
  max-height: 500px;
  overflow: auto;
  padding: 16px;
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 12px;
  background: #fff;
  max-width: 900px;
  margin: 24px auto;
}

.demo::after {
  content: "";
  display: block;
  height: 100%;
}

.demo-spacer{
  height: 20px;
  border-radius: 12px;
  margin: 8px 0;
}

.modal-like{
  color: black;
  margin: 16px auto;
  width: min(700px, 100%);
  border-radius: 14px;
  box-shadow: 0 18px 50px rgba(0,0,0,.12);
  border: 1px solid rgba(0,0,0,.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-like__header,
.modal-like__footer{
  padding: 12px 16px;
  font-weight: 600;
}

.modal-like__content{
  overflow: auto;
  max-height: 240px;
  position: relative;
  background: #f9fafb;
  padding: 12px 14px;
}

.modal-like__content::before{
  content: "Контент";
  display: block;
  height: 400px;
  background: #6366F1;
  padding: 10px;
}
</style>

- Длинные боковые панели и мобильные меню. Список пунктов меню выходит за пределы экрана; прокрутив до конца, пользователь случайно начинает двигать основной контент.

<div class="frame">
  <div class="layout">
    <aside class="sidebar">
      <header class="sidebar__header">Меню</header>
      <nav class="sidebar__scroller">
        <div class="menu"></div>
      </nav>
    </aside>
    <main class="content-article">
    </main>
  </div>
</div>

<style>

/* Внешняя рамка примера: фикс. высота 500px, скролл — это «страница» */
.frame{
  height: 500px;
  overflow: auto;
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 12px;
  background: #ffffff;
  max-width: 1000px;
  margin: 24px auto;
  padding: 12px;
}

.layout{
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 12px;
  min-height: 700px; /* чтобы был запас высоты внутри frame */
}

/* ===== Sidebar ===== */
.sidebar{
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 12px;
  background: #f6f8ff;
  box-shadow: 0 8px 24px rgba(0,0,0,.06);
  overflow: hidden;
}

.sidebar__header{
  padding: 12px 14px;
  font-weight: 600;
  background: #eef2ff;
  color: #0b132b;
}

/* Внутренний скролл именно здесь */
.sidebar__scroller{
  overflow: auto;
  max-height: 320px;
  padding: 10px 12px;
  background: #f9fafb;
  position: relative;
}

/* Длинное «меню» без текста */
.menu::before{
  content: "";
  display: block;
  height: 900px;               /* Больше, чем max-height скроллера */
  border-radius: 10px;
  background:
    repeating-linear-gradient(
      to bottom,
      #c7d2fe,
      #c7d2fe 36px,
      #818cf8 36px,
      #818cf8 44px
    );
  opacity: .45;
}

/* ===== Content ===== */
.content-article{
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0,0,0,.06);
  overflow: hidden;
}
</style>


- Бесконечные списки. Совмещение bounce‑эффекта и подгрузки данных может запутать пользователя.

Раньше для предотвращения прокрутки родительского элемента использовали JavaScript: при открытии модального окна на body навешивали класс с `overflow: hidden` и даже `position: fixed`. Такой подход ломает позиционирование, особенно в Safari, и вызывает «перескок» страницы.

## Что делает `overscroll‑behavior`?
Свойство `overscroll-behavior` задаёт, что должно происходить при достижении края области прокрутки. Оно описано в спецификации  [CSS Overscroll Behavior Module Level 1](https://drafts.csswg.org/css-overscroll/) и является сокращением для `overscroll-behavior-x` и `overscroll-behavior-y`. Поддержку в браузерах посмотрите в [caniuse](https://caniuse.com/?search=overscroll-behavior).

Основной синтаксис:
```css
/* Ключевые значения */
overscroll-behavior: auto; /* значение по умолчанию */
overscroll-behavior: contain;
overscroll-behavior: none;

/* Два значения: для осей X и Y */
overscroll-behavior: auto contain;
```

Перечислим значения в виде таблицы:
| Значение  | Что делает                                                                                                                   |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `auto`    | Стандартное поведение: событие прокрутки передаётся родителю, работают bounce‑эффекты.                                       |
| `contain` | Останавливает scroll chaining: прокрутка ограничена текущим контейнером, но визуальные эффекты (bounce/refresh) сохраняются. |
| `none`    | Запрещает scroll chaining и отключает bounce и pull‑to‑refresh.                                                              |

Если указать два значения, первое относится к горизонтальной оси, второе — к вертикальной. Для отдельного управления можно использовать составные свойства `overscroll-behavior-x` и `overscroll-behavior-y`, а также логические варианты overscroll-behavior-inline и overscroll-behavior-block для учёта writing-mode.


### Ограничение: только scroll containers
Свойство работает лишь на элементах с собственным скроллом. Ифреймы не являются scroll containers, поэтому `overscroll-behavior` на них не действует; задайте его на `<html>` и `<body>` внутри документа iframe.

## Как отключить pull‑to‑refresh и bounce
Чтобы убрать стандартную анимацию перетягивания в мобильных браузерах, достаточно объявить `overscroll-behavior-y` на корневом элементе:
```css
html {
  overscroll-behavior-y: contain;
}
```

Это остановит прокрутку при достижении верхней границы, но bounce‑эффект сохранится. Если нужно полностью отключить «резинку», используйте значение `none`:
```css
html {
  overscroll-behavior-y: none;
}
```

Такой подход пригодится при реализации собственной анимации pull‑to‑refresh либо бесконечной ленты, чтобы визуальный «отскок» не сбивал пользователей.

## Примеры использования
### Длинная мобильная навигация
Когда пунктов меню слишком много, простое движение пальцем приводит к прокрутке страницы. Добавьте overscroll-behavior-y: contain и overflow-y: auto на контейнер навигации:

```css
.nav {
  overscroll-behavior-y: contain;
  overflow-y: auto;
}
```

Теперь прокрутка остановится на конце списка, не затрагивая `<body>`.

### Фиксированная боковая панель
Если боковая панель фиксирована (`position: fixed`) и имеет собственную прокрутку, то без регулировки она будет прокручивать основную колонку. Настройте:

```css
.aside {
  overscroll-behavior-y: contain;
}
```
По достижении низа контент останется на месте.

### Модальные окна с длинным списком
Для списков внутри модальных окон важно, чтобы прокрутка не переходила на диалог целиком. Ограничим скролл внутри списка и укажем максимальную высоту:
```css
.list-wrapper {
  overscroll-behavior-y: contain;
  overflow-y: auto;
  max-height: 130px;
}
```


### Горизонтальные карусели
Для горизонтальных списков (например, «Истории» в социальных сетях) применяют `overscroll-behavior-x: contain`, чтобы зафиксировать прокрутку на этом уровне:
```css
.list {
  overscroll-behavior-x: contain;
  overflow-x: auto;
}
```

### Блокировка прокрутки под модальным окном
Самый простой способ предотвратить скролл родительского элемента при появлении модального окна — задать `overscroll-behavior: contain` или `none` на `<html>/<body>`. Это изящная альтернатива старому методу с `overflow: hidden `и избавляет от необходимости фиктивно фиксировать `body`.

## Отдельные оси и логические свойства
Иногда нужно контролировать только одну ось. Например, для чат‑компонента достаточно запретить вертикальный `scroll chaining`. Это делается с помощью `overscroll-behavior-y`. Для горизонтальных списков — `overscroll-behavior-x`. Логические свойства `overscroll-behavior-inline` и `overscroll-behavior-block` облегчают поддержку разных направлений письма. Они переключают управление между осями `x` и `y` в зависимости от `writing-mode`

| Свойство                     | Ось            | Особенность                                                   |
| ---------------------------- | -------------- | ------------------------------------------------------------- |
| `overscroll-behavior-x`      | горизонтальная | Контролирует прокрутку слева направо/справа налево.           |
| `overscroll-behavior-y`      | вертикальная   | Контролирует прокрутку сверху вниз.                           |
| `overscroll-behavior-inline` | inline‑ось     | Переключается между `x` и `y` в зависимости от режима письма. |
| `overscroll-behavior-block`  | блок‑ось       | Аналогично inline‑варианту, только для блокового направления. |

## Источники
- [CSS Overscroll Behavior Module Level 1](https://drafts.csswg.org/css-overscroll/)
