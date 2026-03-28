<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-5">
    
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-lg uppercase">
          {{ post.author_username.charAt(0) }}
        </div>
        <div>
          <h3 class="font-bold text-slate-900 dark:text-white">@{{ post.author_username }}</h3>
          <p class="text-xs text-slate-500">{{ new Date(post.timestamp).toLocaleString() }}</p>
        </div>
      </div>
      <button v-if="post.author_id === authStore.currentUser?.id" @click="handleDeletePost" class="text-rose-500 hover:text-rose-700 transition p-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
      </button>
    </div>

    <p v-if="post.text" class="text-slate-800 dark:text-slate-200 mb-4 whitespace-pre-wrap">{{ post.text }}</p>
    
    <div v-if="post.mediaUrl" class="mb-4 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
      <img v-if="post.mediaType === 'image'" :src="post.mediaUrl" class="w-full max-h-[500px] object-contain" />
      <video v-if="post.mediaType === 'video'" :src="post.mediaUrl" controls class="w-full max-h-[500px]"></video>
    </div>

    <div class="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-medium">
      <button @click="postStore.toggleLike(post.id)" class="flex items-center gap-2 hover:text-rose-500 transition" :class="{'text-rose-500': post.hasLiked}">
        <svg xmlns="http://www.w3.org/2000/svg" :fill="post.hasLiked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
        {{ post.likesCount }}
      </button>
      <button @click="showComments = !showComments" class="flex items-center gap-2 hover:text-indigo-500 transition">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" /></svg>
        {{ post.comments.length }}
      </button>
    </div>

    <div v-if="showComments" class="mt-6 space-y-4">
      
      <div v-for="comment in topLevelComments" :key="comment.id" class="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg">
        <div class="flex justify-between items-start">
          <div>
            <span class="font-bold text-sm text-slate-900 dark:text-white">@{{ comment.author_username }}</span>
            <p class="text-sm text-slate-700 dark:text-slate-300 mt-1">{{ comment.text }}</p>
          </div>
          <button v-if="comment.author_id === authStore.currentUser?.id" @click="handleDeleteComment(comment.id)" class="text-rose-400 hover:text-rose-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
          </button>
        </div>
        
        <button @click="replyingTo = comment.id" class="text-xs text-indigo-500 font-medium mt-2 hover:underline">Reply</button>

        <div v-if="getReplies(comment.id).length > 0" class="mt-3 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-3">
          <div v-for="reply in getReplies(comment.id)" :key="reply.id">
            <div class="flex justify-between items-start">
              <div>
                <span class="font-bold text-xs text-slate-900 dark:text-white">@{{ reply.author_username }}</span>
                <p class="text-sm text-slate-600 dark:text-slate-400">{{ reply.text }}</p>
              </div>
              <button v-if="reply.author_id === authStore.currentUser?.id" @click="handleDeleteComment(reply.id)" class="text-rose-400 hover:text-rose-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        </div>

        <form v-if="replyingTo === comment.id" @submit.prevent="submitReply(comment.id)" class="mt-3 flex gap-2">
          <input v-model="newReplyText" type="text" placeholder="Write a reply..." class="flex-grow bg-white dark:bg-slate-800 text-sm border border-slate-300 dark:border-slate-600 rounded-full px-3 py-1 outline-none focus:border-indigo-500">
          <button type="submit" class="text-indigo-600 dark:text-indigo-400 font-bold text-sm px-2">Send</button>
        </form>
      </div>

      <form @submit.prevent="submitComment" class="flex gap-2 mt-4">
        <input 
          v-model="newCommentText" 
          type="text" 
          placeholder="Write a comment..." 
          class="flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
        >
        <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold shadow-sm hover:bg-indigo-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" /></svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePostStore } from '../stores/postStore';
import { useAuthStore } from '../stores/authStore';
import Swal from 'sweetalert2'; // <--- SWEETALERT IS HERE!

const props = defineProps({
  post: { type: Object, required: true }
});

const postStore = usePostStore();
const authStore = useAuthStore();

const showComments = ref(false);
const newCommentText = ref('');
const newReplyText = ref('');
const replyingTo = ref(null); // Tracks which comment we are currently replying to

// Separate parent comments from replies
const topLevelComments = computed(() => {
  return props.post.comments.filter(c => !c.parent_id);
});

// Function to get replies for a specific comment
const getReplies = (commentId) => {
  return props.post.comments.filter(c => c.parent_id === commentId);
};

// SWEET ALERT DELETE POST
const handleDeletePost = async () => {
  const result = await Swal.fire({
    title: 'Delete Post?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5', // Tailwind Indigo 600
    cancelButtonColor: '#f43f5e',  // Tailwind Rose 500
    confirmButtonText: 'Yes, delete it!'
  });

  if (result.isConfirmed) {
    await postStore.deletePost(props.post.id);
    Swal.fire({ title: 'Deleted!', text: 'Your post has been deleted.', icon: 'success', timer: 1500, showConfirmButton: false });
  }
};

// SWEET ALERT DELETE COMMENT
const handleDeleteComment = async (commentId) => {
  const result = await Swal.fire({
    title: 'Delete Comment?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#f43f5e',
    confirmButtonText: 'Delete'
  });

  if (result.isConfirmed) {
    await postStore.deleteComment(commentId);
  }
};

const submitComment = async () => {
  if (!newCommentText.value.trim()) return;
  await postStore.addComment(props.post.id, newCommentText.value.trim());
  newCommentText.value = '';
};

const submitReply = async (parentId) => {
  if (!newReplyText.value.trim()) return;
  await postStore.addComment(props.post.id, newReplyText.value.trim(), parentId);
  newReplyText.value = '';
  replyingTo.value = null; // Close the reply box
};
</script>