import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class DrinkEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  percentageAlcohol: number;

  @Column()
  amountMl: number;

  @CreateDateColumn()
  createdAt: string;

  @ManyToOne(() => UserEntity, (user) => user.drinks)
  user: UserEntity;
}
