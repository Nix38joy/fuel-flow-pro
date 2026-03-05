import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Fuel, FuelId } from '@/entities/fuel/model/types';
import type { Pump } from '@/entities/pump/model/types';
import type { Order } from '@/entities/order/model/types';

interface FuelFlowState {
  fuels: Record<FuelId, Fuel>;
  pumps: Pump[];
  orders: Order[];
  createOrder: (pumpId: string, fuelId: FuelId, liters: number) => void;
  pauseOrder: (pumpId: string) => void;
  resumeOrder: (pumpId: string) => void;
  completeOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  resetStore: () => void;
}

export const useFuelStore = create<FuelFlowState>()(
  persist(
    (set, get) => ({
      fuels: {
        'ai-92': { id: 'ai-92', name: 'АИ-92 Эко', price: 48.5, remains: 2500, capacity: 5000 },
        'ai-95': { id: 'ai-95', name: 'АИ-95 Премиум', price: 53.2, remains: 1800, capacity: 5000 },
        'ai-98': { id: 'ai-98', name: 'АИ-98 Спорт', price: 62.1, remains: 900, capacity: 3000 },
        'diesel': { id: 'diesel', name: 'ДТ Евро-6', price: 58.4, remains: 3500, capacity: 10000 },
      },
      pumps: [
        { id: 'p1', number: 1, status: 'available', availableFuels: ['ai-92', 'ai-95'] },
        { id: 'p2', number: 2, status: 'available', availableFuels: ['ai-95', 'ai-98'] },
        { id: 'p3', number: 3, status: 'available', availableFuels: ['ai-95', 'diesel'] },
        { id: 'p4', number: 4, status: 'available', availableFuels: ['diesel'] },
      ],
      orders: [],

      createOrder: (pumpId, fuelId, liters) => set((state) => {
        const fuel = state.fuels[fuelId as FuelId];
        const REFUEL_SPEED = 1000; 
        const duration = liters * REFUEL_SPEED;

        const newOrder: Order = {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
          pumpId,
          fuelType: fuelId,
          requestedLiters: liters,
          filledLiters: 0,
          pricePerLiter: fuel.price,
          totalPrice: fuel.price * liters,
          status: 'filling' as const,
          createdAt: Date.now(),
          duration: duration,
        };

        return {
          orders: [...state.orders, newOrder],
          pumps: state.pumps.map(p => 
            p.id === pumpId ? { ...p, status: 'filling' as const, currentOrderId: newOrder.id } : p
          )
        };
      }),

      pauseOrder: (pumpId) => set((state) => {
        const pump = state.pumps.find(p => p.id === pumpId);
        const order = state.orders.find(o => o.id === pump?.currentOrderId);
        
        if (!order || order.status !== 'filling') return state;

        const elapsedSinceStart = Date.now() - order.createdAt;
        const currentFilledLiters = Number((order.requestedLiters * (elapsedSinceStart / order.duration)).toFixed(2));

        return {
          orders: state.orders.map(o => 
            o.id === order.id 
              ? { ...o, status: 'paused' as const, filledLiters: currentFilledLiters } 
              : o
          )
        };
      }),

      resumeOrder: (pumpId) => set((state) => {
        const pump = state.pumps.find(p => p.id === pumpId);
        const order = state.orders.find(o => o.id === pump?.currentOrderId);
        
        if (!order || order.status !== 'paused') return state;

        // Рассчитываем новый createdAt так, чтобы прогресс продолжился с того же места
        const alreadyFilledPercent = order.filledLiters / order.requestedLiters;
        const timeAlreadySpent = order.duration * alreadyFilledPercent;
        const newCreatedAt = Date.now() - timeAlreadySpent;

        return {
          orders: state.orders.map(o => 
            o.id === order.id ? { ...o, status: 'filling' as const, createdAt: newCreatedAt } : o
          )
        };
      }),

      completeOrder: (orderId) => set((state) => {
        const order = state.orders.find(o => o.id === orderId);
        if (!order || (order.status !== 'filling' && order.status !== 'paused')) return state;

        // Если нажали "Итог" на паузе, берем filledLiters, если дождались конца — requestedLiters
        const finalLiters = order.status === 'paused' ? order.filledLiters : order.requestedLiters;
        const finalPrice = Number((finalLiters * order.pricePerLiter).toFixed(2));

        return {
          fuels: {
            ...state.fuels,
            [order.fuelType as FuelId]: {
              ...state.fuels[order.fuelType as FuelId],
              remains: state.fuels[order.fuelType as FuelId].remains - finalLiters
            }
          },
          pumps: state.pumps.map(p => 
            p.currentOrderId === orderId ? { ...p, status: 'available' as const, currentOrderId: undefined } : p
          ),
          orders: state.orders.map(o => 
            o.id === orderId ? { ...o, status: 'completed' as const, filledLiters: finalLiters, totalPrice: finalPrice } : o
          )
        };
      }),

      cancelOrder: (id) => set((state) => ({
        orders: state.orders.filter(o => o.id !== id),
        pumps: state.pumps.map(p => 
          p.currentOrderId === id ? { ...p, status: 'available' as const, currentOrderId: undefined } : p
        )
      })),

      resetStore: () => {
        localStorage.removeItem('fuel-flow-storage');
        window.location.reload();
      },
    }),
    { name: 'fuel-flow-storage' }
  )
);






