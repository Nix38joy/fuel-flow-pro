import type { PropsWithChildren } from 'react';
import styles from './Overlay.module.css';

interface OverlayProps {
  onClose: () => void;
}

export const Overlay = ({ children, onClose }: PropsWithChildren<OverlayProps>) => {
  return (
    <div className={styles.wrapper} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};
