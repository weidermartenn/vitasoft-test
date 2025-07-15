<template>
  <v-container class="profile-container py-6 py-md-10" fluid>
    <!-- Шапка профиля -->
    <v-row justify="center" class="mb-6 mb-md-8">
      <v-col cols="12" md="10" lg="8" xl="6">
        <v-btn
          variant="text"
          class="back-btn mb-4"
          @click="router.back()"
          prepend-icon="mdi-arrow-left"
        >
          Вернуться назад
        </v-btn>

        <v-card class="profile-card pa-4 pa-md-6" elevation="2">
          <v-row align="center" justify="center" no-gutters>
            <v-col cols="auto" class="mr-4 mr-md-6">
              <v-avatar color="primary-lighten-2" size="64">
                <v-icon size="32">mdi-account</v-icon>
              </v-avatar>
            </v-col>
            <v-col class="profile-info">
              <div class="text-h7 text-sm-h6 text-md-h4 font-weight-bold">
                {{ user?.fullName }}
              </div>
              <div class="text-subtitle-1 text-grey-darken-1 mt-1">
                {{ user?.blogName }}
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Форма добавления поста -->
    <v-row justify="center" class="mb-6">
      <v-col cols="12" md="10" lg="8" xl="6">
        <v-btn
          color="primary"
          variant="tonal"
          class="toggle-form-btn mb-4"
          @click="showForm = !showForm"
          block
          :prepend-icon="showForm ? 'mdi-close' : 'mdi-plus'"
          size="large"
        >
          {{ showForm ? "Скрыть форму" : "Добавить пост" }}
        </v-btn>

        <v-expand-transition>
          <v-card v-show="showForm" class="form-card mb-6" elevation="2">
            <v-form
              ref="form"
              @submit.prevent="submitPost"
              class="pa-4 pa-md-6"
            >
              <v-text-field
                v-model="title"
                label="Заголовок"
                variant="outlined"
                maxlength="50"
                counter
                :rules="rules"
                density="comfortable"
                class="mb-4"
              />

              <v-textarea
                v-model="briefDescription"
                label="Краткое описание"
                variant="outlined"
                maxlength="100"
                counter
                :rules="rules"
                density="comfortable"
                auto-grow
                rows="2"
                class="mb-4"
              />

              <v-textarea
                v-model="fullDescription"
                label="Полное описание"
                variant="outlined"
                maxlength="255"
                counter
                :rules="rules"
                density="comfortable"
                auto-grow
                rows="3"
                class="mb-6"
              />

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
              >
                Опубликовать
              </v-btn>
            </v-form>
          </v-card>
        </v-expand-transition>
      </v-col>
    </v-row>

    <!-- Список постов -->
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8" xl="6">
        <template v-if="posts.length === 0">
          <v-alert type="info" class="no-posts-alert">
            Пользователь пока не опубликовал ни одного поста
          </v-alert>
        </template>

        <template v-else>
          <v-slide-y-transition group>
            <post-card
              v-for="post in posts"
              :key="post.id"
              :post="post"
              :user="user!"
              :is-comments-allowed="true"
              :updated-at="updatedPostTimestamps[post.id]"
              class="mb-4"
            />
          </v-slide-y-transition>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Скрипт оставлен без изменений
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBlogStore } from "@/pages/home/model/store";
import { PostCard } from "@/components/postcard";
import type { UserInfo } from "@/entities/userInfo/type";
import type { SavePostDto } from "@/entities/savepostdto/type";
import { getPostInfo } from "@/shared/api/backendApi";

const route = useRoute();
const router = useRouter();
//@ts-ignore
const userId = Number(route.params.id);

const blogStore = useBlogStore();
const user = ref<UserInfo | null>(null);
const posts = ref<any[]>([]);
const updatedPostTimestamps = ref<Record<number, string>>({});
const showForm = ref(false);

// Форма
const title = ref("");
const briefDescription = ref("");
const fullDescription = ref("");
const form = ref();

const rules = [(v: string) => !!v || "Поле обязательно"];

const fetchUserData = async () => {
  await blogStore.fetchAllData();
  user.value = blogStore.users.find((u) => u.id === userId) || null;

  if (user.value) {
    posts.value = user.value.post.sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    );

    for (const post of posts.value) {
      try {
        const fresh = await getPostInfo(post.id);
        if (
          fresh.title !== post.title ||
          fresh.briefDescription !== post.briefDescription ||
          fresh.fullDescription !== post.fullDescription
        ) {
          updatedPostTimestamps.value[post.id] = new Date().toISOString();
        }
      } catch (err) {
        console.warn(`Не удалось получить post #${post.id}`);
      }
    }
  }
};

const submitPost = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  const postData: SavePostDto = {
    title: title.value,
    briefDescription: briefDescription.value,
    fullDescription: fullDescription.value,
  };

  await blogStore.addPost(postData, userId);
  await fetchUserData();

  title.value = "";
  briefDescription.value = "";
  fullDescription.value = "";
  form.value.resetValidation();
  showForm.value = false;
};

onMounted(fetchUserData);
</script>

<style scoped lang="scss">
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 80px;
}

.back-btn {
  padding-left: 0;
  text-transform: none;
  letter-spacing: normal;
}

.profile-card {
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.toggle-form-btn {
  border-radius: 8px;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

.form-card {
  border-radius: 12px;
  overflow: hidden;
}

.no-posts-alert {
  border-radius: 8px;
}

@media (max-width: 960px) {
  .profile-container {
    padding-left: 16px;
    padding-right: 16px;
  }

  .profile-card {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .profile-info {
    text-align: center;
    margin-top: 12px;
  }

  .profile-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>