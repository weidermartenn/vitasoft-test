/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'system',
    themes: {
      light: {
        colors: {
          background: '#FFFFFF',
          surface: '#F5F5F5',
          'surface-variant': '#E0E0E0',
          'on-surface': '#212121',
          'on-surface-variant': '#424242',
          primary: '#616161',
          'primary-darken-1': '#424242',
          secondary: '#9E9E9E',
          'secondary-darken-1': '#757575',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        }
      },
      dark: {
        colors: {
          background: '#121212',
          surface: '#1E1E1E',
          'surface-variant': '#424242',
          'on-surface': '#E0E0E0',
          'on-surface-variant': '#BDBDBD',
          primary: '#9E9E9E',
          'primary-darken-1': '#BDBDBD',
          secondary: '#616161',
          'secondary-darken-1': '#757575',
          error: '#CF6679',
          info: '#90CAF9',
          success: '#81C784',
          warning: '#FFB74D',
        }
      }
    }
  }
})
