<template>
  <v-container class="py-10" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-btn variant="text" class="mb-4" @click="router.back()">
          Вернуться назад
        </v-btn>

        <v-card v-if="post" elevation="2" class="pa-4">
          <v-card-title class="text-h6 text-md-h4 text-lg-h3 font-weight-bold mb-2">
            {{ post.title }}
          </v-card-title>

          <v-card-subtitle class="text-caption text-sm-subtitle-1 text-grey">
            {{ formattedDate }}
            <span v-if="isEdited">(отредактировано)</span>
          </v-card-subtitle>

          <v-divider class="my-4" />

          <v-card-text>
            <p class="text-body-1 mb-4">
              <strong>Краткое описание:</strong><br />
              {{ post.briefDescription }}
            </p>
            <p class="text-body-1">
              <strong>Полное описание:</strong><br />
              {{ post.fullDescription }}
            </p>
          </v-card-text>

          <v-divider class="my-4" />

          <v-btn
            variant="text"
            color="secondary"
            prepend-icon="mdi-comment-outline"
            @click="showComments = !showComments"
          >
            Комментарии ({{ post.comments.length }})
          </v-btn>

          <v-expand-transition>
            <div v-if="showComments" class="mt-4 scroll-comments">
              <v-alert
                v-if="post.comments.length === 0"
                type="info"
                color="on-surface"
              >
                Пока нет комментариев
              </v-alert>

              <v-list v-else>
                <v-list-item
                  v-for="comment in post.comments"
                  :key="comment.id"
                  class="mb-3"
                >
                  <template v-slot:prepend>
                    <v-avatar color="grey-lighten-2">
                      <v-icon>mdi-account</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-content>
                    <v-list-item-title
                      class="font-weight-bold d-flex justify-space-between align-center"
                    >
                      <span>
                        {{ comment.userInfo }}
                        <span class="text-caption text-grey ml-2">
                          {{ new Date(comment.dateTime).toLocaleString() }}
                        </span>
                      </span>
                      <v-btn
                        size="small"
                        :color="
                          confirmingCommentDelete[comment.id]
                            ? 'error'
                            : 'secondary'
                        "
                        @click="handleCommentDeleteClick(comment.id)"
                        v-tooltip="{
                          text: confirmingCommentDelete[comment.id]
                            ? 'Подтвердите удаление'
                            : 'Удалить',
                          location: 'top',
                        }"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-title>

                    <v-list-item-subtitle>
                      {{ comment.textComment }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-expand-transition>

          <v-divider class="my-4" />
          <h3 class="text-h6 font-weight-medium mb-3">Добавить комментарий</h3>

          <v-form
            ref="commentForm"
            @submit.prevent="submitComment"
            class="d-flex flex-column ga-4"
          >
            <v-text-field
              v-model="commentName"
              label="Ваше имя"
              variant="outlined"
              :rules="rules"
              maxlength="50"
              counter
            />
            <v-text-field
              v-model="commentEmail"
              label="Email"
              variant="outlined"
              :rules="[...rules, emailRule]"
              maxlength="50"
              counter
            />
            <v-textarea
              v-model="commentText"
              label="Комментарий"
              variant="outlined"
              :rules="rules"
              maxlength="255"
              counter
            />
            <v-btn variant="elevated" type="submit" class="mt-2" color="primary">
              Отправить
            </v-btn>
          </v-form>
        </v-card>

        <v-alert
          v-else
          type="error"
          variant="tonal"
          class="mt-6"
          text="Пост не найден"
        />
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { addCommment, getPostInfo, deleteComment } from "@/shared/api/backendApi";
import type { Post } from "@/entities/post/type";
import type { SaveCommentDto } from "@/entities/savecommentdto/type";

const route = useRoute();
const router = useRouter();
//@ts-ignore
const postId = Number(route.params.id);
const post = ref<Post | null>(null);

const commentName = ref("");
const commentEmail = ref("");
const commentText = ref("");
const commentForm = ref();

const showComments = ref(false);

const rules = [(v: string) => !!v || "Поле обязательно"];
const emailRule = (v: string) => /.+@.+\..+/.test(v) || "Некорректный email";

const confirmingCommentDelete = reactive<Record<number, boolean>>({});
let commentDeleteTimeouts = new Map<number, number>();

const fetchPost = async () => {
  try {
    const data = await getPostInfo(postId);
    post.value = data;
  } catch (err) {
    console.error("Ошибка получения поста", err);
  }
};

const formattedDate = computed(() => {
  if (!post.value) return "";
  return new Date(post.value.dateTime).toLocaleString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

const isEdited = computed(() => {
  return post.value?.updatedAt && post.value.updatedAt !== post.value.dateTime;
});

const submitComment = async () => {
  const { valid } = await commentForm.value.validate();
  if (!valid) return;

  const newComment: SaveCommentDto = {
    userInfo: commentName.value,
    email: commentEmail.value,
    textComment: commentText.value,
  };

  try {
    await addCommment(newComment, postId);
    await fetchPost();

    commentName.value = "";
    commentEmail.value = "";
    commentText.value = "";
    commentForm.value.resetValidation();
  } catch (err) {
    throw err;
  }
};

const handleCommentDeleteClick = async (id: number) => {
  if (!confirmingCommentDelete[id]) {
    confirmingCommentDelete[id] = true;

    const timeout = setTimeout(() => {
      confirmingCommentDelete[id] = false;
      commentDeleteTimeouts.delete(id);
    }, 3000);

    commentDeleteTimeouts.set(id, timeout);
    return;
  }

  clearTimeout(commentDeleteTimeouts.get(id));
  confirmingCommentDelete[id] = false;
  commentDeleteTimeouts.delete(id);

  try {
    await deleteComment(id);
    await fetchPost();
  } catch (err) {
    console.error("Ошибка удаления комментария:", err);
  }
};

onMounted(fetchPost);
</script>

<style scoped lang="scss">
.scroll-comments {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

@media (max-width: 600px) {
  .text-h6 {
    font-size: 1.2rem !important;
  }

  .text-md-h4,
  .text-lg-h3 {
    font-size: 1.5rem !important;
  }

  .text-body-1 {
    font-size: 0.95rem !important;
    line-height: 1.4rem;
  }

  .v-list-item-subtitle {
    font-size: 0.9rem !important;
    line-height: 1.3rem;
  }

  .v-list-item-title {
    font-size: 1rem !important;
    flex-wrap: wrap;
  }

  .v-btn {
    font-size: 0.9rem !important;
    min-height: 36px;
  }

  .v-card {
    padding: 16px !important;
  }

  .v-form {
    gap: 1rem;
  }

  .scroll-comments {
    max-height: 200px;
  }
}
</style>
