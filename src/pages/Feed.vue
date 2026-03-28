<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Home Feed</h1>

    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 mb-8 overflow-hidden">
      <form @submit.prevent="submitPost" class="p-4">
        <textarea 
          v-model="newPostText" 
          placeholder="What's on your mind?" 
          class="w-full bg-transparent resize-none outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 min-h-[80px]"
        ></textarea>
        
        <div v-if="mediaPreview" class="relative my-3 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 flex justify-center">
          <img v-if="mediaType === 'image'" :src="mediaPreview" class="max-h-80 object-contain" />
          <video v-if="mediaType === 'video'" :src="mediaPreview" controls class="max-h-80"></video>
          <button @click="clearMedia" type="button" class="absolute top-2 right-2 bg-slate-900/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-slate-900 transition">
            ✕
          </button>
        </div>

        <div class="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          <label class="cursor-pointer text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 font-medium text-sm flex items-center gap-2 px-2 py-1 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
            <span>Photo / Video</span>
            <input type="file" accept="image/*,video/*" class="hidden" @change="handleFileUpload" />
          </label>
          
          <button 
            type="submit" 
            :disabled="!newPostText.trim() && !mediaPreview"
            class="bg-indigo-600 disabled:bg-indigo-400 text-white px-5 py-2 rounded-full font-bold shadow-sm hover:bg-indigo-700 transition"
          >
            Post
          </button>
        </div>
      </form>
    </div>

    <div class="space-y-6">
      <PostCard v-for="post in postStore.feedPosts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePostStore } from '../stores/postStore';
import PostCard from '../components/PostCard.vue';

const postStore = usePostStore();
const newPostText = ref('');
const mediaPreview = ref(null);
const mediaType = ref('');

onMounted(async () => {
  await postStore.loadFeed();
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  mediaType.value = file.type.startsWith('video') ? 'video' : 'image';

  const reader = new FileReader();
  reader.onload = (e) => {
    mediaPreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const clearMedia = () => {
  mediaPreview.value = null;
  mediaType.value = '';
};

const submitPost = async () => {
  if (!newPostText.value.trim() && !mediaPreview.value) return;
  await postStore.createPost(newPostText.value.trim(), mediaPreview.value, mediaType.value);
  newPostText.value = '';
  clearMedia();
};
</script>