import { useFuelStore } from '@/app/providers/store';

function App() {
  // Достаем объект с топливом из нашего глобального хранилища
  const fuels = useFuelStore((state) => state.fuels);

  return (
    <div className="app-container">
      <h1>⛽ FuelFlow Pro: Контроль цен</h1>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
        {/* Превращаем объект в массив и перебираем его */}
        {Object.values(fuels).map((fuel) => (
          <div 
            key={fuel.id} 
            style={{ 
              padding: '15px', 
              border: '1px solid #444', 
              borderRadius: '8px',
              background: '#1e1e1e',
              color: 'white'
            }}
          >
            <h3>{fuel.name}</h3>
            <p>Цена: <strong>{fuel.price} ₽</strong></p>
            <p>Остаток: {fuel.remains} л</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


