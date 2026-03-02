import { useFuelStore } from '@/app/providers/store';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './OrderHistory.module.css';


export const OrderHistory = () => {
  
  const orders = useFuelStore((state) => state.orders);

  // 1. Фильтруем только успешно завершенные заказы
  const completedOrders = orders
    .filter((order) => order.status === 'completed')
    .sort((a, b) => b.createdAt - a.createdAt);

  // 2. Считаем общую выручку (бизнес-логика прямо в компоненте)
  const totalRevenue = completedOrders.reduce(
    (sum, order) => sum + order.totalPrice, 
    0
  );

  return (
    <aside className={styles.sidebar}>
      {/* Блок статистики (Dashboard Stats) */}
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Выручка</span>
          <span className={styles.statValue}>
            {totalRevenue.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Операций</span>
          <span className={styles.statValue}>{completedOrders.length}</span>
        </div>
      </div>

      <h2 className={styles.title}>История операций</h2>

      <div className={styles.list}>
        <AnimatePresence initial={false}>
        {completedOrders.length === 0 ? (
          <p className={styles.empty}>Чеков пока нет...</p>
        ) : (
          completedOrders.map((order) => (
                <motion.div 
             key={order.id} 
              layout // Магия: плавно двигает соседей
               initial={{ opacity: 0, x: 50, scale: 0.9 }} // Появление
               animate={{ opacity: 1, x: 0, scale: 1 }}    // Финал
               exit={{ opacity: 0, scale: 0.5 }}           // Уход (на будущее)
               transition={{ 
                 type: 'spring', 
                 stiffness: 400, 
                damping: 30 
               }}
              className={styles.card}
                >
              <div className={styles.header}>
                <span className={styles.pump}>Колонка №{order.pumpId.replace('p', '')}</span>
                <span className={styles.time}>
                  {new Date(order.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              
              <div className={styles.main}>
                <span className={styles.fuel}>{order.fuelType.toUpperCase()}</span>
                <span className={styles.liters}>{order.filledLiters} л</span>
              </div>
              
              <div className={styles.footer}>
                <span>Итого:</span>
                <span className={styles.total}>
                  {order.totalPrice.toFixed(2)} ₽
                </span>
              </div>
            </motion.div>
          ))
        )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

