import { defineStore } from 'pinia';
import { ref } from 'vue';
import { addData, getAllData, deleteData, putData } from '../database/index';
import { useAuthStore } from './authStore';

export const usePostStore = defineStore('post', () => {
  const feedPosts = ref([]);
  const allLikes = ref([]);
  const allComments = ref([]);

  const loadFeed = async () => {
    const authStore = useAuthStore();
    if (!authStore.currentUser) return;

    const allPostsData = await getAllData('posts');
    const allFollowsData = await getAllData('follows');
    allLikes.value = await getAllData('likes');
    allComments.value = await getAllData('comments');

    const myFollows = allFollowsData
      .filter(f => f.follower_id === authStore.currentUser.id)
      .map(f => f.following_id);

    const allowedIds = [authStore.currentUser.id, ...myFollows];
    const filtered = allPostsData.filter(p => allowedIds.includes(p.author_id));

    feedPosts.value = filtered.map(post => {
      const postLikes = allLikes.value.filter(l => l.post_id === post.id);
      const hasLiked = postLikes.some(l => l.user_id === authStore.currentUser.id);
      
      const postComments = allComments.value
        .filter(c => c.post_id === post.id)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      return {
        ...post,
        likesCount: postLikes.length,
        hasLiked,
        comments: postComments
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const createPost = async (text, mediaUrl = null, mediaType = null) => {
    const authStore = useAuthStore();
    const post = {
      id: crypto.randomUUID(),
      author_id: authStore.currentUser.id,
      author_username: authStore.currentUser.username,
      text,
      mediaUrl,
      mediaType,
      timestamp: new Date().toISOString()
    };
    await addData('posts', post);
    await loadFeed();
  };

  const deletePost = async (id) => {
    await deleteData('posts', id);
    await loadFeed();
  };

  const toggleLike = async (postId) => {
    const authStore = useAuthStore();
    const userId = authStore.currentUser.id;
    
    const existingLike = allLikes.value.find(l => l.post_id === postId && l.user_id === userId);
    
    if (existingLike) {
      await deleteData('likes', existingLike.id);
    } else {
      await addData('likes', {
        id: crypto.randomUUID(),
        post_id: postId,
        user_id: userId
      });
    }
    await loadFeed();
  };

  const addComment = async (postId, text, parentId = null) => {
    const authStore = useAuthStore();
    const comment = {
      id: crypto.randomUUID(),
      post_id: postId,
      parent_id: parentId, // Links this comment to another comment if it's a reply
      author_id: authStore.currentUser.id,
      author_username: authStore.currentUser.username,
      text,
      timestamp: new Date().toISOString()
    };
    await addData('comments', comment);
    await loadFeed();
  };

  const deleteComment = async (commentId) => {
    await deleteData('comments', commentId);
    await loadFeed();
  };

  return { feedPosts, loadFeed, createPost, deletePost, toggleLike, addComment, deleteComment };
});