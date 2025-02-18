<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white flex flex-col items-center justify-center relative">
    <div class="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-gray-300 mb-2">Email</label>
          <input type="email" id="email" v-model="email" class="bg-gray-700 text-white w-full px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300">
        </div>

        <div class="mb-6">
          <label for="password" class="block text-gray-300 mb-2">Password</label>
          <input type="password" id="password" v-model="password" class="bg-gray-700 text-white w-full px-3 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300">
        </div>

        <button type="submit" class="bg-blue-700 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg w-full">
          Login
        </button>

        <div v-if="error" class="text-red-500 mt-2 text-center">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';
const emit = defineEmits(['close']);

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);

const { login } = useAuth();


async function handleLogin() {
  try {
    let user = await login(email.value, password.value);
    console.log(user)
    // Navigate or perform other actions after successful login
    navigateTo('/'); // Example using Nuxt 3 navigation
  } catch (e: any) {
    error.value = e.message;
  }
}
</script>