---
title: "Как сделать задержку интереса в CSS"
description: "Узнаем как предотвращают «дрожание» элементов при случайном касании и обеспечивают плавный, естественный отклик на действия пользователя."
pubDate: "Oct 04 2025"
---

В спецификации [CSS Basic User Interface Module Level 4](https://drafts.csswg.org/css-ui-4/) появилось свойство [interest-delay](https://drafts.csswg.org/css-ui-4/#interest). Оно позволяет задать задержку "интереса"(внимания) для элемента. Сейчас [это работает](https://caniuse.com/?search=interest-delay) только в 122 Хроме.


## Что такое «внимание пользователя»?
Некоторые функции веб-страниц активируются, когда пользователь начинает взаимодействовать с элементом — например, наводит на него курсор, касается на сенсорном экране или фокусируется с клавиатуры. В спецификациях это иногда называют «проявлением интереса», но проще думать об этом как о моменте, когда пользователь «обращает внимание» на элемент.

Важно, чтобы такие реакции не происходили мгновенно. Представьте: вы просто быстро проводите курсором над кнопкой, не собираясь на неё нажимать, — и тут всплывает большое меню, которое тут же исчезает. Это раздражает и сбивает с толку.

Точно так же, если пользователь уже начал взаимодействовать с элементом (например, навёл курсор на ссылку, и появилось выпадающее меню), то при переходе курсора с самой ссылки на это меню интерфейс не должен мгновенно «забыть», что пользователь всё ещё работает с ним. Иначе меню закроется в самый неподходящий момент.

### Пример проблемы без interest-delay
Рассмотрим боковую навигацию без использования `interest-delay`. Попробуйте навести курсор на компьютере на первый пункт меню "Дизайн", а после выбрать пятый пункт подменю "Гайдлайны". Вы не сможете этого сделать, так как путь вашего курсора проходить через второй пункт меню "Разработка", а значит вы уже взаимодейсвуете с ним поэтому появится подменю разработки. По сути вам нужно пройти следующий путь:
- Навести курсор на первый пункт меню "Дизайн";
- Далее очень аккуратно переместить курсор на первый пункт подменю "Цветовые схемы";
- После перевести курсор ровно вниз на последний пункт подменю "Гайдлайны".

Правда ведь удобно? 😁

<style>
  .menu-group {
    position: relative;
    margin: 0 10px 8px;
  }

  .sidebar {
    width: 220px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    overflow: visible; /* важно: не обрезать подменю */
    padding: 12px 0;
  }

  .menu-item {
    display: block;
    padding: 14px 20px;
    cursor: pointer;
    color: #2d3748;
    font-weight: 500;
    transition: all 0.25s ease;
    border-radius: 12px;
    text-decoration: none;
    position: relative;
  }

  .menu-item:hover,
  .menu-group:hover .menu-item {
    background-color: #edf2f7;
    color: #4299e1;
  }

  .submenu {
    position: absolute;
    top: 0;
    left: calc(100% + 12px);
    background: #ffffff;
    border-radius: 14px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    min-width: 190px;
    padding: 10px 0;
    z-index: 20;
    opacity: 0;
    visibility: hidden;
    transform: translateX(-10px);
    transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
  }

  .menu-group:hover .submenu {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }

  .submenu-item {
    display: block;
    padding: 12px 20px;
    color: #4a5568;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.2s ease;
    border-radius: 10px;
    margin: 0 8px 4px;
  }

  .submenu-item:hover {
    background-color: #ebf8ff;
    color: #3182ce;
  }

  /* Стрелка */
  .menu-item::after {
    content: "▸";
    position: absolute;
    right: 20px;
    color: #a0aec0;
    font-size: 16px;
    transition: color 0.2s;
  }

  .menu-group:hover .menu-item::after {
    color: #4299e1;
  }

  /* Стили для контейнера примера */
  .example-container {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    padding: 24px;
    margin: 32px 0;
    position: relative;
    border: 1px solid #e2e8f0;
  }

  .example-label {
    position: absolute;
    top: -12px;
    left: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
</style>

<div class="example-container">
  <div class="example-label">Пример</div>
  <div class="sidebar">
  <div class="menu-group">
    <a href="#" class="menu-item">Дизайн</a>
    <div class="submenu">
      <a href="#" class="submenu-item">Цветовые схемы</a>
      <a href="#" class="submenu-item">Типографика</a>
      <a href="#" class="submenu-item">Иконки</a>
      <a href="#" class="submenu-item">Компоненты</a>
      <a href="#" class="submenu-item">Гайдлайны</a>
    </div>
  </div>

  <div class="menu-group">
    <a href="#" class="menu-item">Разработка</a>
    <div class="submenu">
      <a href="#" class="submenu-item">HTML & CSS</a>
      <a href="#" class="submenu-item">JavaScript</a>
      <a href="#" class="submenu-item">Astro</a>
      <a href="#" class="submenu-item">API</a>
      <a href="#" class="submenu-item">Тестирование</a>
    </div>
  </div>
</div>
</div>

`interest-delay` позволяет решить эту проблему, так как вы сможете задать задержку для появления и исчезновения подменю.

```css
.sidebar {
  interest-delay: 200ms 400ms;
}
```

### Как управлять задержками?
Для управления этими задержками в CSS существуют специальные свойства:
- **`interest-delay-start`** — задаёт, сколько времени должно пройти после того, как пользователь начал проявлять интерес, прежде чем элемент «официально» получит этот интерес.
- **`interest-delay-end`** — задаёт, сколько времени должно пройти после того, как пользователь перестал проявлять интерес, прежде чем элемент «официально» потеряет его.

Также есть сокращённое свойство:
- **`interest-delay`** — позволяет задать обе задержки сразу.

### Возможные значения
Оба свойства (`interest-delay-start` и `interest-delay-end`) принимают следующие значения:
- **`normal`** — браузер сам определяет задержку, исходя из платформенных соглашений.
  ⚠️ Важно: эти задержки **никогда не равны нулю**. Они могут отличаться друг от друга и даже зависеть от способа проявления интереса (например, наведение мыши и долгое нажатие могут иметь разные задержки).

- **`<time>`** — вы сами указываете длительность задержки в миллисекундах (`ms`) или секундах (`s`). Например: `200ms`, `0.5s`.

### Как работает сокращённая запись?
Свойство `interest-delay` работает так же, как и другие сокращённые свойства в CSS:

- Если указано **одно значение**, оно применяется и к началу, и к окончанию задержки:
  ```css
  interest-delay: 300ms;
  /* то же самое, что:
     interest-delay-start: 300ms;
     interest-delay-end: 300ms; */
  ```

- Если указано **два значения**, первое относится к началу, второе — к окончанию:
  ```css
  interest-delay: 200ms 500ms;
  /* то же самое, что:
     interest-delay-start: 200ms;
     interest-delay-end: 500ms; */
  ```

### Дополнительные сведения
- **Применяется ко всем элементам**.
- **Наследуется** от родительских элементов.
- **Не поддерживает проценты**.
- **Анимируется** по вычисленному значению (computed value).

### Что будет в будущем?
Возможно, синтаксис этих свойств расширят, чтобы можно было задавать разные задержки в зависимости от типа взаимодействия. Например, одна задержка для наведения курсора, другая — для долгого нажатия на сенсорном экране.
