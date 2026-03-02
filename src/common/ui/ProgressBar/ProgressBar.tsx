import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number; // Число от 0 до 100
  color?: string;
}

export const ProgressBar = ({ progress, color = '#27ae60' }: ProgressBarProps) => { 
  return (
    <div className={styles.wrapper}>
      <div 
        className={styles.fill} 
         style={{ 
       width: `${Math.min(progress, 100)}%`, 
         backgroundColor: color // ТЕПЕРЬ МЫ ИСПОЛЬЗУЕМ ПЕРЕДАННЫЙ ЦВЕТ
       }} 
      />
    </div>
  );
};
