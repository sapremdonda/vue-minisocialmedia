<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md border border-slate-200">
      <h2 class="text-center text-3xl font-extrabold text-slate-900">Welcome</h2>
      
      <div v-if="authStore.allUsers.length > 0">
        <h3 class="text-sm font-medium text-slate-700 mb-3">Select existing profile:</h3>
        <div class="space-y-2 max-h-48 overflow-y-auto pr-2">
          <button 
            v-for="user in authStore.allUsers" 
            :key="user.id"
            @click="handleLogin(user)"
            class="w-full text-left px-4 py-3 border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-500 transition-colors font-medium text-slate-700"
          >
            @{{ user.username }}
          </button>
        </div>
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-slate-500">Or create new</span>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="username" class="sr-only">Username</label>
          <input 
            id="username" 
            v-model="newUsername" 
            type="text" 
            required 
            class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
            placeholder="Enter new username"
          >
        </div>
        <p v-if="error" class="text-rose-500 text-sm">{{ error }}</p>
        <button 
          type="submit" 
          class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Create Profile
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const newUsername = ref('');
const error = ref('');

onMounted(async () => {
  await authStore.loadUsers();
});

const handleLogin = (user) => {
  authStore.login(user);
  router.push('/feed');
};

const handleRegister = async () => {
  try {
    error.value = '';
    if (!newUsername.value.trim()) return;
    
    const newUser = await authStore.register(newUsername.value.trim());
    handleLogin(newUser);
  } catch (err) {
    error.value = err.message;
  }
};
</script>