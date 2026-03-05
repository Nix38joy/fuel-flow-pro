⛽ FuelFlow Pro | Enterprise Resource Management System
FuelFlow Pro — профессиональная ERP-система для управления заправочными станциями в режиме реального времени. Проект ориентирован на решение сложных задач синхронизации асинхронных состояний, управление ресурсами и обеспечение целостности данных.
🛠 Ключевые инженерные решения
State Machine Control: Реализована управляемая машина состояний процесса заправки (Filling / Paused / Completed). Поддержка возобновления операций (Resume) с сохранением прогресса и пересчетом временных меток без потери точности. [INDEX: 1, 3]
Data Integrity Guard: Внедрена логика блокировки критических действий (закрытие смены) при наличии активных транзакций для предотвращения утечек данных и расхождения отчетов. [INDEX: 4]
Real-time Engine: Динамический расчет пролива топлива (1л/сек) с мгновенным обновлением складских остатков и финансовых показателей в глобальном сторе. [INDEX: 1]
Industrial UX/UI: Кастомная система модальных окон для отчетов, обработка пустых состояний (Empty States) и адаптивная панель управления заправкой. [INDEX: 5]
🏗 Архитектура (FSD Implementation)
Проект строго следует методологии Feature-Sliced Design, обеспечивая изоляцию логики и масштабируемость:
Entities: Бизнес-сущности (Заказ, Колонка, Топливо) с жесткой типизацией. [INDEX: 2]
Features: Изолированные сценарии заправки и управления состоянием сессии.
Widgets: Композиционные узлы (Мониторинг склада, Интерактивная история операций).
Shared/Common: Универсальный UI-кит (Modal, ProgressBar, EmptyState).
💻 Технологический стек
Core: React 18, TypeScript (Strict Mode, verbatimModuleSyntax).
State: Zustand + Persist Middleware (Session recovery).
Animation: Framer Motion (Layout transitions, AnimatePresence).
Tooling: Vite, Lucide React.
📦 Быстрый старт
git clone https://github.com
npm install && npm run dev
