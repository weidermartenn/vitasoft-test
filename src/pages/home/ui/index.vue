<template>
  <v-container class="d-flex flex-column align-center" fluid max-width="900">
    <v-speed-dial location="start center" transition="scale-transition">
      <template v-slot:activator="{ props: activatorProps }">
        <v-fab
          v-bind="activatorProps"
          size="large"
          icon="mdi-animation"
        ></v-fab>
      </template>

      <v-btn
        v-for="action in actions"
        :key="action.id"
        @click="action.handler"
        icon
        v-tooltip="{ text: action.title, location: 'top' }"
      >
        <v-icon>{{ action.icon }}</v-icon>
      </v-btn>
    </v-speed-dial>

    <div class="d-flex flex-column align-center justify-center mb-8">
      <h2 class="text-h2 font-weight-bold mt-4">БЛОГИ</h2>
    </div>

    <v-container max-height="400">
      <v-row v-if="blogStore.loading" justify="center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-row>

      <v-row v-else-if="blogStore.error" justify="center">
        <v-alert type="error" class="ma-4">
          {{ blogStore.error }}
        </v-alert>
      </v-row>

      <v-row v-else-if="allPosts.length === 0" justify="center">
        <v-alert type="info" color="on-surface" class="ma-4">
          Постов пока нет
        </v-alert>
      </v-row>

      <v-col v-else cols="12">
        <div class="scroll-container">
          <v-slide-y-transition group>
            <post-card
              v-for="post in allPosts"
              :key="post.id"
              :post="post"
              :user="post.user"
              :is-comments-allowed="false"
              :updated-at="updatedPosts[post.id]"
            ></post-card>
          </v-slide-y-transition>
        </div>
      </v-col>
    </v-container>

    <v-dialog v-model="manageUserDialog" max-width="800" min-height="400">
      <v-card>
        <v-tabs v-model="userTab" bg-color="surface" align-tabs="center">
          <v-tab
            v-for="action in manageUserActions"
            :key="action.id"
            :value="action.id"
            :prepend-icon="action.prependIcon"
            >{{ action.title }}</v-tab
          >
        </v-tabs>
        <v-card-text class="pa-10">
          <v-tabs-window v-model="userTab">
            <v-tabs-window-item :value="1">
              <v-row v-if="blogStore.users.length === 0" justify="center">
                <v-alert type="info" color="on-surface" class="ma-4">
                  Список пользователей пуст
                </v-alert>
              </v-row>
              <v-row v-else-if="blogStore.loading" justify="center">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-row>
              <v-card
                v-else
                class="overflow-y-auto d-flex flex-column ga-4 pa-4"
                max-height="300"
              >
                <v-card-text
                  v-for="user in allData"
                  :key="user.id"
                  class="px-4 py-2 border-lg"
                >
                  <v-row justify="space-between" align="center">
                    <v-col cols="auto">
                      <template class="d-flex flex-column">
                        <span class="">Идентификатор: {{ user.id }}</span>
                        <span>Имя: {{ user.fullName }}</span>
                      </template>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                        @click="handleDeleteClick(user.id, 'user')"
                        :color="
                          confirmingDelete[user.id] ? 'error' : 'secondary'
                        "
                        variant="flat"
                        v-tooltip="{
                          text: confirmingDelete[user.id]
                            ? 'Подтвердите удаление'
                            : 'Удалить',
                          location: 'left',
                        }"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col cols="auto">
                      <span class="">Блоги: {{ user.blogName }}</span>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>
            <v-tabs-window-item :value="2">
              <v-form
                ref="form"
                @submit.prevent="validateAndSubmit"
                class="d-flex flex-column ga-3 mt-4"
              >
                <v-text-field
                  v-model="fullName"
                  label="Имя пользователя"
                  variant="outlined"
                  maxlength="50"
                  counter
                  :rules="inputRules"
                  aria-required="true"
                ></v-text-field>
                <v-text-field
                  v-model="blogName"
                  label="Название блога"
                  variant="outlined"
                  maxlength="50"
                  counter
                  :rules="inputRules"
                  aria-required="true"
                ></v-text-field>
                <v-row justify="center" class="mt-6">
                  <v-col cols="6">
                    <v-btn type="submit" color="surface" block>
                      Добавить
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="managePostDialog"
      max-height="900"
      max-width="800"
      min-height="400"
    >
      <v-card>
        <v-tabs v-model="postTab" bg-color="surface" align-tabs="center">
          <v-tab
            v-for="action in managePostActions"
            :key="action.id"
            :value="action.id"
            :prepend-icon="action.prependIcon"
          >
            {{ action.title }}
          </v-tab>
        </v-tabs>

        <v-tabs-window v-model="postTab">
          <v-tabs-window-item :value="1">
            <v-card-text class="pa-10">
              <v-row v-if="allPosts.length === 0" justify="center">
                <v-alert type="info" color="on-surface" class="ma-4">
                  Список постов пуст
                </v-alert>
              </v-row>
              <v-row v-else-if="blogStore.loading" justify="center">
                <v-progress-circular indeterminate color="primary" />
              </v-row>
              <v-card
                v-else
                class="overflow-y-auto d-flex flex-column ga-4 pa-4"
                max-height="300"
              >
                <v-card-text
                  v-for="post in allPosts"
                  :key="post.id"
                  class="px-4 py-2 border-lg"
                >
                  <v-row justify="space-between" align="center">
                    <v-col cols="auto">
                      <template class="d-flex flex-column">
                        <span>Идентификатор: {{ post.id }}</span>
                        <span>Заголовок: {{ post.title }}</span>
                      </template>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                        @click="handleDeleteClick(post.id, 'post')"
                        :color="
                          confirmingDelete[post.id] ? 'error' : 'secondary'
                        "
                        variant="flat"
                        v-tooltip="{
                          text: confirmingDelete[post.id]
                            ? 'Подтвердите удаление'
                            : 'Удалить',
                          location: 'left',
                        }"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-tabs-window-item>

          <v-tabs-window-item :value="2">
            <v-card-text class="overflow-y-auto pa-10">
              <v-form
                ref="postForm"
                @submit.prevent="handleAddPost"
                class="mt-2"
              >
                <v-container
                  fluid
                  class="overflow-y-auto d-flex flex-column ga-3"
                >
                  <v-radio-group v-model="postMode" inline row>
                    <v-radio label="Добавить пост" value="add" />
                    <v-radio label="Редактировать пост" value="edit" />
                  </v-radio-group>

                  <v-combobox
                    v-if="postMode === 'add'"
                    v-model="selectedUser"
                    clearable
                    variant="outlined"
                    label="Выберите пользователя"
                    :rules="inputRules"
                    :items="
                      allData.map((user) => ({
                        title: user.fullName,
                        value: user.id,
                      }))
                    "
                    item-title="title"
                    item-value="value"
                    required
                  />

                  <v-combobox
                    v-else
                    v-model="selectedPost"
                    clearable
                    variant="outlined"
                    label="Выберите пост"
                    :rules="inputRules"
                    :items="
                      allPosts.map((post) => ({
                        title: post.title,
                        value: post.id,
                      }))
                    "
                    item-title="title"
                    item-value="value"
                    @update:model-value="loadPostData"
                    required
                  />

                  <v-text-field
                    v-model="title"
                    variant="outlined"
                    label="Заголовок"
                    :rules="inputRules"
                    maxlength="50"
                    counter
                    required
                  />
                  <v-textarea
                    v-model="briefDescription"
                    variant="outlined"
                    label="Краткое описание"
                    :rules="inputRules"
                    maxlength="100"
                    counter
                    required
                  />
                  <v-textarea
                    v-model="fullDescription"
                    variant="outlined"
                    label="Полное описание"
                    :rules="inputRules"
                    maxlength="255"
                    counter
                    required
                  />
                  <v-row justify="center" class="mt-6">
                    <v-col cols="6">
                      <v-btn type="submit" variant="flat" color="surface" block>
                        {{ postMode === "add" ? "Добавить" : "Сохранить" }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { useBlogStore } from "../model/store";
import type { UserInfo } from "@/entities/userInfo/type";
import type { Post } from "@/entities/post/type";
import { PostCard } from "@/components/postcard";
import logo from "@/app/assets/wflogo.svg";
import type { SavePostDto } from "@/entities/savepostdto/type";
import { useRefs } from "vuetify/lib/composables/refs.mjs";
import type { UpdatePostDto } from "@/entities/updatepostdto/type";

const manageUserDialog = ref(false);
const managePostDialog = ref(false);
const confirmingDelete = reactive<Record<number, boolean>>({});
const form = ref();
const postForm = ref();
const blogName = ref("");
const fullName = ref("");
const title = ref("");
const briefDescription = ref("");
const fullDescription = ref("");
const selectedUser = ref<{ title: string; value: number } | null>(null);
const allData = ref<UserInfo[]>([]);
const allPosts = ref<Post[]>([]);
const updatedPosts = ref<Record<number, string>>({});
const userTab = ref(null);
const postTab = ref(null);
const postMode = ref<"add" | "edit">("add");
const selectedPost = ref<{ title: string; value: number } | null>(null);

const actions = [
  {
    id: 1,
    icon: "mdi-account-group",
    title: "Управление пользователями",
    handler: () => {
      manageUserDialog.value = !manageUserDialog.value;
    },
  },
  {
    id: 2,
    icon: "mdi-card-minus",
    title: "Управление постами",
    handler: () => {
      managePostDialog.value = !managePostDialog.value;
    },
  },
];

const manageUserActions = [
  {
    id: 1,
    prependIcon: "mdi-view-list",
    title: "Список пользователей",
  },
  {
    id: 2,
    prependIcon: "mdi-account-plus",
    title: "Добавить пользователя",
  },
];

const managePostActions = [
  {
    id: 1,
    prependIcon: "mdi-view-list",
    title: "Список постов",
  },
  {
    id: 2,
    prependIcon: "mdi-card-plus",
    title: "Добавить/Редактировать пост",
  },
];

const inputRules = [(v: string) => !!v || "Поле обязательно"];

const blogStore = useBlogStore();

const validateAndSubmit = async () => {
  const { valid } = await form.value.validate();

  if (!valid) return;

  try {
    await blogStore.addUser(blogName.value, fullName.value);
    manageUserDialog.value = false;
    blogName.value = "";
    fullName.value = "";
    form.value.resetValidation();
  } catch (err) {
    throw err;
  }
};

const closeDialog = async () => {
  manageUserDialog.value = !manageUserDialog.value;
  await blogStore.fetchAllData();
};

const deleteUser = async (id: number) => {
  try {
    await blogStore.deleteUser(id);
    await blogStore.fetchAllData();
    allData.value = blogStore.users;
    confirmingDelete[id] = false;
  } catch (err) {
    throw err;
  }
};

const deletePost = async (id: number) => {
  try {
    await blogStore.deletePost(id);
    await blogStore.fetchAllData();
    allPosts.value = blogStore.posts;
  } catch (err) {
    throw err;
  }
};

const deleteHandlers: Record<"user" | "post", (id: number) => Promise<void>> = {
  user: async (id: number) => {
    await deleteUser(id);
    allData.value = blogStore.users;
  },
  post: async (id: number) => {
    await deletePost(id);
    allPosts.value = blogStore.posts;
  },
};

let confirmationTimeouts = new Map<number, number>();

const handleDeleteClick = async (id: number, type: "user" | "post") => {
  if (!confirmingDelete[id]) {
    confirmingDelete[id] = true;

    const timeout = setTimeout(() => {
      confirmingDelete[id] = false;
      confirmationTimeouts.delete(id);
    }, 3000);

    confirmationTimeouts.set(id, timeout);
    return;
  }

  clearTimeout(confirmationTimeouts.get(id));
  confirmingDelete[id] = false;
  confirmationTimeouts.delete(id);

  const handler = deleteHandlers[type];
  if (handler) {
    await handler(id);
    await blogStore.fetchAllData();
    updateAllPosts();
  }
};

const handleAddPost = async () => {
  try {
    if (postMode.value === "add") {
      const newPost: SavePostDto = {
        title: title.value,
        briefDescription: briefDescription.value,
        fullDescription: fullDescription.value,
      };
      await blogStore.addPost(newPost, selectedUser.value?.value!);
    } else if (postMode.value === "edit" && selectedPost.value != null) {
      const editedPost: UpdatePostDto = {
        id: selectedPost.value.value,
        title: title.value,
        briefDescription: briefDescription.value,
        fullDescription: fullDescription.value,
      };

      await handleEditPost(editedPost.id, editedPost);
      await blogStore.updatePostInfo(editedPost);
    }

    await blogStore.fetchAllData();
    allData.value = blogStore.users;
    updateAllPosts();
    postForm.value.resetValidation();
    postMode.value = "add";
  } catch (err) {
    throw err;
  }
};

const updateAllPosts = () => {
  allPosts.value = blogStore.users
    .flatMap((user) =>
      user.post.map((post) => ({
        ...post,
        user,
      }))
    )
    .sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    );
};

const handleEditPost = async (postId: number, updatedData: UpdatePostDto) => {
  const oldPost = allPosts.value.find(p => p.id === postId);
  await blogStore.updatePostInfo(updatedData);

  const freshPost = await blogStore.getPost(postId);
  if (freshPost && oldPost && freshPost.dateTime !== oldPost.dateTime) {
    updatedPosts.value[postId] = freshPost.dateTime;
  }

  await blogStore.fetchAllData();
  allData.value = blogStore.users;
  updateAllPosts();
};

const loadPostData = (selected: { title: string; value: number }) => {
  if (!selected) return;
  const post = allPosts.value.find((p) => p.id === selected.value);
  if (post) {
    title.value = post.title;
    briefDescription.value = post.briefDescription;
    fullDescription.value = post.fullDescription;
  }
};

onMounted(async () => {
  await blogStore.fetchAllData();
  allData.value = blogStore.users;
  updateAllPosts();
});
</script>

<style scoped>
.scroll-container {
  overflow-y: auto;
  padding: 0 16px;
  max-height: 400px;
}

.scroll-container::-webkit-scrollbar {
  width: 6px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.scroll-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
