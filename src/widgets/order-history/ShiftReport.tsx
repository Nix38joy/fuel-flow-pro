import { Modal } from '@/common/ui/Modal/Modal';
import styles from './ShiftReport.module.css';

interface ShiftReportProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => unknown;
  revenue: number;
  liters: number;
  hasActiveOrders: boolean;
}

export const ShiftReport = ({
  isOpen,
  onClose,
  onConfirm,
  revenue,
  liters,
  hasActiveOrders,
}: ShiftReportProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className={styles.root}>
      <h2 className={styles.title}>Отчет за смену</h2>
      
      <div className={styles.stats}>
         <p className={styles.label}>Итого выручка:</p>
         <h3 className={styles.revenue}>{revenue.toFixed(2)} ₽</h3>
         
         <p className={styles.labelSecondary}>Пролито топлива:</p>
         <h3 className={styles.liters}>{liters.toFixed(2)} л</h3>
      </div>

      {hasActiveOrders && <p className={styles.warning}>Есть активные заправки. Закрытие смены недоступно.</p>}

      <div className={styles.actions}>
        <button onClick={onClose} className={styles.cancelBtn}>Отмена</button>
        <button onClick={onConfirm} className={styles.confirmBtn} disabled={hasActiveOrders}>
          Закрыть смену
        </button>
      </div>
    </div>
  </Modal>
);
