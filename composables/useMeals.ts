import { 
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where
} from 'firebase/firestore'
import { ref } from 'vue'

export interface Alimento {
  kcal: number,
  proteina: string,
  proteina_g: number,
  quantidade: string
}

export interface Meal {
  id?: string
  nome: string
  tipo: 'almoço' | 'jantar'
  modo_preparo: string
  ingredientes: string[]
  alimentos?: Alimento
  tempo_preparo: number
  createdBy?: string
  imagem: string
}

// Mock data with more examples
const mockMeals: Meal[] = [
  // almoço Meals
  {
    id: '1',
    nome: 'Quinoa Buddha Bowl',
    tipo: 'almoço',
    modo_preparo: 'Cook quinoa according to package instructions. Roast mixed vegetables with olive oil at 400°F for 20 minutes. Combine quinoa, roasted vegetables, and chickpeas in a bowl. Drizzle with tahini dressing and garnish with fresh herbs.',
    ingredientes: ['Quinoa', 'Mixed vegetables', 'Chickpeas', 'Tahini', 'Lemon juice', 'Olive oil', 'Fresh herbs'],
    tempo_preparo: 30,
    createdBy: 'admin@example.com',
    imagem: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80'
  },
  {
    id: '2',
    nome: 'Asian Chicken Salad',
    tipo: 'almoço',
    modo_preparo: 'Slice chicken breast and grill. Combine with shredded cabbage, carrots, and mandarin oranges. Toss with sesame ginger dressing.',
    ingredientes: ['Chicken breast', 'Napa cabbage', 'Carrots', 'Mandarin oranges', 'Sesame seeds', 'Ginger dressing'],
    tempo_preparo: 25,
    createdBy: 'admin@example.com',
    imagem: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'
  },
  {
    id: '3',
    nome: 'Mediterranean Wrap',
    tipo: 'almoço',
    modo_preparo: 'Spread hummus on wrap. Layer with falafel, cucumber, tomatoes, and lettuce. Drizzle with tahini sauce.',
    ingredientes: ['Whole wheat wrap', 'Hummus', 'Falafel', 'Cucumber', 'Tomatoes', 'Lettuce', 'Tahini sauce'],
    tempo_preparo: 15,
    createdBy: 'admin@example.com',
    imagem: 'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=800&q=80'
  },
  {
    id: '4',
    nome: 'Poke Bowl',
    tipo: 'almoço',
    modo_preparo: 'Cube sushi-grade tuna and marinate in soy sauce. Serve over rice with avocado, cucumber, and seaweed.',
    ingredientes: ['Tuna', 'Sushi rice', 'Avocado', 'Cucumber', 'Seaweed', 'Soy sauce', 'Sesame oil'],
    tempo_preparo: 20,
    createdBy: 'admin@example.com',
    imagem: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80'
  },
  {
    id: '5',
    nome: 'Caprese Sandwich',
    tipo: 'almoço',
    modo_preparo: 'Layer fresh mozzarella, tomatoes, and basil on ciabatta bread. Drizzle with balsamic glaze.',
    ingredientes: ['Ciabatta bread', 'Fresh mozzarella', 'Tomatoes', 'Basil', 'Balsamic glaze', 'Olive oil'],
    tempo_preparo: 10,
    createdBy: 'admin@example.com',
    imagem: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80'
  },
  
  // jantar Meals
  {
    id: '6',
    nome: 'Grilled Salmon with Asparagus',
    tipo: 'jantar',
    modo_preparo: 'Season salmon with herbs and lemon. Grill for 4-5 minutes each side. Steam asparagus until tender-crisp.',
    ingredientes: ['Salmon fillet', 'Asparagus', 'Lemon', 'Herbs', 'Olive oil', 'Salt', 'Pepper'],
    tempo_preparo: 25,
    createdBy: 'admin@example.com',
    imagem: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80'
  },
  {
    id: '7',
    nome: 'Mediterranean Pasta',
    tipo: 'jantar',
    modo_preparo: 'Cook pasta al dente. Sauté garlic and cherry tomatoes. Add olives and capers. Toss with fresh herbs and feta.',
    ingredientes: ['Pasta', 'Cherry tomatoes', 'Olives', 'Capers', 'Garlic', 'Feta cheese', 'Fresh herbs'],
    tempo_preparo: 20,
    createdBy: 'admin@example.com',
    imagem: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80'
  },
  {
    id: '8',
    nome: 'Beef Stir-Fry',
    tipo: 'jantar',
    modo_preparo: 'Slice beef thinly. Stir-fry with mixed vegetables in wok. Add sauce and serve over rice.',
    ingredientes: ['Beef strips', 'Mixed vegetables', 'Soy sauce', 'Ginger', 'Garlic', 'Rice', 'Sesame oil'],
    tempo_preparo: 30,
    createdBy: 'admin@example.com',
    imagem: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80'
  },
  {
    id: '9',
    nome: 'Vegetable Curry',
    tipo: 'jantar',
    modo_preparo: 'Sauté onions and spices. Add vegetables and coconut milk. Simmer until tender. Serve with rice.',
    ingredientes: ['Mixed vegetables', 'Coconut milk', 'Curry powder', 'Onion', 'Garlic', 'Ginger', 'Rice'],
    tempo_preparo: 35,
    createdBy: 'admin@example.com',
    imagem: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&q=80'
  },
  {
    id: '10',
    nome: 'Chicken Fajitas',
    tipo: 'jantar',
    modo_preparo: 'Slice chicken and peppers. Cook with spices. Serve with tortillas and toppings.',
    ingredientes: ['Chicken breast', 'Bell peppers', 'Onions', 'Tortillas', 'Spices', 'Lime', 'Avocado'],
    tempo_preparo: 25,
    createdBy: 'admin@example.com',
    imagem: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=3552'
  }
]

export const useMeals = () => {
  const { $firestore } = useNuxtApp()
  const meals = ref<Meal[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()
  const useMockData = config.public.useMockData === 'true'

  const fetchMeals = async () => {
    loading.value = true
    try {
      if (useMockData) {
        meals.value = mockMeals
      } else {
        const q = query(collection($firestore, 'meals'))
        const querySnapshot = await getDocs(q)

        meals.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Meal[]
      }
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const addMeal = async (meal: Omit<Meal, 'id'>) => {
    try {
      if (useMockData) {
        const newMeal = { ...meal, id: Date.now().toString() }
        mockMeals.push(newMeal)
        return newMeal.id
      }
      const docRef = await addDoc(collection($firestore, 'meals'), meal)
      return docRef.id
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  const updateMeal = async (id: string, meal: Partial<Meal>) => {
    try {
      if (useMockData) {
        const index = mockMeals.findIndex(m => m.id === id)
        if (index !== -1) {
          mockMeals[index] = { ...mockMeals[index], ...meal }
        }
        return
      }
      const mealRef = doc($firestore, 'meals', id)
      await updateDoc(mealRef, meal)
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  const deleteMeal = async (id: string) => {
    try {
      if (useMockData) {
        const index = mockMeals.findIndex(m => m.id === id)
        if (index !== -1) {
          mockMeals.splice(index, 1)
        }
        return
      }
      const mealRef = doc($firestore, 'meals', id)
      await deleteDoc(mealRef)
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  return {
    meals,
    loading,
    error,
    fetchMeals,
    addMeal,
    updateMeal,
    deleteMeal
  }
}