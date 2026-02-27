import { create } from 'zustand';
import type { Fuel, FuelId } from '@/entities/fuel/model/types';
import type { Pump } from '@/entities/pump/model/types';
import type { Order } from '@/entities/order/model/types';

/**
 * Описываем структуру нашего глобального хранилища (Store)
 */
interface FuelFlowState {
  // Данные (State)
  fuels: Record<FuelId, Fuel>;
  pumps: Pump[];
  orders: Order[];
  
  // Функции для изменения данных (Actions) — их пропишем чуть позже
}

/**
 * Создаем хук useFuelStore, который даст доступ к данным любому компоненту
 */
export const useFuelStore = create<FuelFlowState>(() => ({
  // 1. Склад топлива
  fuels: {
    'ai-92': { id: 'ai-92', name: 'АИ-92 Эко', price: 48.5, remains: 2500, capacity: 5000 },
    'ai-95': { id: 'ai-95', name: 'АИ-95 Премиум', price: 53.2, remains: 1800, capacity: 5000 },
    'ai-98': { id: 'ai-98', name: 'АИ-98 Спорт', price: 62.1, remains: 900, capacity: 3000 },
    'diesel': { id: 'diesel', name: 'ДТ Евро-6', price: 58.4, remains: 3500, capacity: 10000 },
  },
  
  // 2. Список физических колонок
  pumps: [
    { id: 'p1', number: 1, status: 'available', availableFuels: ['ai-92', 'ai-95'] },
    { id: 'p2', number: 2, status: 'available', availableFuels: ['ai-95', 'ai-98'] },
    { id: 'p3', number: 3, status: 'available', availableFuels: ['ai-95', 'diesel'] },
    { id: 'p4', number: 4, status: 'available', availableFuels: ['diesel'] },
  ],
  
  // 3. Очередь активных транзакций (пока пуста)
  orders: [],
}));
