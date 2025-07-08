<template>
  <v-app>
    <v-app-bar height="64" color="transparent" elevation="0" class="d-flex justify-center">
      <v-container class="d-flex justify-center align-center fill-height">
        <span>dffdsf</span>
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { RouterView } from 'vue-router'
</script>

