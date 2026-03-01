import { useFuelStore } from '@/app/providers/store';
import styles from './OrderHistory.module.css';

export const OrderHistory = () => {

  const orders = useFuelStore((state) => state.orders);

  
  const history = orders
    .filter((order) => order.status === 'completed')
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>История операций</h2>
      <div className={styles.list}>
        {history.length === 0 && (
          <p className={styles.empty}>Здесь будут ваши чеки...</p>
        )}
        
        {history.map((order) => (
          <div key={order.id} className={styles.card}>
            <div className={styles.header}>
              <span className={styles.pump}>Колонка №{order.pumpId.replace('p', '')}</span>
              <span className={styles.time}>
                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className={styles.main}>
              <span className={styles.fuel}>{order.fuelType.toUpperCase()}</span>
              <span className={styles.liters}>{order.filledLiters} л</span>
            </div>
            <div className={styles.footer}>
              <span>Итого:</span>
              <span className={styles.total}>{order.totalPrice.toFixed(2)} ₽</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
