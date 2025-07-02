<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Senha" />
      <button type="submit">Entrar</button>
    </form>
    <p v-if="erro">{{ erro }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const erro = ref(null)
const router = useRouter()

const login = async () => {
  try {
    const { data } = await api.post('/login', { email: email.value, password: password.value })
    localStorage.setItem('token', data.token)
    router.push('/dashboard')
  } catch (err) {
    erro.value = 'Email ou senha inválidos'
  }
}
</script>
