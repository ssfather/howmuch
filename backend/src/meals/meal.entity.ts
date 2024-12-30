import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column('simple-array', { nullable: true })
  sideDishes: string[];

  @Column('float', { nullable: true })
  calories: number;

  @Column('simple-json', { nullable: true })
  nutritionInfo: {
    carbs: number;
    protein: number;
    fat: number;
    vitaminA?: number;
    vitaminB?: number;
    vitaminC?: number;
    vitaminD?: number;
    iron?: number;
    calcium?: number;
    fiber?: number;
    sodium?: number;
  };

  @Column('datetime')
  date: Date;
} 