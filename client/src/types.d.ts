export interface Player {
  name: string
  id?: number
  weightKg: number
  promilleAmount?: number
  drinks?: DrinkEntity[]
  sex: string | 'male' | 'female'
}

export interface Room {
  id: number
  code: string
  name: string
  createdAt: string
  users: UserEntity[]
}

export interface DrinkEntity {
  id: number
  title: string
  percentageAlcohol: number
  amountMl: number
  createdAt: string
}
