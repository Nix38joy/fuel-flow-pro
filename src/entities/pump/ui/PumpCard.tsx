import { useState, useEffect } from 'react';
import { useFuelStore } from '@/app/providers/store';
import { Card } from '@/common/ui/Card/Card';
import { ProgressBar } from '@/common/ui/ProgressBar/ProgressBar';
import { Fuel, Gauge, Zap, CheckCircle2 } from 'lucide-react';
import styles from './PumpCard.module.css';
import type { Pump } from '../model/types';

interface PumpCardProps {
  pump: Pump;
  onSelect?: (pump: Pump) => void;
}

export const PumpCard = ({ pump, onSelect }: PumpCardProps) => {
  const orders = useFuelStore((state) => state.orders);
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

  const cardVariant = pump.status === 'available' ? 'active' : 'danger';

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
            {pump.status === 'available' ? 'Готова к работе' : 'Идет заправка'}
          </span>
        </div>
        
        {pump.status === 'filling' && (
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
               <Gauge size={14} />
               <span>Наполнено: {Math.round(progress)}%</span>
            </div>
            <ProgressBar progress={progress} />
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
          disabled={pump.status !== 'available'}
        >
          {pump.status === 'filling' ? 'Занято' : 'Выбрать'}
        </button>
      </div>
    </Card>
  );
};


