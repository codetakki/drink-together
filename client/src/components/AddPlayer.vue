<template>
  <v-dialog v-model="showDialog">
    <template #activator="{props}">
      <v-btn v-bind="props" icon="mdi-account-plus-outline" />
    </template>
    <template #default>
      <v-card color="surface" title="Add Player">
        <v-card-text>
          <player-form v-model="user" />
          <v-btn @click="addPlayer">Add User</v-btn>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>
<script lang="ts" setup>
  import type { Player } from '@/types'
  import { appFetch } from '@/stores/app'

  const { roomCode } = defineProps(['roomCode'])
  const emit = defineEmits(['done'])
  const showDialog = ref(false)
  const defaultUser = {
    name: '',
    weightKg: 0,
    sex: 'male',
  }
  const user = ref<Player>({
    ...defaultUser,
  })

  watch(showDialog, () => {
    user.value = {
      ...defaultUser,
    }
  })
  const { execute: addPlayer } = appFetch(
    computed(() => `room/${roomCode}/add-player`), {
      immediate: false,
      afterFetch: ctx => {
        showDialog.value = false
        emit('done', ctx.data)
        return ctx
      } },
  ).post(user).json()
</script>
