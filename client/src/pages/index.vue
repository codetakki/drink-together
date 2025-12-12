<template>
  <div class="d-flex align-center justify-center" style="height: 100vh;">
    <v-card min-width="300" subtitle="Track drinks and alcohol consumption together" title="Drink together">
      <v-card-text>
        <v-form v-model="formValid" @submit.prevent="joinRoom()">
          <v-text-field v-model="roomCode" label="Room code" :rules="[(v) => !!v || v.length > 0 || 'Room code required']" />
          <v-btn block type="submit">Join room</v-btn>
        </v-form>
        <v-divider class="my-6">
          <template #default>OR</template>
        </v-divider>
        <v-btn
          block
          color="primary"
          :loading="isFetching"
          variant="outlined"
          @click="createRoom()"
        >Create Room</v-btn>
      </v-card-text>
      <v-divider>Visited rooms</v-divider>
      <div class="d-flex flex-column overflow-scroll" style="max-height: 300px;">
        <v-list :items="store.visitedRoomsCodes" @click:select="router.push('/room/'+$event.id)" />
      </div>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import { appFetch, useAppStore } from '@/stores/app'
  const roomCode = ref<string>('')
  const router = useRouter()
  const { execute: createRoom, isFetching }
    = appFetch('/room/create', {
      afterFetch: ctx => {
        console.log(ctx)
        router.push('/room/' + ctx.data.code)
        return ctx
      },
      immediate: false,
    },
    ).post().json()

  const formValid = ref(false)
  function joinRoom () {
    if (!formValid.value) return
    router.push('/room/' + roomCode.value)
  }
  const store = useAppStore()
</script>
