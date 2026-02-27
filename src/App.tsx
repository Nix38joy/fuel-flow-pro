import { PumpList } from '@/widgets/pump-list/PumpList';

function App() {
  return (
    <div className="app-container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 300 }}>
          ⛽ FuelFlow <span style={{ color: '#27ae60' }}>Pro</span>
        </h1>
        <p style={{ color: '#666', marginTop: '10px' }}>Система управления топливными терминалами</p>
      </header>
      
      <main>
        {/* Наш новый виджет, который сам заберет данные из Zustand */}
        <PumpList />
      </main>

      <footer style={{ marginTop: '60px', borderTop: '1px solid #333', paddingTop: '20px', color: '#444', textAlign: 'center' }}>
        &copy; 2024 FuelFlow Enterprise Solutions
      </footer>
    </div>
  );
}

export default App;



