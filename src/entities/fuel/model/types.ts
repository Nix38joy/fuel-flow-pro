import type { Currency, Liters, BaseEntity } from '@/shared/types';


// Строгий список доступных марок топлива
export type FuelId = 'ai-92' | 'ai-95' | 'ai-98' | 'diesel';

export interface Fuel extends BaseEntity {
  id: FuelId;      // Переопределяем ID конкретными марками
  name: string;      // "АИ-95 Премиум"
  price: Currency;   // Цена за 1 литр
  remains: Liters;   // Остаток в цистерне
  capacity: Liters;  // Максимальный объем цистерны
}
