<template>
  <div class="max-w-2xl mx-auto py-8 px-4" v-if="profileUser">
    <div class="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 text-center transition-colors">
      <div class="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
        {{ profileUser.username.charAt(0).toUpperCase() }}
      </div>
      
      <div v-if="!isEditing">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">@{{ profileUser.username }}</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">{{ profileUser.bio || 'No bio provided yet.' }}</p>
        
        <div class="flex justify-center gap-6 mb-6">
          <div class="text-center">
            <div class="text-xl font-bold text-slate-900 dark:text-white">{{ stats.followers }}</div>
            <div class="text-sm text-slate-500 dark:text-slate-400">Followers</div>
          </div>
          <div class="text-center">
            <div class="text-xl font-bold text-slate-900 dark:text-white">{{ stats.following }}</div>
            <div class="text-sm text-slate-500 dark:text-slate-400">Following</div>
          </div>
        </div>

        <button
          v-if="authStore.currentUser?.id !== profileUser.id"
          @click="userStore.toggleFollow(profileUser.id)"
          class="px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          :class="userStore.isFollowing(profileUser.id) ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'"
        >
          {{ userStore.isFollowing(profileUser.id) ? 'Unfollow' : 'Follow' }}
        </button>
        <button
          v-else
          @click="startEditing"
          class="px-6 py-2 rounded-lg font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
        >
          Edit Profile
        </button>
      </div>

      <form v-else @submit.prevent="saveProfile" class="max-w-sm mx-auto text-left space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
          <input v-model="editForm.username" type="text" required class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
          <textarea v-model="editForm.bio" rows="3" class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 resize-none"></textarea>
        </div>
        <p v-if="editError" class="text-rose-500 text-sm">{{ editError }}</p>
        <div class="flex gap-2 justify-end">
          <button type="button" @click="isEditing = false" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 cursor-pointer">Save Changes</button>
        </div>
      </form>
    </div>

    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Posts</h3>
    <div class="space-y-4">
      <div v-if="userPosts.length === 0" class="text-center py-10 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        No posts to show.
      </div>

      <div v-for="post in userPosts" :key="post.id" class="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
        <div class="flex justify-between items-start mb-3">
          <div class="font-bold text-slate-900 dark:text-white">@{{ post.author_username }}</div>
          <div class="text-xs text-slate-400 dark:text-slate-500">{{ new Date(post.timestamp).toLocaleString() }}</div>
        </div>

        <p class="text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">{{ post.text }}</p>

        <div class="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button @click="toggleLike(post.id)" class="flex items-center gap-1.5 text-sm transition-colors cursor-pointer" :class="post.hasLiked ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'">
            <svg xmlns="http://www.w3.org/2000/svg" :fill="post.hasLiked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
            <span class="font-medium">{{ post.likesCount }}</span>
          </button>

          <button v-if="post.author_id === authStore.currentUser?.id" @click="deletePost(post.id)" class="text-sm text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-500 transition-colors cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-20 text-slate-500 dark:text-slate-400">
    Loading profile...
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { useAuthStore } from '../stores/authStore';
import { usePostStore } from '@/stores/postStore';
import { getAllData } from '../database/index';

const route = useRoute();
const userStore = useUserStore();
const authStore = useAuthStore();
const postStore = usePostStore();

const profileUser = ref(null);
const userPosts = ref([]);
const isEditing = ref(false);
const editForm = ref({ username: '', bio: '' });
const editError = ref('');

const loadProfileData = async () => {
  await userStore.loadUsersAndFollows();
  profileUser.value = userStore.users.find(u => u.id === route.params.id);

  const allPosts = await getAllData('posts');
  const allLikes = await getAllData('likes');

  const filtered = allPosts.filter(p => p.author_id === route.params.id);

  userPosts.value = filtered.map(post => {
    const postLikes = allLikes.filter(l => l.post_id === post.id);
    const hasLiked = postLikes.some(l => l.user_id === authStore.currentUser?.id);

    return { ...post, likesCount: postLikes.length, hasLiked };
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

onMounted(loadProfileData);
watch(() => route.params.id, loadProfileData);

const stats = computed(() => {
  if (!profileUser.value) return { followers: 0, following: 0 };
  return userStore.getProfileStats(profileUser.value.id);
});

const toggleLike = async (postId) => {
  await postStore.toggleLike(postId);
  await loadProfileData();
};

const deletePost = async (postId) => {
  await postStore.deletePost(postId);
  await loadProfileData();
};

const startEditing = () => {
  editForm.value = { username: profileUser.value.username, bio: profileUser.value.bio || '' };
  editError.value = '';
  isEditing.value = true;
};

const saveProfile = async () => {
  try {
    editError.value = '';
    await authStore.updateProfile(editForm.value.username, editForm.value.bio);
    isEditing.value = false;
    await loadProfileData();
  } catch (err) {
    editError.value = err.message;
  }
};
</script>