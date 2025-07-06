<template>
  <div class="container-fluid">
    <div class="row m-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h3 mb-1">Nova Escola</h1>
            <p class="text-muted mb-0">Cadastre uma nova escola no sistema</p>
          </div>
          <div class="d-flex gap-2">
            <BButton 
              variant="outline-secondary" 
              @click="$router.push('/escolas')"
              size="sm"
            >
              <i class="bi bi-arrow-left me-2"></i>
              Voltar à Listagem
            </BButton>
            <BButton 
              variant="outline-secondary" 
              @click="$router.push('/dashboard')"
              size="sm"
            >
              <i class="bi bi-house me-2"></i>
              Início
            </BButton>
            <BButton 
              variant="danger" 
              @click="logout"
              size="sm"
            >
              <i class="bi bi-box-arrow-right me-2"></i>
              Sair
            </BButton>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-lg-8 col-xl-6">
        <BCard>
          <SchoolFormComponent
            ref="formRef"
            :loading="loading"
            submit-text="Salvar"
            @submit="submitForm"
            @cancel="$router.push('/escolas')"
          />
        </BCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api/axios'
import SchoolFormComponent from './components/SchoolFormComponent.vue'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

// Submit form
const submitForm = async (formData) => {
  loading.value = true
  
  try {
    await api.post('/schools', formData)
    
    alert('Escola cadastrada com sucesso!')
    router.push('/escolas')
    
  } catch (error) {
    console.error('Erro ao cadastrar escola:', error)
    
    if (error.response?.data?.error) {
      alert(`Erro: ${error.response.data.error}`)
    } else {
      alert('Erro ao cadastrar escola. Tente novamente.')
    }
  } finally {
    loading.value = false
  }
}

// Logout function
const logout = () => {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
</style>