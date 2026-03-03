import type { FuelId } from '@/entities/fuel/model/types';

export interface Order {
  id: string;          // Прописываем явно здесь
  pumpId: string;
  fuelType: FuelId;
  requestedLiters: number;
  filledLiters: number;
  pricePerLiter: number;
  totalPrice: number;
  status: 'filling' | 'completed' | 'cancelled';
  createdAt: number;
  duration: number; 
}



