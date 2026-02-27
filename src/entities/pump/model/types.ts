import type { BaseEntity } from '@/shared/types';
import type { FuelType } from '@/entities/fuel/model/types';

/**
 * Состояния колонки в реальной системе управления
 */
export type PumpStatus = 'available' | 'filling' | 'maintenance' | 'out-of-order';

export interface Pump extends BaseEntity {
  /** Номер колонки (визуальный ID для клиента) */
  number: number;
  
  /** Текущий статус */
  status: PumpStatus;
  
  /** Список марок топлива, доступных именно на этом "пистолете" */
  availableFuels: FuelType[];
  
  /** ID текущего заказа, если колонка в статусе 'filling' */
  currentOrderId?: string;
}
