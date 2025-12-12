import type { Room } from '@/types'
import { createFetch, useFetch, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

const url = window.location.origin
export const appFetch = createFetch({
  baseUrl: url + '/api',
  options: {
    immediate: false,
  },
})
export const useAppStore = defineStore('app', {
  state () {
    const socket = io(url, { path: '/api/socket/' })
    socket.on('connect', () => {
      console.log('Connected with ID:', socket.id)
      roomChange()
    })
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
    watch(roomCode, roomChange)
    function roomChange () {
      if (!route || !route.params) {
        socket.emit('leave-all-rooms')

        return
      }
      if ('roomId' in route.params) {
        socket.emit('join-room', route.params.roomId)

        return
      }
      socket.emit('leave-all-rooms')

      return null
    }
    const roomUrl = computed(() => {
      return 'room/' + roomCode.value || ''
    })

    const { data: roomData, execute: fetchRoom, isFetching } = appFetch<Room>(
      roomUrl, { refetch: true, immediate: true },
    ).get().json<Room>()
    const visitedRoomsCodes = useLocalStorage<string[]>('app-visited-rooms-codes', [])
    watch(roomData, value => {
      if (!value || !value.code) {
        return
      }
      if (!visitedRoomsCodes.value.includes(value.code)) {
        visitedRoomsCodes.value.push(value.code)
      }
    })
    socket.on('refresh-room', fetchRoom)

    return {
      appFetch,
      roomData,
      roomCode,
      fetchRoom,
      isFetching,
      visitedRoomsCodes,
    }
  },
})
