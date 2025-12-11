<template>
  <div>
    <v-dialog v-model="showDialog">
      <template #activator="{props}">
        <v-btn v-bind="props" color="default" icon="mdi-pencil" />
      </template>
      <v-card title="Edit player">
        <v-card-text>
          <player-form v-if="updatedPlayer" v-model="updatedPlayer" />
          <v-btn block :loading="isFetching" @click="savePlayer">Save</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts" setup>
  import type { Player } from '@/types'
  import { appFetch, useAppStore } from '@/stores/app'

  const store = useAppStore()
  const updatedPlayer = ref<Player>()
  const modelValue = defineModel<Player>({ required: true, type: Object as () => Player })
  onMounted(() => {
    updatedPlayer.value = modelValue.value
  })

  const emits = defineEmits(['done'])

  const showDialog = ref(false)
  const { execute: savePlayer, isFetching } = appFetch(
    computed(() => `user/${updatedPlayer.value?.id}`), {
      immediate: false,
      afterFetch: ctx => {
        emits('done')
        store.fetchRoom()
        showDialog.value = false
        return ctx
      } },
  ).post(updatedPlayer).json()

</script>
