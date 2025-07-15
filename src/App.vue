<template>
  <v-app>
    <v-app-bar height="75" color="background" elevation="0">
      <v-container fluid>
        <v-row align="center" justify="space-between" no-gutters>
          <v-col
            cols="12"
            sm="6"
            class="d-flex align-center text-center text-sm-start"
          >
            <v-toolbar-title class="text-button font-weight-bold">
              VitaSoft Test Application by f14
            </v-toolbar-title>
          </v-col>

          <v-col
            cols="12"
            sm="6"
            class="d-flex align-center justify-center justify-sm-end mt-2 mt-sm-0"
          >
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
              @mouseenter="showIcon = true"
              @mouseleave="showIcon = false"
              variant="text"
              class="text-button"
            >
              <v-slide-x-reverse-transition>
                <v-icon
                  v-if="showIcon"
                  class="mr-2"
                  icon="mdi-logout"
                ></v-icon>
              </v-slide-x-reverse-transition>
              Выйти
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="fill-height pa-4" fluid>
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
