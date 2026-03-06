import { useState } from 'react';
import { useFuelStore } from '@/app/providers/store';
import { selectOrders, selectResetStore } from '@/app/providers/selectors';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Banknote, Box, Receipt, RefreshCcw } from 'lucide-react';
import { EmptyState } from '@/common/ui/EmptyState/EmptyState';
import { ShiftReport } from './ShiftReport';
import styles from './OrderHistory.module.css';

export const OrderHistory = () => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const orders = useFuelStore(selectOrders);
  const resetStore = useFuelStore(selectResetStore);
  const hasActiveOrders = orders.some((order) => order.status === 'filling' || order.status === 'paused');

  const completedOrders = orders
    .filter((order) => order.status === 'completed')
    .sort((a, b) => b.createdAt - a.createdAt);

  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalLiters = completedOrders.reduce((sum, o) => sum + o.filledLiters, 0);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statHeader}><Banknote size={14} /><span className={styles.statLabel}>Выручка</span></div>
          <span className={styles.statValue}>{totalRevenue.toFixed(2)} ₽</span>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statHeader}><Box size={14} /><span className={styles.statLabel}>Операций</span></div>
          <span className={styles.statValue}>{completedOrders.length}</span>
        </div>
        <button
          onClick={() => setIsReportOpen(true)}
          className={styles.resetButton}
          disabled={hasActiveOrders}
          title={hasActiveOrders ? 'Сначала завершите активные заправки' : undefined}
        >
          <RefreshCcw size={14} /> <span>Закрыть смену</span>
        </button>
      </div>

      {/* ШАПКА ИСТОРИИ */}
      <div className={styles.titleWrapper}>
        <History size={18} color="#27ae60" />
        <h2 className={styles.title}>История операций</h2>
      </div>

      {/* СПИСОК ЧЕКОВ */}
      <div className={styles.list}>
        <AnimatePresence initial={false}>
          {completedOrders.length === 0 ? (
            <EmptyState icon={Receipt} title="История пуста" description="Завершите заправку" />
          ) : (
            completedOrders.map((order) => (
              <motion.div key={order.id} className={styles.card} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className={styles.header}>
                  <div className={styles.receiptMeta}>
                    <Receipt size={12} color="#666" />
                    <span>Колонка №{order.pumpId.replace('p', '')}</span>
                  </div>
                  <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className={styles.main}><span>{order.fuelType.toUpperCase()}</span><span>{order.filledLiters} л</span></div>
                <div className={styles.footer}><span>Итого:</span><span className={styles.total}>{order.totalPrice.toFixed(2)} ₽</span></div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* МОДАЛКА ОТЧЕТА */}
      <ShiftReport 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        onConfirm={resetStore} 
        revenue={totalRevenue} 
        liters={totalLiters}
        hasActiveOrders={hasActiveOrders}
      />
    </aside>
  );
};



