import type { FuelFlowState } from './store';

export const selectFuels = (state: FuelFlowState) => state.fuels;
export const selectPumps = (state: FuelFlowState) => state.pumps;
export const selectOrders = (state: FuelFlowState) => state.orders;

export const selectCreateOrder = (state: FuelFlowState) => state.createOrder;
export const selectPauseOrder = (state: FuelFlowState) => state.pauseOrder;
export const selectResumeOrder = (state: FuelFlowState) => state.resumeOrder;
export const selectCompleteOrder = (state: FuelFlowState) => state.completeOrder;
export const selectCancelOrder = (state: FuelFlowState) => state.cancelOrder;
export const selectResetStore = (state: FuelFlowState) => state.resetStore;
