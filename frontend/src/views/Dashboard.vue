<template>
  <div>
    <h1>Área Protegida</h1>
    <p v-if="dados">Bem-vindo! Dados da API: {{ dados }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'

const dados = ref(null)

onMounted(async () => {
  const res = await api.get('/escolas') // Essa rota exige token
  dados.value = res.data
})
</script>
