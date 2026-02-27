import type { PropsWithChildren } from 'react';
import styles from './Card.module.css';

interface CardProps {
  /** Можно добавить заголовок, если нужно */
  title?: string;
  /** Вариант оформления (например, для выделения активной колонки) */
  variant?: 'default' | 'active' | 'danger';
}

export const Card = ({ children, title, variant = 'default' }: PropsWithChildren<CardProps>) => {
  // Формируем динамический класс в зависимости от варианта
  const cardClassName = `${styles.card} ${styles[variant]}`;

  return (
    <div className={cardClassName}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};
