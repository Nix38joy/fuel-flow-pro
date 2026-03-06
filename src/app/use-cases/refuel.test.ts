import { describe, expect, it } from 'vitest';
import { createInitialFuelFlowData } from '@/app/providers/initialState';
import {
  canCloseShift,
  completeRefuel,
  pauseRefuel,
  resumeRefuel,
  startRefuel,
} from './refuel';

describe('refuel use-cases', () => {
  it('starts refuel and occupies pump', () => {
    const state = createInitialFuelFlowData();
    const result = startRefuel(state, {
      pumpId: 'p1',
      fuelId: 'ai-92',
      liters: 20,
      now: 1_000,
      orderId: 'o1',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.orders).toHaveLength(1);
    expect(result.data.pumps.find((item) => item.id === 'p1')?.status).toBe('filling');
    expect(result.data.pumps.find((item) => item.id === 'p1')?.currentOrderId).toBe('o1');
  });

  it('pauses and resumes keeping progress', () => {
    const started = startRefuel(createInitialFuelFlowData(), {
      pumpId: 'p1',
      fuelId: 'ai-92',
      liters: 10,
      now: 0,
      orderId: 'o1',
    });
    expect(started.ok).toBe(true);
    if (!started.ok) return;

    const paused = pauseRefuel(started.data, { pumpId: 'p1', now: 5_000 });
    expect(paused.ok).toBe(true);
    if (!paused.ok) return;
    expect(paused.data.orders[0].status).toBe('paused');
    expect(paused.data.orders[0].filledLiters).toBe(5);

    const resumed = resumeRefuel(paused.data, { pumpId: 'p1', now: 7_000 });
    expect(resumed.ok).toBe(true);
    if (!resumed.ok) return;
    expect(resumed.data.orders[0].status).toBe('filling');
    expect(resumed.data.orders[0].createdAt).toBe(2_000);
  });

  it('completes and deducts only filled liters on force finish', () => {
    const started = startRefuel(createInitialFuelFlowData(), {
      pumpId: 'p1',
      fuelId: 'ai-92',
      liters: 20,
      now: 0,
      orderId: 'o1',
    });
    expect(started.ok).toBe(true);
    if (!started.ok) return;

    const completed = completeRefuel(started.data, { orderId: 'o1', now: 5_000 });
    expect(completed.ok).toBe(true);
    if (!completed.ok) return;

    const order = completed.data.orders.find((item) => item.id === 'o1');
    expect(order?.status).toBe('completed');
    expect(order?.filledLiters).toBe(5);
    expect(completed.data.fuels['ai-92'].remains).toBe(2495);
    expect(completed.data.pumps.find((item) => item.id === 'p1')?.status).toBe('available');
  });

  it('prevents closing shift when active orders exist', () => {
    const started = startRefuel(createInitialFuelFlowData(), {
      pumpId: 'p1',
      fuelId: 'ai-92',
      liters: 10,
      now: 0,
      orderId: 'o1',
    });
    expect(started.ok).toBe(true);
    if (!started.ok) return;

    const closeResult = canCloseShift(started.data);
    expect(closeResult.ok).toBe(false);
  });
});
