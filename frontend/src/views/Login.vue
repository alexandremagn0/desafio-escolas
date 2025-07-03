<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Bem-vindo</h1>
        <p>Faça login para acessar o sistema</p>
      </div>
      
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            placeholder="Digite seu email"
            required
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Senha</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            placeholder="Digite sua senha"
            required
            class="form-input"
          />
        </div>
        
        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="loading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>
      
      <div v-if="erro" class="error-message">
        {{ erro }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const erro = ref('')
const loading = ref(false)
const router = useRouter()

const login = async () => {
  loading.value = true
  erro.value = ''
  
  try {
    console.log('Tentando fazer login...')
    const { data } = await api.post('/auth/login', { 
      email: email.value, 
      password: password.value 
    })
    
    console.log('Login bem-sucedido:', data)
    localStorage.setItem('token', data.token)
    
    // Redireciona imediatamente
    router.push('/dashboard')
    
  } catch (error) {
    console.error('Erro no login:', error)
    
    if (error.response) {
      // Erro da API
      if (error.response.status === 401) {
        erro.value = 'Email ou senha incorretos'
      } else if (error.response.data && error.response.data.error) {
        erro.value = error.response.data.error
      } else {
        erro.value = 'Erro no servidor. Tente novamente.'
      }
    } else if (error.request) {
      // Erro de rede
      erro.value = 'Erro de conexão. Verifique sua internet.'
    } else {
      // Outro erro
      erro.value = 'Erro ao fazer login. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  padding: 60px 50px;
  width: 100%;
  max-width: 500px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  color: #2d3748;
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.login-header p {
  color: #718096;
  font-size: 18px;
  margin: 0;
  line-height: 1.5;
}

.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  color: #4a5568;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 10px;
}

.form-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: #fafafa;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  background: white;
}

.form-input::placeholder {
  color: #a0aec0;
}

.login-button {
  width: 100%;
  padding: 18px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 12px;
  letter-spacing: 0.5px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.login-button:active:not(:disabled) {
  transform: translateY(-1px);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 16px 20px;
  border-radius: 12px;
  font-size: 15px;
  margin-bottom: 20px;
  border: 1px solid #feb2b2;
  text-align: center;
}

/* Responsividade para tablets */
@media (max-width: 768px) {
  .login-container {
    padding: 30px 20px;
  }
  
  .login-card {
    padding: 50px 40px;
    max-width: 450px;
  }
  
  .login-header h1 {
    font-size: 32px;
  }
  
  .login-header p {
    font-size: 17px;
  }
  
  .form-input {
    padding: 14px 18px;
  }
  
  .login-button {
    padding: 16px 28px;
    font-size: 17px;
  }
}

/* Responsividade para mobile */
@media (max-width: 480px) {
  .login-container {
    padding: 20px 15px;
  }
  
  .login-card {
    padding: 40px 30px;
    border-radius: 16px;
  }
  
  .login-header h1 {
    font-size: 28px;
  }
  
  .login-header p {
    font-size: 16px;
  }
  
  .form-input {
    padding: 12px 16px;
    font-size: 16px;
  }
  
  .login-button {
    padding: 14px 24px;
    font-size: 16px;
  }
  
  .error-message {
    padding: 14px 16px;
    font-size: 14px;
  }
}

/* Responsividade para telas muito pequenas */
@media (max-width: 360px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
  
  .form-input {
    padding: 10px 14px;
  }
  
  .login-button {
    padding: 12px 20px;
  }
}
</style>
