import { useState, useEffect } from 'react';
import { Fuel, MonitorOff } from 'lucide-react';
import { PumpList } from '@/widgets/pump-list/PumpList';
import { OrderHistory } from '@/widgets/order-history/OrderHistory';
import { StockMonitor } from '@/widgets/stock-monitor/StockMonitor';
import { RefuelForm } from '@/features/refuel/RefuelForm'; 
import { EmptyState } from '@/common/ui/EmptyState/EmptyState'; 
import type { Pump } from '@/entities/pump/model/types';
import styles from './App.module.css';

function App() {
  const [selectedPump, setSelectedPump] = useState<Pump | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Следим за изменением размера экрана, чтобы интерфейс не ломался при ресайзе
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ЗАГЛУШКА ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
  if (isMobile) {
    return (
      <div className={styles.mobileBlock}>
        <EmptyState 
          icon={MonitorOff} 
          title="Desktop Terminal Only" 
          description="Система FuelFlow Pro оптимизирована для работы на широкоформатных стационарных терминалах (от 1024px). Пожалуйста, используйте ПК для управления АЗС." 
        />
      </div>
    );
  }

  // ОСНОВНОЙ ИНТЕРФЕЙС ДЛЯ ДЕСКТОПА
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header>
          <h1 className={styles.title}>⛽ FuelFlow Pro</h1>
        </header>
        
        <StockMonitor />
        
        <div className={styles.contentLayout}>
          <div className={styles.pumpColumn}>
            <PumpList onSelect={setSelectedPump} />
          </div>

          <div className={styles.refuelPanel}>

            {selectedPump ? (
              <div className={styles.refuelFormWrapper}>
              <RefuelForm 
                pumpId={selectedPump.id} 
                availableFuels={selectedPump.availableFuels} 
                onSuccess={() => setSelectedPump(null)} 
              />
              </div>
            ) : (
            
              <EmptyState 
                  icon={Fuel} 
                  title="Колонка не выбрана" 
                  description="Выберите свободную заправочную колонку на карте слева, чтобы настроить параметры подачи топлива" 
                />
              
            )}
          </div>
        </div>
      </main>
      
      <OrderHistory />
    </div>
  );
}

export default App;




