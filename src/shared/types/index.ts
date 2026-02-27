// src/shared/types/index.ts

/** 
 * Уникальный идентификатор (используем строку для гибкости UUID)
 */
export type Id = string;

/**
 * Стандартные единицы измерения для нашего проекта
 */
export type Liters = number;
export type Currency = number;

/**
 * Базовый интерфейс для любой сущности с ID
 */
export interface BaseEntity {
  id: Id;
}
