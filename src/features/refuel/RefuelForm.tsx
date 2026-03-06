import { useState } from 'react';
import { useFuelStore } from '@/app/providers/store';
import type { FuelId } from '@/entities/fuel/model/types';
import { Zap, Droplets, Banknote } from 'lucide-react';
import { EmptyState } from '@/common/ui/EmptyState/EmptyState';
import styles from './RefuelForm.module.css';

interface RefuelFormProps {
  pumpId: string;
  availableFuels: string[];
  onSuccess: () => void;
}

export const RefuelForm = ({ pumpId, availableFuels, onSuccess }: RefuelFormProps) => {
  // Устанавливаем 0 по умолчанию
  const [liters, setLiters] = useState(0);
  const [fuelId, setFuelId] = useState<FuelId | null>((availableFuels[0] as FuelId) ?? null);
  
  const createOrder = useFuelStore((state) => state.createOrder);
  const fuels = useFuelStore((state) => state.fuels);

  if (!fuelId || !fuels[fuelId]) {
    return (
      <EmptyState
        icon={Droplets}
        title="Нет доступного топлива"
        description="Для этой колонки сейчас не найден доступный тип топлива."
      />
    );
  }

  const currentFuel = fuels[fuelId];
  const totalPrice = currentFuel.price * (liters || 0);
  const canRefuel = Number.isFinite(liters) && currentFuel.remains >= liters && liters > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canRefuel) {
      createOrder(pumpId, fuelId, Number(liters.toFixed(2)));
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
            onChange={(e) => {
              const parsed = Number(e.target.value);
              setLiters(Number.isFinite(parsed) ? parsed : 0);
            }}
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

