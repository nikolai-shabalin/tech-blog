---
title: "CSS Snapshot 2026: Гид по миру современного CSS"
description: "Разбираемся, что такое CSS Snapshot, зачем он нужен и как классифицирует все модули CSS — от стабильных рекомендаций до экспериментальных фич. Просто о сложном документе W3C."
pubDate: "Mar 11 2026"
---

Если вы только начинаете свой путь в веб-разработке, изучение CSS может показаться бесконечным путешествием. С каждым годом [появляются новые свойства, функции и возможности](https://nikolai-shabalin.github.io/css-properties/). Как же разработчикам браузеров (Chrome, Firefox, Safari) и веб-программистам понять, что именно на данный момент считается «официальным» CSS, а что является лишь экспериментальной функцией?

Для ответа на этот вопрос существует специальный документ под названием [**CSS Snapshot**](https://www.w3.org/TR/css-2026/).

### Зачем нужен CSS Snapshot?

Представьте, что CSS — это огромный живой организм, который постоянно развивается. Новые модули (части языка) находятся на разных стадиях разработки: какие-то уже готовы и работают везде, какие-то ещё тестируются, а какие-то только обсуждаются.

**CSS Snapshot** — это ежегодный «снимок» (snapshot) состояния этого организма. Его основная задача — собрать в одном месте все спецификации (документы с правилами), которые на текущий момент формируют актуальную версию CSS.

Этот документ отвечает на ключевые вопросы:
1.  **Что именно сейчас считается CSS?** Какие технологии официально входят в язык?
2.  **Насколько стабильна та или иная функция?** Могу ли я использовать её в коммерческом проекте, или это «сырая» экспериментальная фишка?
3.  **Как разработчикам браузеров правильно внедрять новые возможности?** Чтобы не сломать старые сайты и не создавать хаос в будущем.

Простыми словами, это «дорожная карта» и «устав» CSS в одном флаконе.

---

Давайте разберём содержание документа «CSS Snapshot 2026» простыми словами.

### Часть 1: Как мы дошли до жизни такой?

Раньше всё было просто: был CSS Level 1 (один большой документ), потом CSS Level 2 (тоже одна толстая книга). Но дальше так развиваться стало невозможно. Слишком много идей, слишком много новых фич. Поэтому индустрия перешла на **модульный принцип**.

Теперь у нас нет единой спецификации «CSS 3» или «CSS 4». Вместо этого есть много маленьких модулей: «Модуль флексов, «Модуль гридов», «Модуль анимации» и так далее. У каждого модуля своя версия (3, 4, 5 уровень). Кто-то может сказать: «Выучи CSS 3». На самом деле это значит «выучи набор модулей, которые вместе образуют современный стандарт». CSS Snapshot как раз и определяет этот набор.

### Часть 2: Готовность

Самое интересное в документе — это классификация всех существующих CSS-модулей по степени их стабильности и готовности к использованию.
#### 1. Официальное определение CSS

Это основа основ. Те модули, которые прошли огонь, воду и медные трубы, имеют статус **Recommendation (REC)**. Их можно и нужно использовать, они стабильны. Полный список из Snapshot 2026:
- CSS Level 2, последняя версия
- CSS Syntax Module Level 3
- CSS Style Attributes
- Media Queries Level 3
- CSS Conditional Rules Module Level 3
- Selectors Level 3
- CSS Namespaces Module Level 3
- CSS Cascading and Inheritance Level 4
- CSS Values and Units Module Level 3
- CSS Custom Properties for Cascading Variables Module Level 1
- CSS Box Model Module Level 3
- CSS Color Module Level 4
- CSS Backgrounds and Borders Module Level 3
- CSS Images Module Level 3
- CSS Fonts Module Level 3
- CSS Writing Modes Level 3
- CSS Multi-column Layout Module Level 1
- CSS Flexible Box Layout Module Level 1
- CSS Basic User Interface Module Level 3
- CSS Containment Module Level 1
- CSS Transforms Module Level 1
- Compositing and Blending Level 1
- CSS Easing Functions Level 1
- CSS Counter Styles Level 3

#### 2. Надежные кандидаты

Модули, которые уже стабильны, имеют хорошую поддержку в браузерах, но формально ещё не дошли до финальной стадии. Использовать их — можно и нужно, но стоит следить за мелкими правками. Полный список:
- Media Queries Level 4
- CSS Scroll Snap Module Level 1
- CSS Scrollbars Styling Module Level 1
- CSS Grid Layout Module Level 1
- CSS Grid Layout Module Level 2
- CSS Cascading and Inheritance Module Level 5
- CSS Color Adjustment Module Level 1
- CSS Conditional Rules Module Level 4

#### 3. Достаточно стабильные

Модули, дизайн которых готов, но у разработчиков браузеров пока мало опыта их внедрения, а у веб-разработчиков — мало тестов. Они вот-вот войдут в «официальный» состав. Полный список:
- CSS Display Module Level 3
- CSS Writing Modes Level 4
- CSS Fragmentation Module Level 3
- CSS Box Alignment Module Level 3
- CSS Shapes Module Level 1
- CSS Text Module Level 3
- CSS Text Decoration Module Level 3
- CSS Masking Module Level 1
- CSS Speech Module Level 1
- CSS View Transitions Module Level 1

#### 4. Модули с «грубой совместимостью»

Это интересная категория. Многие современные фичи (анимации, фильтры, объектная модель CSSOM) уже давно и широко используются в интернете. Они работают во всех браузерах, но их внутреннее устройство описано в спецификациях недостаточно подробно или содержит ошибки. Грубо говоря, разработчики браузеров скопировали поведение друг друга, но чёткого стандарта пока нет.

Сюда входят:
- CSS Transitions
- CSS Animations Level 1
- CSS Will Change Module Level 1
- Filter Effects Module Level 1
- CSS Font Loading Module Level 3
- CSS Box Sizing Module Level 3
- CSS Transforms Module Level 2
- CSS Lists and Counters Module Level 3
- CSS Logical Properties and Values Level 1
- CSS Positioned Layout Module Level 3
- Resize Observer
- Web Animations
- CSS Fonts Module Level 4
- Motion Path Module Level 1
- CSS Scroll Anchoring Module Level 1
- CSS Object Model (CSSOM)
- CSS Color Module Level 5
- Selectors Level 4
- CSS Containment Module Level 2
- CSSOM View Module
- Geometry Interfaces Module Level 1

### Часть 3: Правила для браузеров

Этот раздел — инструкция для создателей браузеров, как не устроить хаос.

1.  **Не ломайте сайты.** Если браузер не понимает какое-то CSS-свойство, он должен его просто проигнорировать, а не сломать всю страницу.
2.  **Эксперименты — под замком.** Хотите добавить новую крутую фичу, которая ещё не утверждена? Прячьте её под флаг в настройках браузера или выдавайте только тестировщикам. Нельзя пускать «недоделку» в продакшн, иначе сайты начнут на неё опираться, а потом её придётся менять.
3.  **Вендорные префиксы.** Раньше браузеры добавляли свои приставки (`-webkit-`, `-moz-`). Сейчас подход меняется. Если фича ещё нестабильна, но её уже выпустили в свет, браузеры должны поддерживать и префиксную, и обычную версию одновременно, чтобы потом плавно отказаться от префикса.

### Часть 4: Исключения

Иногда фича становится настолько нужной и очевидной, что сообщество разрешает её использование **до** официального утверждения стандарта. В CSS Snapshot 2026 есть целый список таких «счастливчиков». Полный список исключений:
- Flow-relative эквиваленты для sizing-свойств (`width`, `height` и т.д.), border, margin и padding (из CSS Logical Properties).
- Ключевые слова `min-content` и `max-content` для sizing-свойств.
- Градиентная функция `conic-gradient()`.
- Свойство `aspect-ratio`.
- Свойства `translate`, `rotate`, `scale`.
- Свойство `hyphenate-character`.
- Функция `color-mix()`.
- Тип `<color-interpolation-method>` для интерполяции linear/radial/conic gradients.
- Синтаксис relative color.
- `request url modifiers` (CSS Values 5).
- Media features из Media Queries 5: `display-modes`, `dynamic-range`, `scripting`, `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast`, `forced-colors`, `prefers-color-scheme`.
- Функции `font-tech()` и `font-format()` (CSS Conditional 5).
- Псевдоклассы `:is()`, `:where()`, `:has()` и списки селекторов в `:not()`.
- `text-decoration-thickness`, `text-underline-offset` и значение `from-font` для `text-underline-position`.
- Псевдоэлемент `::marker`.
- Свойства `text-box-trim`, `text-box-edge` и сокращение `text-box`.
- Функция `env()`, включая переменные `safe-area-inset-*`.
- Псевдоклассы `:scope`, `:defined`, `:focus-within`, `:dir()`, `:any-link`, `:open`, `:popover-open`, `:modal`, `:fullscreen`, `:placeholder-shown`, `:default`, `:valid`, `:invalid`, `:required`, `:optional`, а также selector lists в `:nth-child()` и `:nth-last-child()`.
- Свойство `accent-color` и значение `auto` для `outline-color`.
- Всё из CSS Animations Level 1 и CSS Transitions Level 1.



**CSS Snapshot 2026** — это не учебник по CSS для новичков. Это важнейший документ для профессионалов. Если вы разработчик браузера, он говорит вам: «Вот что вы должны поддерживать». Если вы веб-разработчик, он даёт вам уверенность: «Вот эти фичи можно использовать смело, они являются частью официального языка, а не чьей-то экспериментальной поделкой».
