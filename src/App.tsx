import { PumpList } from '@/widgets/pump-list/PumpList';
import { OrderHistory } from '@/widgets/order-history/OrderHistory';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#121212' }}>
      {/* Основной контент */}
      <main style={{ flex: 1, padding: '40px' }}>
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ color: '#fff', fontSize: '2rem', margin: 0 }}>
            ⛽ FuelFlow <span style={{ color: '#27ae60' }}>Pro</span>
          </h1>
        </header>
        
        <PumpList />
      </main>

      {/* Боковая панель истории */}
      <OrderHistory />
    </div>
  );
}

export default App;



