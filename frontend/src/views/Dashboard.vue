<template>
  <div class="dashboard-container">
    <NavBar
      title="Dashboard"
      subtitle="Gestão de Instalações Escolares"
      :showAddButton="false"
    />

    <!-- Main Content -->
    <main class="dashboard-main">
      <!-- Stats Cards -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🏫</div>
            <div class="stat-content">
              <h3>{{ stats.totalEscolas }}</h3>
              <p>Total de Escolas</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">🏘️</div>
            <div class="stat-content">
              <h3>{{ stats.totalMunicipios }}</h3>
              <p>Municípios</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">🍽️</div>
            <div class="stat-content">
              <h3>{{ stats.comRefeitorio }}</h3>
              <p>Com Refeitório</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3>{{ stats.mediaSalas }}</h3>
              <p>Média de Salas</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Actions Section -->
      <section class="actions-section">
        <div class="actions-grid">
          <div class="action-card">
            <h3>Upload de CSV</h3>
            <p>Importe dados de escolas via arquivo CSV</p>
            <div class="file-upload">
              <input 
                type="file" 
                @change="handleFileUpload" 
                accept=".csv"
                id="csv-upload"
                class="file-input"
              />
              <label for="csv-upload" class="upload-button">
                Escolher Arquivo
              </label>
            </div>
            <button 
              @click="uploadCsv" 
              :disabled="!selectedFile || uploading"
              class="action-button"
            >
              <span v-if="uploading">Enviando...</span>
              <span v-else>Enviar CSV</span>
            </button>
          </div>

          <div class="action-card">
            <h3>Gerenciar Escolas</h3>
            <p>Acesse a listagem completa de escolas</p>
            <router-link to="/escolas" class="action-button">
              Ver Escolas
            </router-link>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import NavBar from '../components/NavBar.vue'

const router = useRouter()

// State
const selectedFile = ref(null)
const uploading = ref(false)

// Stats
const stats = ref({
  totalEscolas: 0,
  totalMunicipios: 0,
  comRefeitorio: 0,
  mediaSalas: 0
})

// Methods
const loadStats = async () => {
  try {
    const response = await api.get('/schools')
    const escolas = response.data
    
    const municipios = new Set(escolas.map(e => e.municipality))
    const comRefeitorio = escolas.filter(e => e.cafeteria).length
    const mediaSalas = escolas.length > 0 
      ? Math.round(escolas.reduce((sum, e) => sum + e.total_classrooms, 0) / escolas.length)
      : 0

    stats.value = {
      totalEscolas: escolas.length,
      totalMunicipios: municipios.size,
      comRefeitorio,
      mediaSalas
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
  }
}

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0]
}

const uploadCsv = async () => {
  if (!selectedFile.value) return

  try {
    uploading.value = true
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    await api.post('/csv/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Recarregar estatísticas após upload
    await loadStats()
    selectedFile.value = null
    alert('CSV enviado com sucesso!')
  } catch (error) {
    console.error('Erro ao enviar CSV:', error)
    
    let errorMessage = 'Erro ao enviar CSV'
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Timeout: O upload demorou muito. Tente com um arquivo menor ou verifique sua conexão.'
    } else if (error.response) {
      // Erro da API
      if (error.response.status === 413) {
        errorMessage = 'Arquivo muito grande. Tente com um arquivo menor.'
      } else if (error.response.data && error.response.data.error) {
        errorMessage = `Erro: ${error.response.data.error}`
      } else {
        errorMessage = `Erro do servidor (${error.response.status})`
      }
    } else if (error.request) {
      // Erro de rede
      errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.'
    }
    
    alert(errorMessage)
  } finally {
    uploading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f8fafc;
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.stats-section {
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.stat-content h3 {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.stat-content p {
  color: #718096;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

.actions-section {
  margin-bottom: 40px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.action-card h3 {
  color: #2d3748;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.action-card p {
  color: #718096;
  margin: 0 0 20px 0;
  font-size: 14px;
}

.file-upload {
  margin-bottom: 16px;
}

.file-input {
  display: none;
}

.upload-button {
  display: inline-block;
  background: #e2e8f0;
  color: #4a5568;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.upload-button:hover {
  background: #cbd5e0;
}

.action-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.schools-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-header h2 {
  color: #2d3748;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.search-box {
  flex: 1;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.loading {
  text-align: center;
  padding: 40px;
  color: #718096;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #718096;
}

.schools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.school-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.school-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.school-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.school-header h3 {
  color: #2d3748;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.school-actions {
  display: flex;
  gap: 8px;
}

.icon-button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.icon-button:hover {
  background: #f7fafc;
}

.icon-button.delete:hover {
  background: #fed7d7;
  color: #c53030;
}

.school-details p {
  margin: 8px 0;
  font-size: 14px;
  color: #4a5568;
}

.school-details strong {
  color: #2d3748;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  color: #2d3748;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 24px 0;
}

.modal-form .form-group {
  margin-bottom: 20px;
}

.modal-form label {
  display: block;
  color: #4a5568;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}

.modal-form input[type="text"],
.modal-form input[type="number"] {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.modal-form input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.modal-form input[type="checkbox"] {
  margin-right: 8px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-button {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background: #cbd5e0;
}

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Responsividade */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .schools-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    margin: 20px;
    padding: 24px;
  }
}
</style>
