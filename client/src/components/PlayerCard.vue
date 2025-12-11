<template>
  <v-card
    :key="player.id"
    variant="outlined"
    @click=""
  >
    <v-dialog activator="parent">
      <inspect-player :model-value="{...player}" />
    </v-dialog>
    <template #prepend>
      <v-avatar v-if="index == 0" color="yellow-darken-1">
        <v-icon icon="mdi-trophy" />
      </v-avatar>
      <v-avatar v-else-if="index == 1" color="blue-grey-darken-1">
        <v-icon icon="mdi-medal" />
      </v-avatar>
      <v-avatar v-else-if="index == 2" color="orange-darken-4">
        <v-icon icon="mdi-license" />
      </v-avatar>
      <v-avatar v-else class="text-h5 font-weight-black" color="default">
        {{ index + 1 }}
      </v-avatar>
    </template>
    <template #title>
      <div class="d-flex justify-between">
        <div>{{ player.name }}</div>
      </div>
    </template>
    <template #subtitle>
      <div class="d-flex align-center">
        <div class="d-flex align-center">
          <v-icon icon="mdi-liquor" size="x-small" />
          <span>&nbsp;{{ player.drinks?.length || 0 }}
          </span>
        </div>
        <div class="mx-2">|</div>
        <div class="d-flex align-center">
          <span>{{ player?.drinks?.reduce((currentAmount, currentDrink) => currentAmount += currentDrink.amountMl, 0) }} ml</span>
        </div>
      </div>
    </template>
    <template #append><div class="text-h5 font-weight-black">{{ ( (player.promilleAmount || 0) * 10).toFixed(1) }} ‰</div> </template>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Player } from '@/types'
  const { player, index } = defineProps(
    {
      player: {
        type: Object as () => Player,
        required: true,
      },
      index: {
        type: Number,
        required: true,

      },
    },
  )
</script>
