import { useState } from 'react';
import { useFuelStore } from '@/app/providers/store';
import type { FuelId } from '@/entities/fuel/model/types';
import { Zap, Droplets, Banknote } from 'lucide-react';
import styles from './RefuelForm.module.css';

interface RefuelFormProps {
  pumpId: string;
  availableFuels: string[];
  onSuccess: () => void;
}

export const RefuelForm = ({ pumpId, availableFuels, onSuccess }: RefuelFormProps) => {
  // Устанавливаем 0 по умолчанию
  const [liters, setLiters] = useState(0);
  const [fuelId, setFuelId] = useState<FuelId>(availableFuels[0] as FuelId);
  
  const createOrder = useFuelStore((state) => state.createOrder);
  const fuels = useFuelStore((state) => state.fuels);
  
  const currentFuel = fuels[fuelId];
  const totalPrice = currentFuel.price * (liters || 0);
  const canRefuel = currentFuel.remains >= liters && liters > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canRefuel) {
      createOrder(pumpId, fuelId, liters);
      onSuccess();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2 className={styles.title}>Настройка заправки</h2>
        <span className={styles.pumpBadge}>Колонка №{pumpId.replace('p', '')}</span>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Тип топлива</label>
        <div className={styles.fuelGrid}>
          {availableFuels.map((id) => (
            <button
              key={id}
              type="button"
              className={`${styles.fuelOption} ${fuelId === id ? styles.active : ''}`}
              onClick={() => setFuelId(id as FuelId)}
            >
              <span className={styles.fuelName}>{fuels[id as FuelId].name}</span>
              <span className={styles.fuelPrice}>{fuels[id as FuelId].price} ₽</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Объем топлива</label>
        <div className={styles.inputContainer}>
          <Droplets size={18} className={styles.inputIcon} />
          <input
            type="number"
            min="0"
            max={currentFuel.remains}
            value={liters === 0 ? '' : liters} // Чтобы не мешался 0 при вводе
            onChange={(e) => setLiters(Number(e.target.value))}
            className={styles.inputField}
            placeholder="0"
          />
          <span className={styles.inputUnit}>литров</span>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <Banknote size={20} className={styles.priceIcon} />
            <div className={styles.priceContent}>
              <span className={styles.priceLabel}>Итого к оплате</span>
              <span className={styles.priceValue}>{totalPrice.toFixed(2)} ₽</span>
            </div>
          </div>
          <div className={`${styles.remains} ${currentFuel.remains < liters ? styles.error : ''}`}>
            На складе: {currentFuel.remains.toFixed(2)} л
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!canRefuel} 
        className={styles.submitButton}
      >
        <Zap size={18} fill="currentColor" />
        НАЧАТЬ ЗАПРАВКУ
      </button>
    </form>
  );
};

