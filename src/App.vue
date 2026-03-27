<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200">
    <nav v-if="authStore.currentUser" class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 transition-colors">
      <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <h1 class="font-bold text-lg tracking-tight text-indigo-600 dark:text-indigo-400">MiniSocial</h1>
        
        <div class="flex-1 max-w-xs relative hidden sm:block">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search users..." 
            class="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-lg pl-3 pr-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
          >
          <div v-if="searchQuery && searchResults.length > 0" class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg overflow-hidden z-30">
            <router-link 
              v-for="user in searchResults" 
              :key="user.id" 
              :to="`/profile/${user.id}`"
              @click="searchQuery = ''"
              class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              @{{ user.username }}
            </router-link>
          </div>
        </div>

        <div class="flex items-center gap-4 sm:gap-6 text-sm font-medium">
          <router-link to="/feed" class="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" active-class="text-indigo-600 dark:text-indigo-400">Feed</router-link>
          <router-link to="/users" class="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" active-class="text-indigo-600 dark:text-indigo-400">Users</router-link>
          <router-link :to="`/profile/${authStore.currentUser.id}`" class="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" active-class="text-indigo-600 dark:text-indigo-400">Profile</router-link>
          
          <button @click="toggleDarkMode" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
            <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
          </button>

          <button @click="handleLogout" class="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer">Logout</button>
        </div>
      </div>
    </nav>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';
import { useRouter } from 'vue-router';
import { getAllData } from './database/index';

const authStore = useAuthStore();
const router = useRouter();

const isDark = ref(localStorage.getItem('theme') === 'dark');
const searchQuery = ref('');
const allUsers = ref([]);

onMounted(async () => {
  if (isDark.value) document.documentElement.classList.add('dark');
  allUsers.value = await getAllData('users');
});

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return [];
  const query = searchQuery.value.toLowerCase();
  return allUsers.value.filter(u => 
    u.id !== authStore.currentUser?.id && 
    u.username.toLowerCase().includes(query)
  ).slice(0, 5);
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>