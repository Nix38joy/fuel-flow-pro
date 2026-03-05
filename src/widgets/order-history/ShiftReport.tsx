import { Modal } from '@/common/ui/Modal/Modal';
import styles from './OrderHistory.module.css'; // Используем те же стили или создай новые

interface ShiftReportProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  revenue: number;
  liters: number;
}

export const ShiftReport = ({ isOpen, onClose, onConfirm, revenue, liters }: ShiftReportProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#fff', marginBottom: '24px' }}>Отчет за смену</h2>
      
      <div style={{ background: '#252525', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
         <p style={{ color: '#888', marginBottom: '5px' }}>Итого выручка:</p>
         <h3 style={{ color: '#27ae60', fontSize: '1.8rem', margin: 0 }}>{revenue.toFixed(2)} ₽</h3>
         
         <p style={{ color: '#888', marginTop: '15px', marginBottom: '5px' }}>Пролито топлива:</p>
         <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>{liters.toFixed(2)} л</h3>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={onClose} className={styles.cancelBtn}>Отмена</button>
        <button onClick={onConfirm} className={styles.confirmBtn}>Закрыть смену</button>
      </div>
    </div>
  </Modal>
);
