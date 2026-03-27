<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <div class="mb-8 text-center sm:text-left">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Discover Users</h2>
      <p class="text-slate-500 dark:text-slate-400 mt-1">Find and follow people to see their posts in your feed.</p>
    </div>

    <div v-if="otherUsers.length === 0" class="text-center py-16 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
      <p class="text-lg font-medium">No other users found.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="user in otherUsers" :key="user.id" class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center transition-colors">
        
        <div class="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
          {{ user.username.charAt(0).toUpperCase() }}
        </div>
        
        <router-link :to="`/profile/${user.id}`" class="font-bold text-lg text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-1">
          @{{ user.username }}
        </router-link>
        
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-2 h-10">
          {{ user.bio || 'No bio available.' }}
        </p>
        
        <button 
          @click="userStore.toggleFollow(user.id)" 
          class="w-full py-2.5 rounded-xl font-medium text-sm transition-colors" 
          :class="userStore.isFollowing(user.id) ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'"
        >
          {{ userStore.isFollowing(user.id) ? 'Unfollow' : 'Follow' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';

const userStore = useUserStore();
const authStore = useAuthStore();

onMounted(async () => {
  await userStore.loadUsersAndFollows();
});

const otherUsers = computed(() => {
  return userStore.users.filter(u => u.id !== authStore.currentUser?.id);
});
</script>