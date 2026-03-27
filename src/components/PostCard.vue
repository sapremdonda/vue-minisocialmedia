<template>
  <div class="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
    
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
          {{ post.author_username.charAt(0).toUpperCase() }}
        </div>
        <div>
          <router-link :to="`/profile/${post.author_id}`" class="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            @{{ post.author_username }}
          </router-link>
          <div class="text-xs text-slate-400 dark:text-slate-500">{{ new Date(post.timestamp).toLocaleString() }}</div>
        </div>
      </div>
      
      <button v-if="post.author_id === authStore.currentUser?.id" @click="postStore.deletePost(post.id)" class="text-slate-400 hover:text-rose-500 transition-colors p-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
      </button>
    </div>

    <p class="text-slate-800 dark:text-slate-200 mb-5 whitespace-pre-wrap leading-relaxed">{{ post.text }}</p>

    <div class="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
      <button @click="postStore.toggleLike(post.id)" class="flex items-center gap-2 text-sm font-medium transition-colors" :class="post.hasLiked ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'">
        <svg xmlns="http://www.w3.org/2000/svg" :fill="post.hasLiked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
        {{ post.likesCount }}
      </button>

      <button @click="showComments = !showComments" class="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" /></svg>
        {{ post.comments?.length || 0 }}
      </button>
    </div>

    <div v-if="showComments" class="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700 space-y-4">
      <div v-for="comment in post.comments" :key="comment.id" class="flex gap-3">
        <div class="w-8 h-8 shrink-0 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold">
          {{ comment.author_username.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-2xl px-4 py-3 border border-slate-100 dark:border-slate-700/50">
          <div class="flex justify-between items-start mb-1">
            <span class="font-bold text-sm text-slate-900 dark:text-white">@{{ comment.author_username }}</span>
            <button v-if="comment.author_id === authStore.currentUser?.id" @click="postStore.deleteComment(comment.id)" class="text-xs text-slate-400 hover:text-rose-500">Delete</button>
          </div>
          <p class="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{{ comment.text }}</p>
        </div>
      </div>

      <form @submit.prevent="submitComment" class="flex gap-3 mt-4">
        <div class="w-8 h-8 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
          {{ authStore.currentUser.username.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-1 relative">
          <input v-model="newComment" type="text" placeholder="Write a comment..." class="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-full pl-4 pr-12 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none">
          <button type="submit" :disabled="!newComment.trim()" class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 dark:text-indigo-400 disabled:opacity-50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePostStore } from '@/stores/postStore';
import { useAuthStore } from '../stores/authStore';

const props = defineProps({
  post: { type: Object, required: true }
});

const postStore = usePostStore();
const authStore = useAuthStore();
const showComments = ref(false);
const newComment = ref('');

const submitComment = async () => {
  if (!newComment.value.trim()) return;
  await postStore.addComment(props.post.id, newComment.value.trim());
  newComment.value = '';
};
</script>