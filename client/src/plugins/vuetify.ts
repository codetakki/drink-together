/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#8e0d0bff',
        },
      },
    },
  },
  defaults: {

    VToolBar: {
      rounded: 'none',
    },
    VBtn: {
      variant: 'flat',
      color: 'primary',
      rounded: 'lg',

    },
    VTextField: {
      variant: 'solo-filled',
      density: 'comfortable',
      rounded: 'lg',

    },
    VCombobox: {
      variant: 'solo-filled',
      density: 'comfortable',
      rounded: 'lg',
    },
    VAutocomplete: {
      variant: 'solo-filled',
      density: 'comfortable',
      rounded: 'lg',
    },
    VCard: {
      rounded: 'lg',
    },
  },
})
