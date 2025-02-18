<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-900 to-black text-white">
    <!-- Type Toggle -->
    <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div class="bg-gray-800 rounded-full shadow-lg p-1 flex space-x-1">
        <button
            @click="selectedType = 'almoço'"
            :class="[
            'px-6 py-2 rounded-full font-medium transition-colors',
            selectedType === 'almoço'
              ? 'bg-blue-700 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          ]"
        >
          Almoço
        </button>
        <button
            @click="selectedType = 'jantar'"
            :class="[
            'px-6 py-2 rounded-full font-medium transition-colors',
            selectedType === 'jantar'
              ? 'bg-blue-700 text-white'
              : 'text-gray-300 hover:bg-gray-700'
          ]"
        >
          Jantar
        </button>
      </div>
    </div>

    <!-- Meals Grid -->
    <div class="min-h-screen p-4">
      <div v-if="loading" class="h-screen flex items-center justify-center">
        <p class="text-xl text-gray-300">Carregando refeições...</p>
      </div>
      <div v-else-if="filteredMeals.length === 0" class="h-screen flex items-center justify-center">
        <p class="text-xl text-gray-300">Nenhuma refeição do tipo <span class="font-bold text-blue-300">{{ selectedType }}</span> foi encontrada</p>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-20">
        <div
            v-for="meal in filteredMeals"
            :key="meal.id"
            class="relative group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
            @click="selectedMeal = meal"
        >
          <div class="aspect-w-16 aspect-h-12 sm:aspect-h-9">
            <img
                :src="meal.imagem"
                :alt="meal.nome"
                class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/50 transition-colors duration-300"> </div> <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="text-xl font-bold mb-2">{{ meal.nome }}</h3>
            <p class="text-sm">
              Tempo de preparo: {{ meal.tempo_preparo }} minutos
            </p>
          </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Modal -->
    <div
        v-if="selectedMeal"
        class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
        @click.self="selectedMeal = null"
    >
      <div class="bg-gray-800 rounded-lg  w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="aspect-w-16 aspect-h-9">
          <img
              :src="selectedMeal.imagem"
              :alt="selectedMeal.nome"
              class="w-full h-full object-cover"
          />
        </div>
        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <h3 class="text-3xl font-bold">{{ selectedMeal.nome }}</h3>
            <button
                @click="selectedMeal = null"
                class="text-gray-400 hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          <div class="space-y-6">
            <div>
              <h4 class="text-xl font-semibold mb-3">Ingredientes:</h4>
              <ul class="grid grid-cols-2 gap-2">
                <li
                    v-for="ingredient in selectedMeal.ingredientes"
                    :key="ingredient"
                    class="flex items-center space-x-2"
                >
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>{{ ingredient }}</span>
                </li>
              </ul>
            </div>
            {{ selectedMeal.alimentos }}
            <div v-if="selectedMeal.alimentos">
              <h4 class="text-xl font-semibold mb-3">Informações:</h4>
              <ul class="grid grid-cols-1 gap-2">
                <li class="flex items-center space-x-2">
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Kcal: {{ selectedMeal.alimentos.kcal }}</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Fonte de Proteína: {{ selectedMeal.alimentos.quantidade }} de {{ selectedMeal.alimentos.proteina }}</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Total de Proteína: {{ selectedMeal.alimentos.proteina_g }}g</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 class="text-xl font-semibold mb-3">Modo de Preparo:</h4>
              <p class="whitespace-pre-line text-gray-300 leading-relaxed">
                {{ selectedMeal.modo_preparo }}
              </p>
            </div>
            <div class="pt-4 border-t border-gray-700">
              <p class="text-gray-400">
                Tempo de preparo: {{ selectedMeal.tempo_preparo }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { meals, loading, error, fetchMeals } = useMeals()
const selectedMeal = ref<Meal | null>(null)
const selectedType = ref<'almoço' | 'jantar'>('almoço')

const filteredMeals = computed(() => 
  meals.value.filter(meal => meal.tipo === selectedType.value)
)

onMounted(() => {
  fetchMeals()
})
</script>