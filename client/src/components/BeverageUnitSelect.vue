<template>
  <v-combobox
    v-model="mlAmount"
    :hint="selectedUnit?.name"
    item-title="mlAmount"
    item-value="mlAmount"
    :items="beverageUnits"
    label="Select amount"
    :persistent-hint="!!selectedUnit"
    :return-object="false"
    type="number"
  >
    <template #append-inner>ML</template>

    <template #item="{ props, item }">
      <v-list-item
        v-bind="props"
        :subtitle="item.raw.mlAmount"
        :title="item.raw.name"
        @click="mlAmount = item.raw.mlAmount"
      /> </template></v-combobox>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'

  const mlAmount = defineModel<number | undefined>({ required: true, default: 330 })
  const selectedUnit = computed(() => {
    return beverageUnits.find(unit => unit.mlAmount == mlAmount.value)
  })

  const beverageUnits = [
    {
      name: 'Burk',
      mlAmount: 330,
      icon: 'mdi-drink',
      alcoholPercent: 5,
    },
    {
      name: 'Flaska (tex Öl)',
      mlAmount: 500,
      icon: 'mdi-bottle-tonic',
      alcoholPercent: 5,
    },
    {
      name: 'Shot',
      mlAmount: 40,
      icon: 'mdi-glass-cocktail',
      alcoholPercent: 40,
    },
    {
      name: 'Stor Shot',
      mlAmount: 60,
      icon: 'mdi-glass-cocktail',
      alcoholPercent: 40,
    },
    {
      name: 'Glas vin',
      mlAmount: 125,
      icon: 'mdi-glass-wine',
      alcoholPercent: 12,
    },
    {
      name: 'Flaska Vin',
      mlAmount: 750,
      icon: 'mdi-glass-wine',
      alcoholPercent: 12,
    },
    {
      name: 'Box',
      mlAmount: 3000,
      icon: 'mdi-box',
      alcoholPercent: 12,
    },
  ] as const
</script>
