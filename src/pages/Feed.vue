<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <div class="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 transition-colors">
      <form @submit.prevent="handlePost">
        <textarea 
          v-model="newPostText" 
          rows="3" 
          class="w-full resize-none border-none bg-transparent focus:ring-0 p-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none text-lg" 
          placeholder="What's on your mind?"
          required
        ></textarea>
        <div class="flex justify-end mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button 
            type="submit" 
            :disabled="!newPostText.trim()"
            class="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            Post
          </button>
        </div>
      </form>
    </div>

    <div class="space-y-6">
      <div v-if="postStore.feedPosts.length === 0" class="text-center py-16 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" /></svg>
        <p class="text-lg font-medium">Your feed is empty.</p>
        <p class="text-sm mt-1">Follow some users or write a post to get started!</p>
      </div>
      
      <PostCard 
        v-for="post in postStore.feedPosts" 
        :key="post.id" 
        :post="post" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePostStore } from '@/stores/postStore';
import PostCard from '../components/PostCard.vue';

const postStore = usePostStore();
const newPostText = ref('');

onMounted(async () => {
  await postStore.loadFeed();
});

const handlePost = async () => {
  if (!newPostText.value.trim()) return;
  await postStore.createPost(newPostText.value.trim());
  newPostText.value = '';
};
</script>