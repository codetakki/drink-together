import type { Room } from '@/types'
import { createFetch } from '@vueuse/core'
import { defineStore } from 'pinia'

export const appFetch = createFetch({
  baseUrl: '/api',
  options: {
    immediate: false,
  },
})
export const useAppStore = defineStore('app', {
  state () {
    const route = useRoute()
    const roomCode = computed(() => {
      if (!route || !route.params) {
        return null
      }
      if ('roomId' in route.params) {
        return route.params.roomId
      }
      return null
    })
    const roomUrl = computed(() => {
      return 'room/' + roomCode.value || ''
    })
    const { data: roomData, execute: fetchRoom } = appFetch<Room>(
      roomUrl, { refetch: true, immediate: true },
    ).get().json<Room>()

    return {
      appFetch,
      roomData,
      roomCode,
      fetchRoom,
    }
  },
})
