# Project builder v2.0.0
Qualitika. Внутренний сборщик вёрстки (HTML(PUG)/CSS(SCSS)/JS).

## Установка

Требуются установленный [git](https://git-scm.com/) и [Node.js (LTS)](https://nodejs.org/en/) не ниже 18 версии

1. Клонировать репозиторий (дополнительные настройки для VS Code на Windows смотрите ниже).
2. Перейти в папку нового проекта (пример — `cd my-new-project`).
3. Удалить историю разработки: `rm -rf .git`
4. Установить зависимости проекта: `npm i`.

В редакторе кода или IDE установить (если не установлены) и включить плагины [EsLint](https://eslint.org/), [Stylelint](https://stylelint.io/), [EditorConfig](https://editorconfig.org/) и [Prettier](https://prettier.io/).

## Настройка для VS Code на Windows:

1. Настройки Git: `git config --global core.autocrlf input`
2. Склонировать репозиторий
3. Настройки VS Code:
- `Files: EOL` — `\n`,
- `Editor: Default Formatter` — `Prettier — Code formatter`
4. Настройки плагина Prettier:
- `Prettier: End of Line` — `lf`,
- `Prettier: Config Path` — `.prettierrc.json`
5. Настройки плагина EditorConfig: `Generate Auto` — `false`

Автоформатирование доступно по сочетанию клавиш — Shift + Alt + F (можно настроить форматирование при сохранении файла).
