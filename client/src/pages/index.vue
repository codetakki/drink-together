<template>
  <v-text-field v-model="roomCode" label="Room code" />
  <v-btn block @click="router.push('/room/'+roomCode)">Join room</v-btn>
  or
  <v-btn block color="primary" variant="outlined" @click="createRoom()">Create Room</v-btn>
  <pre>{{ data }}</pre>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import { appFetch } from '@/stores/app'
  const roomCode = ref<string>('')
  const router = useRouter()
  const { execute: createRoom }
    = appFetch('/room/create', {
      afterFetch: ctx => {
        console.log(ctx)
        router.push('/room/' + ctx.data.code)
        return ctx
      },
      immediate: false,
    },
    ).post().json()
  const { data } = appFetch('/room', { immediate: true })
</script>
