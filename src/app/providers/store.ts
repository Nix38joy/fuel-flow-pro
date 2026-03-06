import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FuelId } from '@/entities/fuel/model/types';
import type { ActionResult } from '@/app/use-cases/refuel';
import { canCloseShift, cancelRefuel, completeRefuel, pauseRefuel, resumeRefuel, startRefuel } from '@/app/use-cases/refuel';
import { createInitialFuelFlowData, type FuelFlowData } from './initialState';

export interface FuelFlowState extends FuelFlowData {
  createOrder: (pumpId: string, fuelId: FuelId, liters: number) => ActionResult<FuelFlowData>;
  pauseOrder: (pumpId: string) => ActionResult<FuelFlowData>;
  resumeOrder: (pumpId: string) => ActionResult<FuelFlowData>;
  completeOrder: (orderId: string) => ActionResult<FuelFlowData>;
  cancelOrder: (orderId: string) => ActionResult<FuelFlowData>;
  resetStore: () => ActionResult<void>;
}

const makeOrderId = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

export const useFuelStore = create<FuelFlowState>()(
  persist(
    (set, get) => ({
      ...createInitialFuelFlowData(),

      createOrder: (pumpId, fuelId, liters) => {
        let result: ActionResult<FuelFlowData> = { ok: false, error: 'Не удалось создать заказ' };
        set((state) => {
          result = startRefuel(state, {
            pumpId,
            fuelId,
            liters,
            now: Date.now(),
            orderId: makeOrderId(),
          });
          return result.ok ? result.data : state;
        });
        return result;
      },

      pauseOrder: (pumpId) => {
        let result: ActionResult<FuelFlowData> = { ok: false, error: 'Не удалось поставить на паузу' };
        set((state) => {
          result = pauseRefuel(state, { pumpId, now: Date.now() });
          return result.ok ? result.data : state;
        });
        return result;
      },

      resumeOrder: (pumpId) => {
        let result: ActionResult<FuelFlowData> = { ok: false, error: 'Не удалось возобновить заправку' };
        set((state) => {
          result = resumeRefuel(state, { pumpId, now: Date.now() });
          return result.ok ? result.data : state;
        });
        return result;
      },

      completeOrder: (orderId) => {
        let result: ActionResult<FuelFlowData> = { ok: false, error: 'Не удалось завершить заказ' };
        set((state) => {
          result = completeRefuel(state, { orderId, now: Date.now() });
          return result.ok ? result.data : state;
        });
        return result;
      },

      cancelOrder: (orderId) => {
        let result: ActionResult<FuelFlowData> = { ok: false, error: 'Не удалось отменить заказ' };
        set((state) => {
          result = cancelRefuel(state, { orderId });
          return result.ok ? result.data : state;
        });
        return result;
      },

      resetStore: () => {
        const closeResult = canCloseShift(get());
        if (!closeResult.ok) return closeResult;
        localStorage.removeItem('fuel-flow-storage');
        set(createInitialFuelFlowData());
        return { ok: true, data: undefined };
      },
    }),
    { name: 'fuel-flow-storage' }
  )
);






