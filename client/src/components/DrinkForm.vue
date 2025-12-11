<template>
  <v-text-field v-model="drink.title" label="Drink name" :rules="[required]" />
  <beverage-unit-select v-model="drink.amountMl" />
  <v-text-field
    v-model.number="drink.percentageAlcohol"
    append-inner-icon="mdi-percent"
    label="Drink Percentage"
    :rules="[percentageAlcoholRules, required]"
    type="number"
  />
</template>

<script lang="ts" setup>
  import type { DrinkEntity } from '@/types'

  const drink = defineModel({
    type: Object as () => Partial<DrinkEntity>,
    required: true,
  })
  function required (v: any) {
    if (!v) return 'Value is required'
    return true
  }
  function percentageAlcoholRules (v: number) {
    if (v > 100) return 'Cant over 100 percent'
    if (v < 0) return 'Cant under 0 percent'

    return true
  }
  function amountRules (v: number) {
    if (v < 0) return 'Cant under 0 ml'

    return true
  }
</script>
