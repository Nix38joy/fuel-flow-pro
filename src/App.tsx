import { useState, useEffect } from 'react';
import { Fuel, MonitorOff } from 'lucide-react';
import { PumpList } from '@/widgets/pump-list/PumpList';
import { OrderHistory } from '@/widgets/order-history/OrderHistory';
import { StockMonitor } from '@/widgets/stock-monitor/StockMonitor';
import { RefuelForm } from '@/features/refuel/RefuelForm'; 
import { EmptyState } from '@/common/ui/EmptyState/EmptyState'; 
import type { Pump } from '@/entities/pump/model/types';

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
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#121212',
        padding: '40px',
        textAlign: 'center'
      }}>
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#121212', color: '#fff' }}>
      <main style={{ 
        flex: 1, 
        padding: '40px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '40px',
        overflowX: 'hidden'
      }}>
        <header>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>⛽ FuelFlow Pro</h1>
        </header>
        
        <StockMonitor />
        
        <div style={{ 
          display: 'flex', 
          gap: '40px', 
          flex: 1,
          alignItems: 'flex-start'
        }}>
          <div style={{ width: '350px', flexShrink: 0 }}>
            <PumpList onSelect={setSelectedPump} />
          </div>

          <div style={{ 
            flex: '0 1 600px',
            background: '#1a1a1a', 
            borderRadius: '16px', 
            border: '1px solid #333', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '500px',
            padding: '20px'
          }}>
            {selectedPump ? (
              <RefuelForm 
                pumpId={selectedPump.id} 
                availableFuels={selectedPump.availableFuels} 
                onSuccess={() => setSelectedPump(null)} 
              />
            ) : (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <EmptyState 
                  icon={Fuel} 
                  title="Колонка не выбрана" 
                  description="Выберите свободную заправочную колонку на карте слева, чтобы настроить параметры подачи топлива" 
                />
              </div>
            )}
          </div>
        </div>
      </main>
      
      <OrderHistory />
    </div>
  );
}

export default App;




