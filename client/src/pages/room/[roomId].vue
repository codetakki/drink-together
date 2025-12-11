<template>
  <div class="d-flex flex-column" style="overflow-y: hidden; height: 100vh;">

    <v-toolbar density="compact">
      <v-toolbar-title :text="store.roomData?.name" />
      <AddPlayer :room-code="store.roomData?.code" @done="store.fetchRoom()" />
    </v-toolbar>
    <div class="overflow-auto pa-4 h-100">
      <div class="d-flex flex-column ga-4">
        <PlayerCard v-for="player, i in store.roomData?.users" :key="player.id" :index="i" :player="player" />
      </div>
    </div>
    <v-card>
      <v-card-text>
        <AddDrink :players="store.roomData?.users || []" @done="store.fetchRoom()" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
  import type { Room } from '@/types'
  import { reactifyObject } from '@vueuse/core'
  import { appFetch, useAppStore } from '@/stores/app'

  const store = useAppStore()
</script>

<style></style>
