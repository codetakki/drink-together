<template v-if="user">
  <v-text-field v-model="user.name" label="Name" />
  <v-text-field v-model.number="user.weightKg" label="Weight" type="number" />
  <v-radio-group
    v-model="user.sex"
    inline
    label="Body composition type"
  >
    <v-radio
      label="Male"
      value="male"
    />
    <v-radio
      label="Female"
      value="female"
    />
  </v-radio-group>
</template>

<script lang="ts" setup>
  import type { Player } from '@/types'

  const user = defineModel<Player>({ required: true })
</script>
