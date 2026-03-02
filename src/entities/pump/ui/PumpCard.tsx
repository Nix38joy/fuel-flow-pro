import { useState, useEffect } from 'react';
import { useFuelStore } from '@/app/providers/store';
import { Card } from '@/common/ui/Card/Card';
import { ProgressBar } from '@/common/ui/ProgressBar/ProgressBar';
import { Fuel, Gauge, Zap, CheckCircle2 } from 'lucide-react';
// Добавляем импорт типа FuelId для типизации
import type { FuelId } from '@/entities/fuel/model/types'; 
import styles from './PumpCard.module.css';
import type { Pump } from '../model/types';

interface PumpCardProps {
  pump: Pump;
  onSelect?: (pump: Pump) => void;
}

export const PumpCard = ({ pump, onSelect }: PumpCardProps) => {
  const orders = useFuelStore((state) => state.orders);
  const fuels = useFuelStore((state) => state.fuels);

  // ИСПРАВЛЕНО: Добавлен const и проверка наличия топлива
  const hasEnoughFuel = pump.availableFuels.some(
    (fuelId) => fuels[fuelId as FuelId].remains > 50
  );

  const currentOrder = orders.find(o => o.id === pump.currentOrderId);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (pump.status === 'filling' && currentOrder) {
      const duration = 15000;
      const start = currentOrder.createdAt;

      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - start;
        const percent = Math.min((elapsed / duration) * 100, 100);
        setProgress(percent);

        if (percent >= 100) clearInterval(interval);
      }, 100);
    } else {
      setProgress(0);
    }

    return () => clearInterval(interval);
  }, [pump.status, currentOrder]);

  // Вариант карточки теперь зависит и от статуса, и от наличия топлива
  const cardVariant = pump.status === 'available' && hasEnoughFuel ? 'active' : 'danger';

  return (
    <Card variant={cardVariant}>
      <div className={styles.header}>
        <Fuel size={20} className={styles.iconMain} />
        <h3 className={styles.title}>Колонка №{pump.number}</h3>
      </div>

      <div className={styles.info}>
        <div className={styles.statusRow}>
          {pump.status === 'filling' ? (
            <Zap size={14} className={styles.animatePulse} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          <span className={styles[pump.status]}>
            {pump.status === 'available' 
              ? (hasEnoughFuel ? 'Готова к работе' : 'Нет топлива') 
              : 'Идет заправка'}
          </span>
        </div>
        
        {pump.status === 'filling' && currentOrder && (
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
               <Gauge size={14} />
               <span>
                
                {((currentOrder.requestedLiters * progress) /100).toFixed(2)} / {currentOrder?.requestedLiters} л
               </span>
            </div>
            <ProgressBar progress={progress} />
          <div className={styles.moneyCounter}>
            {((currentOrder.totalPrice * progress) / 100).toFixed(2)} Р
            </div>
            </div>
          )}

        <div className={styles.fuels}>
          {pump.availableFuels.map(fuelId => (
            <span key={fuelId} className={styles.fuelBadge}>
              {fuelId.replace('ai-', '')}
            </span>
          ))}
        </div>

        <button 
          className={styles.button}
          onClick={() => onSelect?.(pump)}
          // Блокируем кнопку, если идет заправка ИЛИ нет топлива
          disabled={pump.status !== 'available' || !hasEnoughFuel}
        >
          {pump.status === 'filling' ? 'Занято' : !hasEnoughFuel ? 'Пусто' : 'Выбрать'}
        </button>
      </div>
    </Card>
  );
};
