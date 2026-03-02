import { useFuelStore } from '@/app/providers/store';
import { ProgressBar } from '@/common/ui/ProgressBar/ProgressBar';
import { Database } from 'lucide-react';
import styles from './StockMonitor.module.css';

export const StockMonitor = () => {
  const fuels = useFuelStore((state) => state.fuels);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <Database size={18} />
        <h2>Состояние резервуаров</h2>
      </div>
      
      <div className={styles.grid}>
        {Object.values(fuels).map((fuel) => {
          // Считаем процент заполненности цистерны
          const percent = (fuel.remains / fuel.capacity) * 100;
          const isLow = percent < 20; // Красный свет, если меньше 20%

          return (
            <div key={fuel.id} className={styles.item}>
              <div className={styles.info}>
                <span className={styles.name}>{fuel.name}</span>
                <span className={isLow ? styles.warning : ''}>
                  {fuel.remains.toLocaleString()} / {fuel.capacity.toLocaleString()} л
                </span>
              </div>
              <ProgressBar 
                progress={percent} 
                // Если топлива мало — полоска станет оранжевой/красной
                color={isLow ? '#e74c3c' : '#27ae60'} 
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
