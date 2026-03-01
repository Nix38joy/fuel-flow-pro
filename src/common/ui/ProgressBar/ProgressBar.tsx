import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number; // Число от 0 до 100
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <div className={styles.wrapper}>
      <div 
        className={styles.fill} 
        style={{ width: `${Math.min(progress, 100)}%` }} 
      />
    </div>
  );
};
