<template>
  <v-container class="my-4">
    <v-card class="pa-4" elevation="2">
      <v-row align="center">
        <v-col cols="auto">
          <template class="d-flex flex-column">
            <v-btn variant="text" class="text-caption text-grey cursor-text">
              Дата публикации: {{ formattedDate }}
              <span v-if="showEdited">(отредактировано {{ formattedUpdatedDate }})</span>
            </v-btn>
            <v-btn variant="text" class="text-caption text-grey" style="justify-content: flex-start;">Автор: {{ user.fullName }}</v-btn>
          </template>
        </v-col>
      </v-row>
      <v-card-title class="text-h5 font-weight-bold">
        {{ post.title }}
      </v-card-title>
      <v-card-text>
        <div class="text-body-1 mb-4">
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
          class="mt-2"
        >
          {{ expanded ? 'Свернуть' : 'Читать далее' }}
        </v-btn>
      </v-card-text>

      <v-card-actions class="mt-4">
        <v-btn 
          variant="text" 
          color="primary" 
          prepend-icon="mdi-comment-processing"
        >
          Комментариев: {{ post.comments.length }}
        </v-btn>
      </v-card-actions>

      <v-divider class="my-2"></v-divider>

      <v-card-actions v-if="isCommentsAllowed">
        <v-btn 
          variant="text" 
          color="secondary" 
          prepend-icon="mdi-comment-outline"
          @click="showComments = !showComments"
        >
          Комментарии ({{ post.comments.length }})
        </v-btn>
        
        <v-spacer></v-spacer>
      </v-card-actions>

      <v-expand-transition>
        <div v-if="showComments" class="pa-4">
          <v-list>
            <v-list-item 
              v-for="comment in post.comments" 
              :key="comment.id"
              class="mb-2"
            >
              <template v-slot:prepend>
                <v-avatar color="grey-lighten-2">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title>{{ comment.userInfo }}</v-list-item-title>
              <v-list-item-subtitle>{{ comment.text }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          
          <v-text-field
            v-model="newComment"
            label="Добавить комментарий"
            variant="outlined"
            append-icon="mdi-send"
            @click:append="addComment"
          ></v-text-field>
        </div>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Post } from '@/entities/post/type';
import type { UserInfo } from '@/entities/userInfo/type';
import { getPostInfo } from '@/pages/home/model/api';

const props = defineProps({
  post: {
    type: Object as () => Post,
    required: true
  },
  user: {
    type: Object as () => UserInfo,
    required: true
  },
  isCommentsAllowed: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: String,
    default: ''
  }
});

const expanded = ref(false);
const showComments = ref(false);
const newComment = ref('');

const formattedDate = computed(() => {
  const date = new Date(props.post.dateTime);
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
    minute: "2-digit"
  });
});

const showEdited = computed(() => {
  return props.updatedAt && props.updatedAt !== props.post.dateTime
})

const addComment = () => {};
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
</style>