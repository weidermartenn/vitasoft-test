<template>
  <v-container class="my-2 my-sm-4">
    <v-card class="pa-2 pa-sm-4" elevation="2">
      <v-row align="center">
        <v-col cols="12" sm="auto">
          <template class="d-flex flex-column">
            <div class="text-caption text-grey">
              Дата публикации: {{ formattedDate }}
              <span v-if="showEdited">
                (отредактировано {{ formattedUpdatedDate }})
              </span>
            </div>
            <v-btn
              @click="router.push(`/author/${user.id}`)"
              variant="text"
              class="text-caption text-grey px-0"
              style="justify-content: flex-start; min-width: auto"
            >
              Автор: {{ user.fullName }}
            </v-btn>
          </template>
        </v-col>
      </v-row>
      
      <v-card-title 
        @click.self="router.push(`/post/${post.id}`)" 
        class="text-h6 text-sm-h5 font-weight-bold px-0 pt-2"
      >
        {{ post.title }}
      </v-card-title>
      
      <v-card-text class="px-0">
        <div class="text-body-2 text-sm-body-1 mb-2 mb-sm-4">
          {{ post.briefDescription }}
        </div>

        <v-expand-transition>
          <div v-if="expanded" class="text-body-2">
            {{ post.fullDescription }}
          </div>
        </v-expand-transition>

        <v-btn
          variant="text"
          color="primary"
          @click="expanded = !expanded"
          class="mt-1 mt-sm-2 px-0"
          size="small"
        >
          {{ expanded ? "Свернуть" : "Читать далее" }}
        </v-btn>
      </v-card-text>

      <v-card-actions class="mt-2 mt-sm-4 px-0">
        <v-btn
          variant="text"
          color="primary"
          prepend-icon="mdi-comment-processing"
          size="small"
          class="px-0"
        >
          Комментариев: {{ post.comments.length }}
        </v-btn>
      </v-card-actions>

      <v-divider class="my-1 my-sm-2"></v-divider>

      <v-card-actions v-if="isCommentsAllowed" class="px-0">
        <v-btn
          variant="text"
          color="secondary"
          prepend-icon="mdi-comment-outline"
          @click="showComments = !showComments"
          size="small"
          class="px-0"
        >
          Комментарии ({{ post.comments.length }})
        </v-btn>

        <v-spacer></v-spacer>
      </v-card-actions>

      <v-expand-transition>
        <div v-if="showComments" class="pa-0 pa-sm-4">
          <div class="scroll-comments">
            <v-alert v-if="post.comments.length === 0" color="on-surface" type="info" density="compact">
              Комментариев нет...
            </v-alert>
            <v-list v-else density="compact">
              <v-list-item
                v-for="comment in post.comments"
                :key="comment.id"
                class="mb-1 mb-sm-2"
              >
                <template v-slot:prepend>
                  <v-avatar color="grey-lighten-2" size="small">
                    <v-icon size="small">mdi-account</v-icon>
                  </v-avatar>
                </template>
            
                <v-list-item-title class="mb-0 mb-sm-1 text-body-2">
                  {{ comment.userInfo }} 
                  <span class="span-date text-caption text-grey">{{ comment.dateTime }}</span>
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption text-sm-body-2">
                  {{ comment.textComment }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
        </div>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { Post } from "@/entities/post/type";
import type { UserInfo } from "@/entities/userInfo/type";

const router = useRouter();

const props = defineProps({
  post: {
    type: Object as () => Post,
    required: true,
  },
  user: {
    type: Object as () => UserInfo,
    required: true,
  },
  isCommentsAllowed: {
    type: Boolean,
    default: true,
  },
  updatedAt: {
    type: String,
    default: "",
  },
});

const expanded = ref(false);
const showComments = ref(false);

const formattedDate = computed(() => {
  const date = new Date(props.post.dateTime);
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

const formattedUpdatedDate = computed(() => {
  if (!props.updatedAt) return "";
  const date = new Date(props.updatedAt);
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

const showEdited = computed(() => {
  return props.updatedAt && props.updatedAt !== props.post.dateTime;
});
</script>

<style scoped lang="scss">
.v-card {
  transition: all 0.3s ease;
}

.v-card-title {
  cursor: pointer;
  transition: all 0.2s ease;
  word-break: break-word;

  &:hover {
    color: #616161;
    text-decoration: underline;
  }
}

.span-date {
  margin-left: 6px;
  color: #616161;
}

.scroll-comments {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;

  /* Кастомизация скроллбара */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

/* Адаптивные правки для очень маленьких экранов */
@media (max-width: 400px) {
  .v-card {
    border-radius: 0 !important;
  }
  
  .v-container {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>