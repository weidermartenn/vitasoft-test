// stores/auth.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/entities/user/type';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);

  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }

  const setUser = (data: User) => {
    user.value = data;
    localStorage.setItem('user', JSON.stringify(data));
  };

  const clearUser = () => {
    user.value = null;
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return user.value !== null;
  };

  return { user, setUser, clearUser, isAuthenticated };
});
