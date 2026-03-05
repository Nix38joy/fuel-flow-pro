import { useFuelStore } from '@/app/providers/store';
import { PumpCard } from '@/entities/pump/ui/PumpCard';
import type { Pump } from '@/entities/pump/model/types'; // Импорт типа
import styles from './PumpList.module.css';

// 1. Обязательно добавь интерфейс пропсов
interface PumpListProps {
  onSelect: (pump: Pump) => void;
}

// 2. Добавь деструктуризацию пропса в аргументах функции
export const PumpList = ({ onSelect }: PumpListProps) => {
  const pumps = useFuelStore((state) => state.pumps);

  return (
    <div className={styles.grid}>
      {pumps.map((pump) => (
        <PumpCard 
          key={pump.id} 
          pump={pump} 
          onSelect={onSelect} // Прокидываем дальше в карточку
        />
      ))}
    </div>
  );
};

