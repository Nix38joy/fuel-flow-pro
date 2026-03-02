import { useState } from 'react';
import { useFuelStore } from '@/app/providers/store';
import type { FuelId } from '@/entities/fuel/model/types';
import styles from './RefuelForm.module.css';

interface RefuelFormProps {
  pumpId: string;
  availableFuels: FuelId[];
  onSuccess: () => void;
}

export const RefuelForm = ({ pumpId, availableFuels, onSuccess }: RefuelFormProps) => {
  const [selectedFuel, setSelectedFuel] = useState<FuelId>(availableFuels[0]);
  const [liters, setLiters] = useState<number>(20);
  const fuels = useFuelStore((state) => state.fuels);
  const currentRemains = fuels[selectedFuel].remains;
  const isInvalid = liters > currentRemains || liters < 1 || currentRemains < 50;

  
  // Достаем экшен из стора
  const createOrder = useFuelStore((state) => state.createOrder);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInvalid) {
      createOrder(pumpId, selectedFuel, liters);
      onSuccess();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Заправка: Колонка {pumpId}</h2>
      
      <div className={styles.field}>
        <label>Тип топлива:</label>
        <select 
          value={selectedFuel} 
          onChange={(e) => setSelectedFuel(e.target.value as FuelId)}
        >
          {availableFuels.map(id => (
            <option key={id} value={id}>{id.toUpperCase()}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label>Литры:</label>
        <input 
          type="number" 
          value={liters} 
          onChange={(e) => setLiters(Number(e.target.value))}
          className={isInvalid ? styles.inputError : ''}
          min="1"
        />
        {isInvalid && <p className={styles.errorText}>Превышен остаток! (Доступно: {currentRemains}л)</p>}
      </div>

      <button 
        type="submit" className={styles.submitBtn}
        disabled={isInvalid}
        >
        Начать заправку
      </button>
    </form>
  );
};
