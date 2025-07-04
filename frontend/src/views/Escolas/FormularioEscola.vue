<template>
  <div class="formulario-container">
    <NavBar
      title="Nova Escola"
      subtitle="Cadastre uma nova escola no sistema"
      :showAddButton="true"
      addButtonTo="/escolas"
      addButtonText="← Voltar à Listagem"
    />

    <!-- Main Content -->
    <main class="formulario-main">
      <div class="form-card">
        <form @submit.prevent="submitForm" class="school-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nome_escola">Nome da Escola *</label>
              <input 
                id="nome_escola"
                v-model="form.nome_escola" 
                type="text" 
                placeholder="Digite o nome da escola"
                required
                class="form-input"
                :class="{ 'error': errors.nome_escola }"
              />
              <span v-if="errors.nome_escola" class="error-message">{{ errors.nome_escola }}</span>
            </div>
            
            <div class="form-group">
              <label for="codigo_escola">Código da Escola *</label>
              <input 
                id="codigo_escola"
                v-model="form.codigo_escola" 
                type="text" 
                placeholder="Digite o código da escola"
                required
                class="form-input"
                :class="{ 'error': errors.codigo_escola }"
              />
              <span v-if="errors.codigo_escola" class="error-message">{{ errors.codigo_escola }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="municipio">Município *</label>
              <input 
                id="municipio"
                v-model="form.municipio" 
                type="text" 
                placeholder="Digite o município"
                required
                class="form-input"
                :class="{ 'error': errors.municipio }"
              />
              <span v-if="errors.municipio" class="error-message">{{ errors.municipio }}</span>
            </div>
            
            <div class="form-group">
              <label for="diretoria_ensino">Diretoria de Ensino *</label>
              <input 
                id="diretoria_ensino"
                v-model="form.diretoria_ensino" 
                type="text" 
                placeholder="Digite a diretoria de ensino"
                required
                class="form-input"
                :class="{ 'error': errors.diretoria_ensino }"
              />
              <span v-if="errors.diretoria_ensino" class="error-message">{{ errors.diretoria_ensino }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="total_salas_aula">Total de Salas de Aula *</label>
              <input 
                id="total_salas_aula"
                v-model="form.total_salas_aula" 
                type="number" 
                min="0"
                placeholder="Digite o número de salas"
                required
                class="form-input"
                :class="{ 'error': errors.total_salas_aula }"
              />
              <span v-if="errors.total_salas_aula" class="error-message">{{ errors.total_salas_aula }}</span>
            </div>
            
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input 
                  v-model="form.refeitorio" 
                  type="checkbox" 
                  class="checkbox-input"
                />
                <span class="checkbox-text">Possui Refeitório</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <router-link to="/escolas" class="cancel-button">
              Cancelar
            </router-link>
            <button type="submit" class="submit-button" :disabled="loading">
              <span v-if="loading">Salvando...</span>
              <span v-else>Salvar Escola</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api/axios'
import NavBar from '../../components/NavBar.vue'

const router = useRouter()

// Form state
const form = reactive({
  nome_escola: '',
  codigo_escola: '',
  municipio: '',
  diretoria_ensino: '',
  total_salas_aula: '',
  refeitorio: false
})

// UI state
const loading = ref(false)
const errors = reactive({})

// Validation
const validateForm = () => {
  for (const key in errors) delete errors[key]
  
  if (!form.nome_escola.trim()) {
    errors.nome_escola = 'Nome da escola é obrigatório'
  }
  
  if (!form.codigo_escola.trim()) {
    errors.codigo_escola = 'Código da escola é obrigatório'
  }
  
  if (!form.municipio.trim()) {
    errors.municipio = 'Município é obrigatório'
  }
  
  if (!form.diretoria_ensino.trim()) {
    errors.diretoria_ensino = 'Diretoria de ensino é obrigatória'
  }
  
  if (!form.total_salas_aula || form.total_salas_aula < 0) {
    errors.total_salas_aula = 'Total de salas deve ser um número válido'
  }
  
  return Object.keys(errors).length === 0
}

// Submit form
const submitForm = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    const formData = {
      ...form,
      total_salas_aula: parseInt(form.total_salas_aula)
    }
    
    await api.post('/escolas', formData)
    
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
</script>

<style scoped>
.formulario-container {
  min-height: 100vh;
  background: #f8fafc;
}

.formulario-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.school-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.checkbox-group {
  justify-content: flex-end;
}

.form-group label {
  color: #4a5568;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #fafafa;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.form-input.error {
  border-color: #e53e3e;
  background: #fff5f5;
}

.form-input.error:focus {
  border-color: #e53e3e;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.error-message {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
}

.checkbox-input {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  accent-color: #667eea;
}

.checkbox-text {
  color: #4a5568;
  font-weight: 500;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.cancel-button {
  background: #e2e8f0;
  color: #4a5568;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background: #cbd5e0;
}

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Responsividade */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .form-card {
    padding: 24px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .submit-button {
    order: -1;
  }
}

@media (max-width: 480px) {
  .formulario-main {
    padding: 20px 15px;
  }
  
  .form-card {
    padding: 20px;
  }
}
</style>