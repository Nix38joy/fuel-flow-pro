import { useFuelStore } from '@/app/providers/store';
import { PumpCard } from '@/entities/pump/ui/PumpCard';
import styles from './PumpList.module.css';

export const PumpList = () => {
  // Достаем список колонок из глобального хранилища
  const pumps = useFuelStore((state) => state.pumps);

  const handleSelectPump = (id: string) => {
    console.log(`Выбрана колонка: ${id}`);
    // Сюда мы позже добавим открытие модалки заправки
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Доступные колонки</h2>
      <div className={styles.grid}>
        {pumps.map((pump) => (
          <PumpCard 
            key={pump.id} 
            pump={pump} 
            onSelect={handleSelectPump}
          />
        ))}
      </div>
    </section>
  );
};
