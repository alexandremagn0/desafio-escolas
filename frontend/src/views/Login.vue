<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center" 
       style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <BCard class="shadow-lg border-0 pt-5">
            <div class="text-center mb-4">
              <h2 class="fw-bold text-dark mb-2">Bem-vindo</h2>
              <p class="text-muted mb-0">Faça login para acessar o sistema</p>
            </div>
            
            <BForm @submit.prevent="login" class="m-3">
              <BFormGroup 
                label="Email" 
                label-for="email"
              >
                <BFormInput
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="Digite seu email"
                  :state="!errors.email"
                  @blur="validateField('email')"
                />
              </BFormGroup>
              
              <BFormGroup 
                label="Senha" 
                label-for="password"
                class="mb-4"
              >
                <BFormInput
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="Digite sua senha"
                  :state="!errors.password"
                  @blur="validateField('password')"
                />
              </BFormGroup>
              
              <!-- Alerta de erro simples -->
              <div 
                v-if="erro" 
                class="alert alert-danger mb-3"
                role="alert"
              >
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ erro }}
              </div>
              
              <!-- Alert de erro de validação -->
              <div 
                v-if="validationErrors.length > 0" 
                class="alert alert-warning mb-3"
                role="alert"
              >
                <i class="bi bi-exclamation-circle me-2"></i>
                <strong>Corrija os seguintes campos:</strong>
                <ul class="mb-0 mt-1">
                  <li v-for="error in validationErrors" :key="error">{{ error }}</li>
                </ul>
              </div>
              
              <BButton 
                type="submit" 
                variant="primary" 
                size="lg"
                :disabled="loading"
                class="w-100"
              >
                <BSpinner v-if="loading" small class="me-2"></BSpinner>
                {{ loading ? 'Entrando...' : 'Entrar' }}
              </BButton>
            </BForm>
            
            <div class="text-center mt-4">
              <small class="text-muted">
                <i class="bi bi-shield-check me-1"></i>
                Sistema de Gestão Escolar
              </small>
            </div>
          </BCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const erro = ref('')
const loading = ref(false)
const router = useRouter()

// Estados para validação
const errors = reactive({})
const validationErrors = ref([])

// Validação de campo individual
const validateField = (fieldName) => {
  delete errors[fieldName]
  
  switch (fieldName) {
    case 'email':
      if (!email.value.trim()) {
        errors.email = 'Email é obrigatório'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.email = 'Email inválido'
      }
      break
      
    case 'password':
      if (!password.value.trim()) {
        errors.password = 'Senha é obrigatória'
      } else if (password.value.length < 6) {
        errors.password = 'Senha deve ter pelo menos 6 caracteres'
      }
      break
  }
}

const validateForm = () => {
  validationErrors.value = []
  
  validateField('email')
  validateField('password')
  
  Object.values(errors).forEach(error => {
    if (error) {
      validationErrors.value.push(error)
    }
  })
  
  return validationErrors.value.length === 0
}

const login = async () => {
  erro.value = ''
  validationErrors.value = []
  
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    const { data } = await api.post('/auth/login', { 
      email: email.value, 
      password: password.value 
    })
    
    localStorage.setItem('token', data.token)
    
    router.push('/dashboard')
    
  } catch (error) {
    console.error('Erro no login:', error)
    
    if (error.response) {
      const status = error.response.status
      const responseData = error.response.data
      
      // Sempre priorizar a mensagem do backend
      if (responseData.error) {
        erro.value = responseData.error
      } else if (responseData.message) {
        erro.value = responseData.message
      } else {
        switch (status) {
          case 400:
            erro.value = 'Dados inválidos. Verifique email e senha.'
            break
            
          case 401:
            erro.value = 'Email ou senha incorretos'
            break
            
          case 422:
            // Erro de validação do backend
            if (responseData.errors) {
              Object.values(responseData.errors).forEach(errorMsg => {
                validationErrors.value.push(errorMsg)
              })
            }
            break
            
          case 500:
            erro.value = 'Erro interno do servidor. Tente novamente mais tarde.'
            break
            
          default:
            erro.value = 'Erro no servidor. Tente novamente.'
        }
      }
    } else if (error.request) {
      erro.value = 'Erro de conexão. Verifique sua internet e tente novamente.'
    } else {
      erro.value = 'Erro ao fazer login. Tente novamente.'
    }

    await nextTick()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
