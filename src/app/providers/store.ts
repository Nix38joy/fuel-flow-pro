import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Fuel, FuelId } from '@/entities/fuel/model/types';
import type { Pump } from '@/entities/pump/model/types';
import type { Order } from '@/entities/order/model/types';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

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
        'ai-92': { id: 'ai-92', name: 'АИ-92', price: 48.5, remains: 2500, capacity: 5000 },
        'ai-95': { id: 'ai-95', name: 'АИ-95', price: 55.2, remains: 1800, capacity: 5000 },
        'ai-98': { id: 'ai-98', name: 'АИ-98', price: 62, remains: 900, capacity: 3000 },
        'diesel': { id: 'diesel', name: 'ДТ Евро-6', price: 72.4, remains: 3500, capacity: 10000 },
      },
      pumps: [
        { id: 'p1', number: 1, status: 'available', availableFuels: ['ai-92', 'ai-95'] },
        { id: 'p2', number: 2, status: 'available', availableFuels: ['ai-95', 'ai-98'] },
        { id: 'p3', number: 3, status: 'available', availableFuels: ['ai-95', 'diesel'] },
        { id: 'p4', number: 4, status: 'available', availableFuels: ['diesel'] },
      ],
      orders: [],

      createOrder: (pumpId, fuelId, liters) => set((state) => {
        const pump = state.pumps.find((p) => p.id === pumpId);
        const fuel = state.fuels[fuelId];
        const normalizedLiters = Number((Number.isFinite(liters) ? liters : 0).toFixed(2));

        if (!pump || !fuel) return state;
        if (pump.status !== 'available' || pump.currentOrderId) return state;
        if (!pump.availableFuels.includes(fuelId)) return state;
        if (normalizedLiters <= 0 || fuel.remains < normalizedLiters) return state;

        const REFUEL_SPEED = 1000; 
        const duration = normalizedLiters * REFUEL_SPEED;

        const newOrder: Order = {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
          pumpId,
          fuelType: fuelId,
          requestedLiters: normalizedLiters,
          filledLiters: 0,
          pricePerLiter: fuel.price,
          totalPrice: fuel.price * normalizedLiters,
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
        if (order.duration <= 0 || order.requestedLiters <= 0) return state;

        const elapsedSinceStart = Date.now() - order.createdAt;
        const progress = clamp(elapsedSinceStart / order.duration, 0, 1);
        const currentFilledLiters = Number((order.requestedLiters * progress).toFixed(2));

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
        if (order.duration <= 0 || order.requestedLiters <= 0) return state;

        // Рассчитываем новый createdAt так, чтобы прогресс продолжился с того же места
        if (order.requestedLiters <= 0) return state;

        const safeFilledLiters = clamp(order.filledLiters, 0, order.requestedLiters);
        const alreadyFilledPercent = safeFilledLiters / order.requestedLiters;
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
        const fuel = state.fuels[order.fuelType];
        if (!fuel) return state;
        if (order.duration <= 0 || order.requestedLiters <= 0) return state;

        // При форс-завершении во время filling учитываем фактический прогресс, а не полный объем.
        const finalLitersRaw = order.status === 'paused'
          ? order.filledLiters
          : order.requestedLiters * clamp((Date.now() - order.createdAt) / order.duration, 0, 1);
        const finalLiters = Number(clamp(finalLitersRaw, 0, Math.min(order.requestedLiters, fuel.remains)).toFixed(2));
        const finalPrice = Number((finalLiters * order.pricePerLiter).toFixed(2));

        return {
          fuels: {
            ...state.fuels,
            [order.fuelType]: {
              ...fuel,
              remains: Number((fuel.remains - finalLiters).toFixed(2))
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
        orders: state.orders.map((o) =>
          o.id === id ? { ...o, status: 'cancelled' as const } : o
        ),
        pumps: state.pumps.map(p => 
          p.currentOrderId === id ? { ...p, status: 'available' as const, currentOrderId: undefined } : p
        )
      })),

      resetStore: () => {
        const hasActiveOrders = get().orders.some(
          (order) => order.status === 'filling' || order.status === 'paused'
        );
        if (hasActiveOrders) return;
        localStorage.removeItem('fuel-flow-storage');
        window.location.reload();
      },
    }),
    { name: 'fuel-flow-storage' }
  )
);






