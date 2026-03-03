import { useFuelStore } from '@/app/providers/store';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Banknote, Box, Receipt } from 'lucide-react';
import styles from './OrderHistory.module.css';

export const OrderHistory = () => {
  const orders = useFuelStore((state) => state.orders);

  const completedOrders = orders
    .filter((order) => order.status === 'completed')
    .sort((a, b) => b.createdAt - a.createdAt);

  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + order.totalPrice, 
    0
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <Banknote size={14} />
            <span className={styles.statLabel}>Выручка</span>
          </div>
          <span className={styles.statValue}>
            {totalRevenue.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
          </span>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <Box size={14} />
            <span className={styles.statLabel}>Операций</span>
          </div>
          <span className={styles.statValue}>{completedOrders.length}</span>
        </div>
      </div>

      {/* НАЧАЛО БЛОКА ЗАГОЛОВКА */}
<div style={{ 
  display: 'flex', 
  alignItems: 'center', 
  gap: '10px', 
  marginBottom: '20px',
  borderBottom: '1px solid #333',
  paddingBottom: '12px' 
}}>
  <History size={18} color="#27ae60" />
  <h2 style={{ 
    margin: 0, 
    color: '#fff', 
    fontSize: '1rem', 
    textTransform: 'uppercase', 
    letterSpacing: '1px' 
  }}>
    История операций
  </h2>
</div>
{/* КОНЕЦ БЛОКА ЗАГОЛОВКА */}


      <div className={styles.list}>
        <AnimatePresence initial={false}>
          {completedOrders.length === 0 ? (
            <p className={styles.empty}>Чеков пока нет...</p>
          ) : (
            completedOrders.map((order) => (
              <motion.div 
                key={order.id} 
                layout 
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={styles.card}
              >
                <div className={styles.header}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Receipt size={12} color="#666" />
                    <span className={styles.pump}>Колонка №{order.pumpId.replace('p', '')}</span>
                  </div>
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
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};



