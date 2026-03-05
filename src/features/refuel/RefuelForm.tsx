import { useState } from 'react';
import { useFuelStore } from '@/app/providers/store';
import type { FuelId } from '@/entities/fuel/model/types';
import { Zap, Droplets, Banknote } from 'lucide-react'; // Добавили иконки
import styles from './RefuelForm.module.css';

interface RefuelFormProps {
  pumpId: string;
  availableFuels: string[];
  onSuccess: () => void;
}

export const RefuelForm = ({ pumpId, availableFuels, onSuccess }: RefuelFormProps) => {
  const [fuelId, setFuelId] = useState<FuelId>(availableFuels[0] as FuelId);
  const [liters, setLiters] = useState(10);
  
  const createOrder = useFuelStore((state) => state.createOrder);
  const fuels = useFuelStore((state) => state.fuels);
  
  const currentFuel = fuels[fuelId];
  const totalPrice = currentFuel.price * liters;
  const canRefuel = currentFuel.remains >= liters;

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
        <label className={styles.label}>Выберите тип топлива</label>
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
        <div className={styles.inputWrapper}>
          <label className={styles.label}>Количество литров</label>
          <div className={styles.inputGroup}>
            <Droplets size={18} className={styles.inputIcon} />
            <input
              type="number"
              min="1"
              max={currentFuel.remains}
              value={liters}
              onChange={(e) => setLiters(Number(e.target.value))}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <Banknote size={16} />
            <span>К оплате: <strong>{totalPrice.toFixed(2)} ₽</strong></span>
          </div>
          <div className={`${styles.remains} ${!canRefuel ? styles.error : ''}`}>
            Доступно: {currentFuel.remains.toFixed(2)} л
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={!canRefuel || liters <= 0} 
        className={styles.submitButton}
      >
        <Zap size={18} fill="currentColor" />
        НАЧАТЬ ЗАПРАВКУ
      </button>
    </form>
  );
};

