<template>
  <v-card>
    <v-card-title class="d-flex">
      {{ player.name }} Stats <v-spacer /> <EditPlayer :model-value="player" />
    </v-card-title>
    <v-card-text>
      <div class="text-body-1">
        Current Promille: ≈{{ player.promilleAmount }}%<br>
        Weight: {{ player.weightKg }}Kg<br>
        Composition: {{ player.sex }}<br>
        Drinks drunk: {{ player.drinks?.length }} <v-icon icon="mdi-liquor" inline />
      </div>
      <v-data-table
        class="border rounded mt-4"
        density="compact"
        fixed-header
        :headers="headers"
        height="350"
        :hide-default-footer="true"
        :hide-default-header="true"
        :items="player.drinks"
        :items-per-page="player.drinks?.length"
        mobile
        no-data-text="No drinks added yet"
        :sort-by="[{key: 'createdAt', order: 'desc'}]"
      >
        <template #item.actions="{item}">
          <v-btn color="default" icon="mdi-pencil" variant="text" @click="editDrink = item" />
          <Confirm :button-props="{icon: 'mdi-delete', variant: 'text', color: 'default', loading: loadingDeleteDrink}" @confirm="deleteDrink(item)" />
        </template>
      </v-data-table>
    </v-card-text>

  </v-card>
  <v-dialog :model-value="!!editDrink" @update:model-value="$event ? '' : editDrink = undefined">
    <template v-if="editDrink" #default>
      <v-card title="Edit drink">
        <template #text>
          <DrinkForm v-model="editDrink" />
          <v-btn block :loading="updatingDrinkLoading" @click="saveDrink">save</v-btn>
        </template>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
  import type { VDataTable } from 'vuetify/components/VDataTable'
  import type { DrinkEntity, Player } from '@/types'
  import { appFetch, useAppStore } from '@/stores/app'

  const store = useAppStore()
  defineEmits(['playerUpdated'])
  const player = defineModel<Player>({
    required: true,
  })
  const headers: VDataTable['$props']['headers'] = [
    {
      key: 'title',
      title: 'Drink',
    },
    {
      key: 'percentageAlcohol',
      title: 'Alcohol',
      value (v: DrinkEntity) {
        return v.percentageAlcohol + '%'
      },
      sortable: true,

    },
    {
      key: 'amountMl',
      title: 'Amount ml',
      sortable: true,

    },
    {
      key: 'createdAt',
      title: 'Added',
      value (v: DrinkEntity) {
        const date = new Date(v.createdAt)
        return date.toLocaleString('sv-SE')
      },
      sortable: true,
    },
    {
      key: 'actions',
      title: 'Actions',
    },
  ]

  const editDrink = ref<DrinkEntity>()

  const { execute: saveDrink, isFetching: updatingDrinkLoading } = appFetch(
    computed(() => {
      return '/drink/' + editDrink.value?.id
    }), {
      immediate: false,
      afterFetch (ctx) {
        store.fetchRoom()
        editDrink.value = undefined
        return ctx
      } }).post(editDrink)

  const drinkToDelete = ref<DrinkEntity>()
  function deleteDrink (drink: DrinkEntity) {
    drinkToDelete.value = drink
    deleteDrinkRequest()
  }
  const { execute: deleteDrinkRequest, isFetching: loadingDeleteDrink } = appFetch(computed(() => {
    return '/drink/' + drinkToDelete.value?.id
  },
  ), { afterFetch (ctx) {
    store.fetchRoom()
    return ctx
  } }).delete()
</script>
