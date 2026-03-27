import { defineStore } from 'pinia';
import { ref } from 'vue';
// 1. Added putData to the import list here:
import { addData, getAllData, getAllByIndex, putData } from '../database/index';

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(JSON.parse(localStorage.getItem('mini_social_user')) || null);
  const allUsers = ref([]);

  const loadUsers = async () => {
    allUsers.value = await getAllData('users');
  };

  const register = async (username) => {
    const existing = await getAllByIndex('users', 'username', username);
    if (existing.length > 0) {
      throw new Error('Username already exists');
    }
    
    const newUser = {
      id: crypto.randomUUID(),
      username,
      bio: '',
      createdAt: new Date().toISOString()
    };
    
    await addData('users', newUser);
    await loadUsers();
    return newUser;
  };

  const login = (user) => {
    currentUser.value = user;
    localStorage.setItem('mini_social_user', JSON.stringify(user));
  };

  const logout = () => {
    currentUser.value = null;
    localStorage.removeItem('mini_social_user');
  };

  const updateProfile = async (newUsername, newBio) => {
    if (newUsername !== currentUser.value.username) {
      const existing = await getAllByIndex('users', 'username', newUsername);
      if (existing.length > 0) throw new Error('Username already taken');
    }

    const updatedUser = { ...currentUser.value, username: newUsername, bio: newBio };
    
    // 2. Swapped addData out for putData here:
    await putData('users', updatedUser);
    
    currentUser.value = updatedUser;
    localStorage.setItem('mini_social_user', JSON.stringify(updatedUser));
    await loadUsers();
  };

  return { currentUser, allUsers, loadUsers, register, login, logout, updateProfile };
});