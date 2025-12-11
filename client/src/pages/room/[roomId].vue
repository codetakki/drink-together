<template>
  <div v-if="store.roomData" class="d-flex flex-column" style="overflow-y: hidden; height: 100vh;">
    <v-toolbar density="compact">
      <template #prepend><v-btn color="default" icon="mdi-arrow-left" to="/" /></template>
      <v-toolbar-title :text="'Room: ' + store.roomData?.code">
        <v-btn v-if="isSupported" color="default" icon="mdi-share-variant" @click="shareRoom" />
      </v-toolbar-title>
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
  {{ store.roomData }}
  <template v-if="!store.roomData">
    <div class="w-100 d-flex flex-column align-center justify-center" style="overflow-y: hidden; height: 100vh;">
      <div v-if="!store.isFetching">
        <div class="text-h4 mb-5">No room with code {{ store.roomCode }} found </div>
        <v-btn size="x-large" to="/">Back to start</v-btn>
      </div>
      <div v-else>
        <v-progress-circular indeterminate :size="82" :width="9" />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
  import { useShare } from '@vueuse/core'

  import { useAppStore } from '@/stores/app'

  const store = useAppStore()
  const { share, isSupported } = useShare()
  function shareRoom () {
    share({
      title: 'Join drinking room!',
      text: 'Join the room and start tracking your drinks',
      url: location.href,
    })
  }
  // 1. Connect
</script>

<style></style>
