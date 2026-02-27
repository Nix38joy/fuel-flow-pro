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
  
  createOrder: (pumpId: string, fuelId: FuelId, liters: number) => void;
    cancelOrder: (orderId: string) => void;
    completeOrder: (orderId: string) => void;
}


/**
 * Создаем хук useFuelStore, который даст доступ к данным любому компоненту
 */
export const useFuelStore = create<FuelFlowState>((set) => ({
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
createOrder: (pumpId, fuelId, liters) => set((state) => {
    const fuel = state.fuels[fuelId as FuelId];
    const totalPrice = fuel.price * liters;

    const newOrder: Order = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(), 
        pumpId,
        fuelType: fuelId,
        requestedLiters: liters,
        filledLiters: 0,
        pricePerLiter: fuel.price,
        totalPrice,
        status: 'pending',
        createdAt: Date.now(),
        
    };

    setTimeout(() => {
        const { completeOrder } = useFuelStore.getState();
        completeOrder(newOrder.id);
    }, 15000);

    return {
        orders: [...state.orders, newOrder],
        pumps: state.pumps.map(p =>
            p.id === pumpId ? { ...p, status: 'filling' as const, currentOrderId: newOrder.id} : p
        )
    };
}),
        completeOrder: (orderId) => set((state) => {
            const order = state.orders.find(o => o.id === orderId);
            if (!order) return state;

            return {
                fuels: {
                    ...state.fuels,
                    [order.fuelType]: {
                        ...state.fuels[order.fuelType],
                        remains: state.fuels[order.fuelType].remains - order.requestedLiters
                    }
                },
                pumps: state.pumps.map(p =>
                    p.currentOrderId === orderId ? { ...p, status: 'available' as const, currentOrderId: undefined } : p
                ),

                orders: state.orders.map(o => 
                    o.id === orderId ? {...o, status: 'completed' as const, filledLiters: o.requestedLiters } : o
                )
            };
        }),




    cancelOrder: (id) => set((state) => ({
    orders: state.orders.filter(o => o.id !== id),
    pumps: state.pumps.map(p => 
    p.currentOrderId === id ? { ...p, status: 'available' as const, currentOrderId: undefined } : p
      )
    })),
  }));





