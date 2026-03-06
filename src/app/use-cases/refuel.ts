import type { FuelId } from '@/entities/fuel/model/types';
import type { Order } from '@/entities/order/model/types';
import type { PumpStatus } from '@/entities/pump/model/types';
import type { FuelFlowData } from '@/app/providers/initialState';

const REFUEL_SPEED_MS_PER_LITER = 1000;

type OrderStatus = Order['status'];

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  filling: ['paused', 'completed', 'cancelled'],
  paused: ['filling', 'completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const canTransition = (from: OrderStatus, to: OrderStatus) => allowedTransitions[from].includes(to);
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const round2 = (value: number) => Number(value.toFixed(2));

const releasePump = (pumpStatus: PumpStatus) => (pumpStatus === 'filling' ? 'available' : pumpStatus);

const withUpdatedOrder = (
  orders: Order[],
  orderId: string,
  updater: (order: Order) => Order
) => orders.map((order) => (order.id === orderId ? updater(order) : order));

const extract = (state: FuelFlowData): FuelFlowData => ({
  fuels: state.fuels,
  pumps: state.pumps,
  orders: state.orders,
});

export interface StartRefuelInput {
  pumpId: string;
  fuelId: FuelId;
  liters: number;
  now: number;
  orderId: string;
}

export const startRefuel = (state: FuelFlowData, input: StartRefuelInput): ActionResult<FuelFlowData> => {
  const data = extract(state);
  const pump = data.pumps.find((item) => item.id === input.pumpId);
  const fuel = data.fuels[input.fuelId];
  const liters = round2(Number.isFinite(input.liters) ? input.liters : 0);

  if (!pump) return { ok: false, error: 'Колонка не найдена' };
  if (!fuel) return { ok: false, error: 'Топливо не найдено' };
  if (pump.status !== 'available' || pump.currentOrderId) return { ok: false, error: 'Колонка занята' };
  if (!pump.availableFuels.includes(input.fuelId)) return { ok: false, error: 'Топливо недоступно на колонке' };
  if (liters <= 0) return { ok: false, error: 'Некорректный объем' };
  if (fuel.remains < liters) return { ok: false, error: 'Недостаточно топлива в резервуаре' };

  const duration = liters * REFUEL_SPEED_MS_PER_LITER;
  const newOrder: Order = {
    id: input.orderId,
    pumpId: input.pumpId,
    fuelType: input.fuelId,
    requestedLiters: liters,
    filledLiters: 0,
    pricePerLiter: fuel.price,
    totalPrice: round2(fuel.price * liters),
    status: 'filling',
    createdAt: input.now,
    duration,
  };

  return {
    ok: true,
    data: {
      ...data,
      orders: [...data.orders, newOrder],
      pumps: data.pumps.map((item) =>
        item.id === input.pumpId ? { ...item, status: 'filling', currentOrderId: newOrder.id } : item
      ),
    },
  };
};

export const pauseRefuel = (
  state: FuelFlowData,
  input: { pumpId: string; now: number }
): ActionResult<FuelFlowData> => {
  const data = extract(state);
  const pump = data.pumps.find((item) => item.id === input.pumpId);
  const order = data.orders.find((item) => item.id === pump?.currentOrderId);

  if (!order || !canTransition(order.status, 'paused')) return { ok: false, error: 'Нельзя поставить на паузу' };
  if (order.duration <= 0 || order.requestedLiters <= 0) return { ok: false, error: 'Заказ поврежден' };

  const progress = clamp((input.now - order.createdAt) / order.duration, 0, 1);
  const filledLiters = round2(order.requestedLiters * progress);

  return {
    ok: true,
    data: {
      ...data,
      orders: withUpdatedOrder(data.orders, order.id, (item) => ({
        ...item,
        status: 'paused',
        filledLiters,
      })),
    },
  };
};

export const resumeRefuel = (
  state: FuelFlowData,
  input: { pumpId: string; now: number }
): ActionResult<FuelFlowData> => {
  const data = extract(state);
  const pump = data.pumps.find((item) => item.id === input.pumpId);
  const order = data.orders.find((item) => item.id === pump?.currentOrderId);

  if (!order || !canTransition(order.status, 'filling')) return { ok: false, error: 'Нельзя возобновить' };
  if (order.duration <= 0 || order.requestedLiters <= 0) return { ok: false, error: 'Заказ поврежден' };

  const safeFilledLiters = clamp(order.filledLiters, 0, order.requestedLiters);
  const consumedTime = order.duration * (safeFilledLiters / order.requestedLiters);

  return {
    ok: true,
    data: {
      ...data,
      orders: withUpdatedOrder(data.orders, order.id, (item) => ({
        ...item,
        status: 'filling',
        createdAt: input.now - consumedTime,
      })),
    },
  };
};

export const completeRefuel = (
  state: FuelFlowData,
  input: { orderId: string; now: number }
): ActionResult<FuelFlowData> => {
  const data = extract(state);
  const order = data.orders.find((item) => item.id === input.orderId);

  if (!order || !canTransition(order.status, 'completed')) return { ok: false, error: 'Нельзя завершить заказ' };
  if (order.duration <= 0 || order.requestedLiters <= 0) return { ok: false, error: 'Заказ поврежден' };

  const fuel = data.fuels[order.fuelType];
  if (!fuel) return { ok: false, error: 'Топливо не найдено' };

  const filledRaw = order.status === 'paused'
    ? order.filledLiters
    : order.requestedLiters * clamp((input.now - order.createdAt) / order.duration, 0, 1);
  const finalLiters = round2(clamp(filledRaw, 0, Math.min(order.requestedLiters, fuel.remains)));
  const totalPrice = round2(finalLiters * order.pricePerLiter);

  return {
    ok: true,
    data: {
      ...data,
      fuels: {
        ...data.fuels,
        [order.fuelType]: {
          ...fuel,
          remains: round2(fuel.remains - finalLiters),
        },
      },
      pumps: data.pumps.map((item) =>
        item.currentOrderId === input.orderId
          ? { ...item, status: releasePump(item.status), currentOrderId: undefined }
          : item
      ),
      orders: withUpdatedOrder(data.orders, order.id, (item) => ({
        ...item,
        status: 'completed',
        filledLiters: finalLiters,
        totalPrice,
      })),
    },
  };
};

export const cancelRefuel = (
  state: FuelFlowData,
  input: { orderId: string }
): ActionResult<FuelFlowData> => {
  const data = extract(state);
  const order = data.orders.find((item) => item.id === input.orderId);
  if (!order || !canTransition(order.status, 'cancelled')) return { ok: false, error: 'Нельзя отменить заказ' };

  return {
    ok: true,
    data: {
      ...data,
      orders: withUpdatedOrder(data.orders, input.orderId, (item) => ({ ...item, status: 'cancelled' })),
      pumps: data.pumps.map((item) =>
        item.currentOrderId === input.orderId
          ? { ...item, status: releasePump(item.status), currentOrderId: undefined }
          : item
      ),
    },
  };
};

export const canCloseShift = (state: FuelFlowData): ActionResult<void> => {
  const hasActiveOrders = state.orders.some((order) => order.status === 'filling' || order.status === 'paused');
  if (hasActiveOrders) return { ok: false, error: 'Есть активные заправки' };
  return { ok: true, data: undefined };
};
