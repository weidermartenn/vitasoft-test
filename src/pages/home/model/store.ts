import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { UserInfo } from "@/entities/userInfo/type";
import type { Post } from "@/entities/post/type";
import type { Comment } from "@/entities/comment/type";
import type { SavePostDto } from "@/entities/savepostdto/type";
import {
  addUserInfo,
  findAll,
  deleteUserInfo,
  addPost as apiAddPost,
  deletePost as apiDeletePost,
  updatePost,
  getPostInfo
} from "./api";
import type { UpdatePostDto } from "@/entities/updatepostdto/type";

export const useBlogStore = defineStore("blog", () => {
  const users = ref<UserInfo[]>([]);
  const posts = ref<Post[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchAllData = async () => {
    try {
      loading.value = true;
      error.value = null;
      users.value = await findAll();
      console.log(users.value);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Ошибка получения данных";
    } finally {
      loading.value = false;
    }
  };

  const addUser = async (blogName: string, fullname: string) => {
    try {
      loading.value = true;
      error.value = null;
      const user = await addUserInfo(blogName, fullname);
      users.value.push(user);
      return user;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Ошибка получения данных";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;
      await deleteUserInfo(id);
      users.value = users.value.filter((user) => user.id !== id);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Ошибка получения данных";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addPost = async (spd: SavePostDto, userId: number) => {
    try {
      loading.value = true;
      error.value = null;
      await apiAddPost(spd, userId);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Ошибка получения данных";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deletePost = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;
      await apiDeletePost(id);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Ошибка получения данных";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updatePostInfo = async (upd: UpdatePostDto) => {
    try {
      loading.value = true;
      error.value = null;
      await updatePost(upd);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Ошибка получения данных";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getPost = async (id: number) => {
    try {
      loading.value = true;
      error.value = null;
      const post = await getPostInfo(id);
      return post;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Ошибка получения данных";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    posts,
    loading,
    error,
    fetchAllData,
    addUser,
    deleteUser,
    addPost,
    deletePost,
    updatePostInfo,
    getPost
  };
});
