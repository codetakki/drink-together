<template>
  <v-bottom-sheet v-model="show">
    <template #activator="{props}">
      <v-btn v-bind="props" block>Add drink</v-btn>
    </template>
    <v-card block prepend-icon="mdi-liquor" title="Add drink">
      <v-card-text>
        <v-form ref="form" v-model="validForm" @submit.prevent="submit">
          <v-autocomplete
            v-model="participatingPlayers"
            chips
            closable-chips
            density="default"
            item-title="name"
            item-value="id"
            :items="players"
            label="Participating players"
            multiple
            :rules="[(v: Array<Object>) => {return !v || v.length > 0 || 'Select at least one player'}]"
          />
          <DrinkForm v-model="drink" />

          <v-btn block :loading="isFetching" type="submit">Save drinks</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>

</template>

<script setup lang="ts">
  import type { DrinkEntity, Player } from '@/types'
  import { appFetch } from '@/stores/app'

  const show = ref(false)
  const validForm = ref(false)
  const drink = ref<Partial<DrinkEntity>>({})
  const participatingPlayers = ref<Player['id'][]>([])
  const emit = defineEmits(['done'])
  const _props = defineProps(
    { players: {
      type: Array<Player>,
    } })

  const formRef = useTemplateRef('form')

  async function submit () {
    await formRef.value?.validate()
    if (!validForm.value) return

    sendFormRequest()
  }

  const { execute: sendFormRequest, isFetching } = appFetch('/room/add-drinks', { immediate: false, afterFetch (ctx) {
    emit('done')
    show.value = false
    return ctx
  } })
    .post(() => {
      return { drink: drink.value, players: participatingPlayers.value }
    })
</script>
