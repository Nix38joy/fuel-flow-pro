import { useState } from 'react';
import { useFuelStore } from '@/app/providers/store';
import { PumpCard } from '@/entities/pump/ui/PumpCard';
import { Overlay } from '@/common/ui/Overlay/Overlay';
import { RefuelForm } from '@/features/refuel/RefuelForm';
import type { Pump } from '@/entities/pump/model/types';
import styles from './PumpList.module.css';

export const PumpList = () => {
  const pumps = useFuelStore((state) => state.pumps);
    const [selectedPump, setSelectedPump] = useState<Pump | null>(null);
 
    const handleSelectPump = (pump: Pump) => {
        setSelectedPump(pump);
    };

    const handleClose = () => setSelectedPump(null);

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Доступные колонки</h2>
      <div className={styles.grid}>
        {pumps.map((pump) => (
          <PumpCard 
            key={pump.id} 
            pump={pump} 
            onSelect={() => handleSelectPump(pump)}
          />
        ))}
      </div>

       
        {selectedPump && (
        <Overlay onClose={handleClose}>
            <RefuelForm 
            pumpId={selectedPump.id}
            availableFuels={selectedPump.availableFuels}
            onSuccess={handleClose}
            />
            </Overlay>
        )}

        </section>
  );
};
