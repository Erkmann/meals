import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { ref } from 'vue'

export const useAuth = () => {
  const { $auth } = useNuxtApp()
  const user = ref<User | null>(null)
  const error = ref<string | null>(null)

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword($auth, email, password)
      user.value = userCredential.user
      error.value = null
      return userCredential
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  const logout = async () => {
    try {
      await signOut($auth)
      user.value = null
      error.value = null
    } catch (e: any) {
      error.value = e.message
      throw e
    }
  }

  const initAuth = () => {
    onAuthStateChanged($auth, (userData) => {
      user.value = userData
    })
  }

  return {
    user,
    error,
    login,
    logout,
    initAuth
  }
}