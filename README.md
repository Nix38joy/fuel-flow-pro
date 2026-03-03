FuelFlow Pro | Enterprise Fuel Management System
FuelFlow Pro — это высокотехнологичная ERP-система для управления автозаправочными станциями. Проект демонстрирует внедрение сложной бизнес-логики, работу с асинхронными процессами в реальном времени и масштабируемую архитектуру.
Key Features
Real-time Monitoring: 15-секундные циклы заправки с живыми счетчиками литров и стоимости.
Inventory Management: Автоматическое списание топлива из резервуаров и система Hard Limit (блокировка при остатке < 50л).
Smart Validation: Валидация заказов на основе текущих складских остатков.
Transaction Logging: Реактивная история операций с пружинными анимациями (Framer Motion).
Data Persistence: Сохранение состояния сессии в LocalStorage (Zustand Persist).
Tech Stack & Architecture
Framework: React 18 + Vite
Language: TypeScript (Strict Mode)
State Management: Zustand (Middlewares: Persist)
Architecture: Feature-Sliced Design (FSD) — четкое разделение на слои (Shared, Entities, Features, Widgets, App).
UI & Animation: CSS Modules, Lucide Icons, Framer Motion.
Project Structure (FSD)
src/app — Инициализация приложения и глобальный Store.
src/widgets — Крупные блоки (Список колонок, Монитор склада, История).
src/features — Пользовательские сценарии (Форма заправки + валидация).
src/entities — Бизнес-сущности (Топливо, Колонки, Заказы).
src/common (Shared) — Переиспользуемые UI-компоненты и базовые типы.
Installation & Setup
Clone the repository: git clone ...
Install dependencies: npm install
Run dev server: npm run dev
Build for production: npm run build
Developed by Nix38joy — Frontend Engineer with deep Domain Expertise in Fuel Retail.