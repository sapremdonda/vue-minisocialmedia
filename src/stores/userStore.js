import { defineStore } from 'pinia';
import { ref } from 'vue';
import { addData, getAllData, deleteData } from '../database/index';
import { useAuthStore } from './authStore';

export const useUserStore = defineStore('user', () => {
  const users = ref([]);
  const follows = ref([]);

  const loadUsersAndFollows = async () => {
    users.value = await getAllData('users');
    follows.value = await getAllData('follows');
  };

  const toggleFollow = async (targetUserId) => {
    const authStore = useAuthStore();
    const currentUserId = authStore.currentUser.id;

    const existingFollow = follows.value.find(
      f => f.follower_id === currentUserId && f.following_id === targetUserId
    );

    if (existingFollow) {
      await deleteData('follows', existingFollow.id);
    } else {
      await addData('follows', {
        id: crypto.randomUUID(),
        follower_id: currentUserId,
        following_id: targetUserId
      });
    }
    await loadUsersAndFollows();
  };

  const getProfileStats = (userId) => {
    const followers = follows.value.filter(f => f.following_id === userId).length;
    const following = follows.value.filter(f => f.follower_id === userId).length;
    return { followers, following };
  };

  const isFollowing = (userId) => {
    const authStore = useAuthStore();
    if (!authStore.currentUser) return false;
    return follows.value.some(
      f => f.follower_id === authStore.currentUser.id && f.following_id === userId
    );
  };

  return { users, follows, loadUsersAndFollows, toggleFollow, getProfileStats, isFollowing };
});