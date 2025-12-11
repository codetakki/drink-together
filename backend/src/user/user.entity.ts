import { DrinkEntity } from 'src/drink/drink.entity';
import { RoomEntity } from 'src/room/entity/room.entity';
import {
  AfterLoad,
  Column,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => RoomEntity, (room) => room.users)
  room: RoomEntity;

  @OneToMany(() => DrinkEntity, (drink) => drink.user, {
    cascade: true,
    eager: true,
  })
  drinks: DrinkEntity[];

  public promilleAmount: number;

  @Column({ default: 'male' })
  sex: 'male' | 'female';

  @AfterLoad()
  calculatePromille() {
    if (!this.weightKg || !this.drinks || this.drinks.length === 0) {
      this.promilleAmount = 0;
      return;
    }

    const ETHANOL_DENSITY = 0.789; // g/ml
    const WIDMARK_FACTOR_R = this.sex === 'male' ? 0.7 : 0.6;

    // Metabolism rate: Average rate of alcohol elimination (g/L per hour)
    // Common range is 0.10 to 0.15 promille/hour. We'll use 0.12.
    const METABOLISM_RATE = 0.12;

    const now = new Date();
    let promilleSum = 0;

    // 1. Calculate the current promille contribution for each drink individually
    for (const drink of this.drinks) {
      // Ensure consumptionTime is a Date object (important if loaded as string)
      const consumptionTime = new Date(drink.createdAt);

      // Time difference in milliseconds
      const timeElapsedMs = now.getTime() - consumptionTime.getTime();

      // Calculate time elapsed in hours (for metabolism)
      const timeElapsedHours = timeElapsedMs / (1000 * 60 * 60);

      // A. Alcohol Mass (A) in grams for this specific drink
      const alcoholMassGrams =
        drink.amountMl * (drink.percentageAlcohol / 100) * ETHANOL_DENSITY;

      // B. Theoretical Peak Promille from this drink
      // Promille = (A / (W * r)) * 10
      const peakPromille =
        alcoholMassGrams / (this.weightKg * WIDMARK_FACTOR_R);

      // C. Metabolized Promille since consumption
      // Assuming instantaneous absorption, which is a simplification
      const metabolizedPromille = METABOLISM_RATE * timeElapsedHours;

      // D. Current Promille Contribution
      // Ensure the current contribution is not negative
      const currentPromille = Math.max(0, peakPromille - metabolizedPromille);

      promilleSum += currentPromille;
    }

    // 2. Assign the total current promille
    // Use Math.max(0, ...) to ensure the total can't drop below zero
    this.promilleAmount = parseFloat(Math.max(0, promilleSum).toFixed(2));
  }
}
