import { useFuelStore } from '@/app/providers/store';
import { selectPumps } from '@/app/providers/selectors';
import { PumpCard } from '@/entities/pump/ui/PumpCard';
import type { Pump } from '@/entities/pump/model/types';
import styles from './PumpList.module.css';

interface PumpListProps {
  onSelect: (pump: Pump) => void;
}

export const PumpList = ({ onSelect }: PumpListProps) => {
  const pumps = useFuelStore(selectPumps);

  return (
    <div className={styles.grid}>
      {pumps.map((pump) => (
        <PumpCard 
          key={pump.id} 
          pump={pump} 
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

