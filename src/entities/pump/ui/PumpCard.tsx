import type { Pump } from '../model/types';
import { Card } from '@/common/ui/Card/Card';
import styles from './PumpCard.module.css';

interface PumpCardProps {
  pump: Pump;
  /** Коллбэк для выбора колонки (нажмем — откроется меню заправки) */
  onSelect?: (id: string) => void;
}

export const PumpCard = ({ pump, onSelect }: PumpCardProps) => {
  // Определяем вариант карточки в зависимости от статуса
  const cardVariant = pump.status === 'available' ? 'active' : 'danger';

  return (
    <Card 
      title={`Колонка №${pump.number}`} 
      variant={cardVariant}
    >
      <div className={styles.info}>
        <div className={styles.status}>
          Статус: <span className={styles[pump.status]}>{pump.status}</span>
        </div>
        
        <div className={styles.fuels}>
          {pump.availableFuels.map(fuelId => (
            <span key={fuelId} className={styles.fuelBadge}>
              {fuelId.replace('ai-', '')}
            </span>
          ))}
        </div>

        <button 
          className={styles.button}
          onClick={() => onSelect?.(pump.id)}
          disabled={pump.status !== 'available'}
        >
          Выбрать
        </button>
      </div>
    </Card>
  );
};
