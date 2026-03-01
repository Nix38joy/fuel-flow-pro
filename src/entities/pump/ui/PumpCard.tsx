import { useState, useEffect } from 'react'; // Добавляем хуки
import { useFuelStore } from '@/app/providers/store';
import { Card } from '@/common/ui/Card/Card';
import { ProgressBar } from '@/common/ui/ProgressBar/ProgressBar'; // Импортируем нашу полоску
import styles from './PumpCard.module.css';
import type { Pump } from '../model/types';

interface PumpCardProps {
  pump: Pump;
  onSelect?: (pump: Pump) => void;
}

export const PumpCard = ({ pump, onSelect }: PumpCardProps) => {
  const orders = useFuelStore((state) => state.orders);
  const currentOrder = orders.find(o => o.id === pump.currentOrderId);
  
  // Локальный стейт для процентов (от 0 до 100)
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (pump.status === 'filling' && currentOrder) {
      const duration = 15000; // Наши заветные 15 секунд
      const start = currentOrder.createdAt;

      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - start;
        const percent = Math.min((elapsed / duration) * 100, 100);
        
        setProgress(percent);

        if (percent >= 100) {
          clearInterval(interval);
        }
      }, 100); // Обновляем каждые 100мс для плавности
    } else {
      setProgress(0); // Сбрасываем, если заправка кончилась
    }

    return () => clearInterval(interval); // Очистка при размонтировании
  }, [pump.status, currentOrder]);

  const cardVariant = pump.status === 'available' ? 'active' : 'danger';

  return (
    <Card title={`Колонка №${pump.number}`} variant={cardVariant}>
      <div className={styles.info}>
        <div className={styles.status}>
          Статус: <span className={styles[pump.status]}>{pump.status}</span>
        </div>
        
        {/* ПОЛОСКА ПРОГРЕССА */}
        {pump.status === 'filling' && (
          <div className={styles.progressSection}>
            <ProgressBar progress={progress} />
            <span className={styles.percentText}>{Math.round(progress)}%</span>
          </div>
        )}

        <div className={styles.fuels}>
          {pump.availableFuels.map(fuelId => (
            <span key={fuelId} className={styles.fuelBadge}>{fuelId.replace('ai-', '')}</span>
          ))}
        </div>

        <button 
          className={styles.button}
          onClick={() => onSelect?.(pump)}
          disabled={pump.status !== 'available'}
        >
          {pump.status === 'filling' ? 'Заправка...' : 'Выбрать'}
        </button>
      </div>
    </Card>
  );
};

