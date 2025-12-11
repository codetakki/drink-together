<template>
  <v-dialog v-model="showDialog">
    <template #activator="activatorprops">
      <slot v-bind="activatorprops">
        <v-btn v-bind="{...activatorprops.props, ...buttonProps}" />
      </slot>
    </template>
    <template #default>
      <v-card :text="message" :title="title">
        <v-card-actions>
          <v-btn :text="declineText" @click="showDialog = false; emits('decline', false)" />
          <v-btn :text="confirmText" @click="showDialog = false; emits('confirm', false)" />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
  <script lang="ts" setup>
  import { VBtn } from 'vuetify/components'

  const showDialog = ref(false)
  const props = defineProps({
    buttonProps: Object,
    title: {
      type: String,
      default: 'Confirm',
    },
    message: {
      type: String,
      default: 'Are you sure?',
    },
    confirmText: {
      type: String,
      default: 'Confirm',
    },
    declineText: {
      type: String,
      default: 'Cancel',
    },
  })

  const emits = defineEmits(['confirm', 'decline'])
  </script>
