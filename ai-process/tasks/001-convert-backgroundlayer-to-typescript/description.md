# Задача: конвертация BackgroundLayer в TypeScript

## Суть задачи
Переписать содержимое файла `src/components/BackgroundLayer.tsx` с JavaScript на TypeScript. Нужно сохранить текущую логику компонента, добавив строгие типы для пропсов, состояния и событий, чтобы компонент корректно компилировался в текущей TypeScript-конфигурации проекта.

## Детали и требования
- Оставить существующую реализацию компонента без изменений в логике.
- Добавить интерфейс `Background` с полями `image`, `x`, `y`, `scale`, `opacity` и `draggable`.
- Добавить интерфейс `BackgroundLayerProps` с полями `background` и `setBackground`.
- Типизировать `useState` для `isDragging` как `boolean`.
- Типизировать обработчик `handleMouseMove` как `React.MouseEvent<HTMLImageElement>`.
- Переписать сигнатуру компонента с явными типами пропсов.
- Не менять другие файлы проекта; задача касается только `src/components/BackgroundLayer.tsx`.

## Контекст
В проекте используется Vite + React с TypeScript, и файл `BackgroundLayer.tsx` был найден без явных типов пропсов. В `App.jsx` передается объект `background` со значениями `image`, `x`, `y`, `scale`, `opacity` и `draggable`.

## Открытые вопросы
- Нет открытых вопросов: задача ограничена одной компонентой и типизацией её пропсов/состояния.
