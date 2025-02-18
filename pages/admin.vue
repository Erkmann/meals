<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Manage Meals</h1>

    <!-- Add New Meal Button -->
    <button
      @click="showAddModal = true"
      class="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Add New Meal
    </button>

    <!-- Meals List -->
    <div class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prep Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="meal in meals" :key="meal.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ meal.nome }}</td>
              <td class="px-6 py-4 whitespace-nowrap capitalize">{{ meal.tipo }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ meal.tempo_preparo }} mins</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="editMeal(meal)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(meal)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Meal Modal -->
    <div v-if="showAddModal || editingMeal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full p-6">
        <h2 class="text-2xl font-bold mb-4">{{ editingMeal ? 'Edit' : 'Add' }} Meal</h2>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="mealForm.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <select
              v-model="mealForm.type"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Preparation Time (minutes)</label>
            <input
              v-model.number="mealForm.preparationTime"
              type="number"
              required
              min="1"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Ingredients (one per line)</label>
            <textarea
              v-model="ingredientsText"
              required
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Recipe</label>
            <textarea
              v-model="mealForm.recipe"
              required
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {{ editingMeal ? 'Update' : 'Add' }} Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { meals, addMeal, updateMeal, deleteMeal, fetchMeals } = useMeals()
const { user } = useAuth()
const router = useRouter()

// Redirect if not admin
onMounted(() => {
  if (!user.value || user.value.email !== 'admin@example.com') {
    router.push('/')
  }
  fetchMeals()
})

const showAddModal = ref(false)
const editingMeal = ref<Meal | null>(null)
const ingredientsText = ref('')

const mealForm = ref<Omit<Meal, 'id' | 'createdBy'>>({
  name: '',
  type: 'lunch',
  recipe: '',
  ingredients: [],
  preparationTime: 30
})

const resetForm = () => {
  mealForm.value = {
    name: '',
    type: 'lunch',
    recipe: '',
    ingredients: [],
    preparationTime: 30
  }
  ingredientsText.value = ''
  editingMeal.value = null
}

const closeModal = () => {
  showAddModal.value = false
  resetForm()
}

const editMeal = (meal: Meal) => {
  editingMeal.value = meal
  mealForm.value = { ...meal }
  ingredientsText.value = meal.ingredientes.join('\n')
}

const handleSubmit = async () => {
  const mealData = {
    ...mealForm.value,
    ingredients: ingredientsText.value.split('\n').filter(i => i.trim()),
    createdBy: user.value?.email as string
  }

  try {
    if (editingMeal.value) {
      await updateMeal(editingMeal.value.id!, mealData)
    } else {
      await addMeal(mealData)
    }
    await fetchMeals()
    closeModal()
  } catch (error) {
    console.error('Error saving meal:', error)
  }
}

const confirmDelete = async (meal: Meal) => {
  if (confirm(`Are you sure you want to delete ${meal.nome}?`)) {
    try {
      await deleteMeal(meal.id!)
      await fetchMeals()
    } catch (error) {
      console.error('Error deleting meal:', error)
    }
  }
}
</script>