<template>
  <div v-if="isAuthReady" class="min-h-screen bg-gray-100">
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const isAdmin = computed(() => user.value?.email === 'admin@example.com')
const isAuthReady = ref(false)

// Initialize authentication
onMounted(() => {
  useAuth().initAuth()
  isAuthReady.value = true
})
</script>