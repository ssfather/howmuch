import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { MealType } from '../interfaces/meal-type.interface';

@Entity('meal_record')
export class MealRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  date: Date;

  @Column({
    type: 'varchar',
    enum: MealType
  })
  mealType: MealType;

  @Column('json')
  nutrition: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  memo?: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
} 