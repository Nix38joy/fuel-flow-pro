import { useState, useEffect } from 'react';
import { useFuelStore } from '@/app/providers/store';
import { Card } from '@/common/ui/Card/Card';
import { ProgressBar } from '@/common/ui/ProgressBar/ProgressBar';
import { Fuel, Gauge, Zap, CheckCircle2, Square, Play, Check } from 'lucide-react';
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
  const { pauseOrder, resumeOrder, completeOrder } = useFuelStore();
  
  const currentOrder = orders.find(o => o.id === pump.currentOrderId);
  const [progress, setProgress] = useState(0);

  const hasEnoughFuel = pump.availableFuels.some(
    (fuelId) => fuels[fuelId as FuelId].remains > 50
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (currentOrder?.status === 'filling') {
      const duration = currentOrder.duration; 
      const start = currentOrder.createdAt;

      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - start;
        const percent = Math.min((elapsed / duration) * 100, 100);
        setProgress(percent);

        // Автоматическое завершение при 100%
        if (percent >= 100) {
          clearInterval(interval);
          completeOrder(currentOrder.id);
        }
      }, 100);
    } else if (currentOrder?.status === 'paused') {
      // На паузе фиксируем прогресс на основе уже налитых литров
      const percent = (currentOrder.filledLiters / currentOrder.requestedLiters) * 100;
      setProgress(percent);
    } else {
      setProgress(0);
    }

    return () => clearInterval(interval);
  }, [currentOrder?.status, currentOrder?.createdAt, currentOrder?.id]);

  return (
    <Card variant={pump.status === 'available' && hasEnoughFuel ? 'active' : 'danger'}>
      <div className={styles.header}>
        <Fuel size={20} className={styles.iconMain} />
        <h3 className={styles.title}>Колонка №{pump.number}</h3>
      </div>

      <div className={styles.info}>
        <div className={styles.statusRow}>
          {currentOrder?.status === 'filling' ? (
            <Zap size={14} className={styles.animatePulse} />
          ) : (
            <CheckCircle2 size={14} />
          )}
          <span className={styles[pump.status]}>
            {currentOrder?.status === 'paused' ? 'ПАУЗА' : 
             pump.status === 'available' ? (hasEnoughFuel ? 'Готова' : 'Пуста') : 'Заправка'}
          </span>
        </div>

        {(pump.status === 'filling' || currentOrder) && (
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
               <Gauge size={14} />
               <span>
                 {((currentOrder?.requestedLiters || 0) * progress / 100).toFixed(2)} / {currentOrder?.requestedLiters} л
               </span>
            </div>
            <ProgressBar progress={progress} />
          </div>
        )}

        <div className={styles.fuels}>
          {pump.availableFuels.map(fuelId => (
            <span key={fuelId} className={styles.fuelBadge}>{fuelId.replace('ai-', '')}</span>
          ))}
        </div>

        {/* ПАНЕЛЬ УПРАВЛЕНИЯ */}
        <div className={styles.actions}>
          {currentOrder?.status === 'filling' && (
            <button className={styles.pauseButton} onClick={() => pauseOrder(pump.id)}>
              <Square size={14} fill="currentColor" /> ПАУЗА
            </button>
          )}

          {currentOrder?.status === 'paused' && (
            <div className={styles.buttonGroup}>
              <button className={styles.resumeButton} onClick={() => resumeOrder(pump.id)}>
                <Play size={14} fill="currentColor" /> ПУСК
              </button>
              <button className={styles.finishButton} onClick={() => completeOrder(currentOrder.id)}>
                <Check size={14} /> ЗАВЕРШИТЬ
              </button>
            </div>
          )}

          {pump.status === 'available' && (
            <button 
              className={styles.button} 
              onClick={() => onSelect?.(pump)} 
              disabled={!hasEnoughFuel}
            >
              {hasEnoughFuel ? 'Выбрать' : 'Нет топлива'}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

