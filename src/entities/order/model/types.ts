import type { BaseEntity, Id, Liters, Currency } from '@/shared/types';
import type { FuelId } from '@/entities/fuel/model/types';

/** 
 * Жизненный цикл заказа на современной АЗС
 */
export type OrderStatus = 'pending' | 'filling' | 'completed' | 'cancelled';

export interface Order extends BaseEntity {
  /** На какой колонке идет заправка */
  pumpId: Id;
  
  /** Какое топливо выбрано */
  fuelType: FuelId;
  
  /** Сколько литров заказал клиент */
  requestedLiters: Liters;
  
  /** Сколько литров налито по факту (для прогресс-бара) */
  filledLiters: Liters;
  
  /** Стоимость за литр на момент заказа (цена может измениться, в заказе фиксируем) */
  pricePerLiter: Currency;
  
  /** Общая сумма заказа (requestedLiters * pricePerLiter) */
  totalPrice: Currency;
  
  /** Текущий статус заправки */
  status: OrderStatus;
  
  /** Метка времени создания (для истории) */
  createdAt: number;
}
