import { useState } from 'react';
import { useFuelStore } from '@/app/providers/store'; // Достаем наш склад
import type { FuelId } from '@/entities/fuel/model/types';
import styles from './RefuelForm.module.css';

// Добавь эти интерфейсы после импортов
interface RefuelFormProps {
  pumpId: string;
  availableFuels: FuelId[]; // Используем наш тип FuelId
  onSuccess?: () => void;
}


// ... пропсы без изменений ...

export const RefuelForm = ({ pumpId, availableFuels, onSuccess }: RefuelFormProps) => {
  const [selectedFuel, setSelectedFuel] = useState<FuelId>(availableFuels[0]);
  const [liters, setLiters] = useState<number>(0);

  // 1. Достаем данные о топливе из стора
  const fuels = useFuelStore((state) => state.fuels);
  const createOrder = useFuelStore((state) => state.createOrder);

  // 2. ВЫЧИСЛЯЕМ ВАЛИДНОСТЬ (Логика Middle-разработчика)
  const currentFuelRemains = fuels[selectedFuel].remains;
  const isTooMuch = liters > currentFuelRemains;
  const isInvalidAmount = liters <= 0;
  const isDisabled = isTooMuch || isInvalidAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDisabled) {
      createOrder(pumpId, selectedFuel, liters);
      onSuccess?.();
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Новая заправка</h2>
      
      {/* Выбор топлива */}
      <div className={styles.field}>
        <label>Тип топлива</label>
        <select 
          value={selectedFuel} 
          onChange={(e) => setSelectedFuel(e.target.value as FuelId)}
        >
          {availableFuels.map(id => (
            <option key={id} value={id}>
              {fuels[id as FuelId].name} ({fuels[id as FuelId].remains} л доступно)
            </option>
          ))}
        </select>
      </div>

      {/* Поле ввода литров */}
      <div className={styles.field}>
        <label>Количество литров</label>
        <input 
          type="number" 
          value={liters || ''} 
          onChange={(e) => setLiters(Number(e.target.value))}
          placeholder="0.00"
          className={isTooMuch ? styles.inputError : ''}
        />
        
        {/* СООБЩЕНИЯ ОБ ОШИБКАХ */}
        {isTooMuch && (
          <p className={styles.errorText}>
            Ошибка: На складе всего {currentFuelRemains} л
          </p>
        )}
      </div>

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isDisabled}
      >
        {isTooMuch ? 'Недостаточно топлива' : 'Начать заправку'}
      </button>
    </form>
  );
};
