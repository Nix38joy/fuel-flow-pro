import { useState } from 'react';
import { Fuel } from 'lucide-react';
import { PumpList } from '@/widgets/pump-list/PumpList';
import { OrderHistory } from '@/widgets/order-history/OrderHistory';
import { StockMonitor } from '@/widgets/stock-monitor/StockMonitor';
import { RefuelForm } from '@/features/refuel/RefuelForm'; 
import { EmptyState } from '@/common/ui/EmptyState/EmptyState'; 
import type { Pump } from '@/entities/pump/model/types';

function App() {
  const [selectedPump, setSelectedPump] = useState<Pump | null>(null);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#121212', color: '#fff' }}>
      <main style={{ 
        flex: 1, 
        padding: '40px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '40px',
        overflowX: 'hidden' // Защита от горизонтального скролла
      }}>
        <header>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>⛽ FuelFlow Pro</h1>
        </header>
        
        <StockMonitor />
        
        {/* ГЛАВНАЯ РАБОЧАЯ ОБЛАСТЬ */}
        <div style={{ 
          display: 'flex', 
          gap: '40px', 
          flex: 1,
          alignItems: 'flex-start' // Чтобы блоки не растягивались по высоте принудительно
        }}>
          {/* СЛЕВА: СПИСОК КОЛОНОК (Фиксированная ширина) */}
          <div style={{ width: '350px', flexShrink: 0 }}>
            <PumpList onSelect={setSelectedPump} />
          </div>

          {/* В ЦЕНТРЕ: ПАНЕЛЬ УПРАВЛЕНИЯ (Ограниченная ширина + центрирование) */}
          <div style={{ 
            flex: '0 1 600px', // Ширина 600px, не растягивается больше
            background: '#1a1a1a', 
            borderRadius: '16px', 
            border: '1px solid #333', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Центрирует контент по горизонтали
            justifyContent: 'center', // Центрирует контент по вертикали
            minHeight: '500px', // Минимальная высота, чтобы окно было солидным
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
      
      {/* СПРАВА: ИСТОРИЯ ОПЕРАЦИЙ */}
      <OrderHistory />
    </div>
  );
}

export default App;




