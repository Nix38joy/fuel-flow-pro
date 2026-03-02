import { PumpList } from '@/widgets/pump-list/PumpList';
import { OrderHistory } from '@/widgets/order-history/OrderHistory';
import { StockMonitor } from '@/widgets/stock-monitor/StockMonitor'; // ИМПОРТ

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#121212' }}>
      <main style={{ flex: 1, padding: '40px', maxWidth: '1200px' }}>
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ color: '#fff', fontSize: '2rem' }}>⛽ FuelFlow Pro</h1>
        </header>
        
        {/* НОВЫЙ ВИДЖЕТ */}
        <StockMonitor />
        
        <PumpList />
      </main>
      <OrderHistory />
    </div>
  );
}


export default App;



