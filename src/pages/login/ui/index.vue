<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6">
          <v-card-title class="text-center mb-6">Авторизация</v-card-title>

          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="username"
              label="Логин"
              required
              :error-messages="errorMessage"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Пароль"
              type="password"
              required
            ></v-text-field>

            <v-btn
              type="submit"
              color="primary"
              block
              :loading="isLoading"
            >
              {{ isLoading ? 'Авторизация...' : 'Войти' }}
            </v-btn>
            <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/pages/login/model/store';
import { login } from '../model/auth';

const username = ref('Boris');
const password = ref('Pasternak');
const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(false);
const errorMessage = ref('');

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    const userData = await login(username.value, password.value);
    authStore.setUser(userData);
    router.push('/');
    
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Ошибка авторизации';
  } finally {
    isLoading.value = false;
  }
};
</script>