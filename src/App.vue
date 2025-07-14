<template>
  <v-app>
    <v-app-bar height="64" color="background" elevation="0" >
      <v-container class="d-flex align-center">
        <v-toolbar-title class="ml-2 text-button font-weight-bold">
          VitaSoft Test Application by f14
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-chip
          class="mr-2"
          :color="authStore.isAuthenticated() ? 'green' : 'red'"
          :prepend-icon="
            authStore.isAuthenticated()
              ? 'mdi-check-circle'
              : 'mdi-alert-circle'
          "
        >
          {{ authStore.isAuthenticated() ? "Авторизован" : "Не авторизован" }}
        </v-chip>

        <v-btn
          v-if="authStore.isAuthenticated()"
          @click="logout"
          @mouseenter="showIcon = !showIcon"
          @mouseleave="showIcon = !showIcon"
          variant="text"
          class="text-button"
        >
          <v-slide-x-reverse-transition>
            <v-icon class="mr-4" v-if="showIcon" icon="mdi-logout"></v-icon>
          </v-slide-x-reverse-transition>
          Выйти
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height" fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/pages/login/model/store";
import { useRouter } from "vue-router";
import { ref } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const showIcon = ref(false);

const logout = () => {
  authStore.clearUser();
  router.push("/login");
};
</script>
