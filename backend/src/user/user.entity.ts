import { DrinkEntity } from 'src/drink/drink.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  weightKg: number;

  @OneToMany(() => DrinkEntity, (drink) => drink)
  @JoinColumn()
  drinks: DrinkEntity[];
}
