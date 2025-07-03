<template>
  <div class="listagem-container">
    <NavBar
      title="Escolas Cadastradas"
      subtitle="Gerencie todas as escolas do sistema"
      :showAddButton="true"
      addButtonTo="/escolas/nova"
      addButtonText="+ Nova Escola"
    />

    <!-- Main Content -->
    <main class="listagem-main">
      <!-- Search and Stats -->
      <section class="search-section">
        <div class="search-header">
          <div class="search-box">
            <input 
              v-model="searchTerm" 
              type="text" 
              placeholder="Buscar escolas por nome, município ou código..."
              class="search-input"
            />
          </div>
          <div class="stats-info">
            <span class="stat-item">
              <strong>{{ paginatedSchools.length }}</strong> escolas na página
            </span>
            <span class="stat-item">
              <strong>{{ filteredSchools.length }}</strong> total encontradas
            </span>
            <span class="stat-item">
              <strong>{{ stats.totalMunicipios }}</strong> municípios
            </span>
          </div>
        </div>
      </section>

      <!-- Schools List -->
      <section class="schools-section">
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
          <p>Carregando escolas...</p>
        </div>

        <div v-else-if="filteredSchools.length === 0" class="empty-state">
          <div class="empty-icon">🏫</div>
          <h3>Nenhuma escola encontrada</h3>
          <p v-if="searchTerm">Tente ajustar sua busca ou</p>
          <p v-else>Comece adicionando a primeira escola</p>
          <router-link to="/escolas/nova" class="empty-action">
            Adicionar Escola
          </router-link>
        </div>

        <div v-else>
          <div class="schools-grid">
            <div 
              v-for="school in paginatedSchools" 
              :key="school.id" 
              class="school-card"
            >
              <div class="school-header">
                <h3>{{ school.nome_escola }}</h3>
                <div class="school-actions">
                  <button @click="editSchool(school)" class="icon-button edit">
                    <span>✏️</span>
                  </button>
                  <button @click="deleteSchool(school.id)" class="icon-button delete">
                    <span>🗑️</span>
                  </button>
                </div>
              </div>
              <div class="school-details">
                <div class="detail-row">
                  <span class="detail-label">Código:</span>
                  <span class="detail-value">{{ school.codigo_escola }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Município:</span>
                  <span class="detail-value">{{ school.municipio }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Diretoria:</span>
                  <span class="detail-value">{{ school.diretoria_ensino }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Salas de Aula:</span>
                  <span class="detail-value">{{ school.total_salas_aula }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Refeitório:</span>
                  <span class="detail-value">
                    <span :class="school.refeitorio ? 'status-yes' : 'status-no'">
                      {{ school.refeitorio ? 'Sim' : 'Não' }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <div class="pagination-info">
              <span>Página {{ currentPage }} de {{ totalPages }}</span>
              <span>Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ filteredSchools.length }} escolas</span>
            </div>
            
            <div class="pagination-controls">
              <button 
                @click="goToPage(currentPage - 1)" 
                :disabled="currentPage === 1"
                class="pagination-button"
              >
                ← Anterior
              </button>
              
              <div class="page-numbers">
                <button 
                  v-for="page in visiblePages" 
                  :key="page"
                  @click="goToPage(page)"
                  :class="['page-button', { active: page === currentPage }]"
                >
                  {{ page }}
                </button>
              </div>
              
              <button 
                @click="goToPage(currentPage + 1)" 
                :disabled="currentPage === totalPages"
                class="pagination-button"
              >
                Próxima →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Edit School Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal" @click.stop>
        <h2>Editar Escola</h2>
        <form @submit.prevent="updateSchool" class="modal-form">
          <div class="form-group">
            <label>Nome da Escola</label>
            <input v-model="editingSchool.nome_escola" type="text" required />
          </div>
          <div class="form-group">
            <label>Código da Escola</label>
            <input v-model="editingSchool.codigo_escola" type="text" required />
          </div>
          <div class="form-group">
            <label>Município</label>
            <input v-model="editingSchool.municipio" type="text" required />
          </div>
          <div class="form-group">
            <label>Diretoria de Ensino</label>
            <input v-model="editingSchool.diretoria_ensino" type="text" required />
          </div>
          <div class="form-group">
            <label>Total de Salas de Aula</label>
            <input v-model="editingSchool.total_salas_aula" type="number" required />
          </div>
          <div class="form-group">
            <label>
              <input v-model="editingSchool.refeitorio" type="checkbox" />
              Possui Refeitório
            </label>
          </div>
          <div class="modal-actions">
            <button type="button" @click="showEditModal = false" class="cancel-button">
              Cancelar
            </button>
            <button type="submit" class="submit-button">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api/axios'
import NavBar from '../../components/NavBar.vue'

const router = useRouter()

// State
const schools = ref([])
const loading = ref(true)
const searchTerm = ref('')
const showEditModal = ref(false)
const editingSchool = ref({})

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(15)

// Stats
const stats = ref({
  totalMunicipios: 0
})

// Computed
const filteredSchools = computed(() => {
  if (!searchTerm.value) return schools.value
  return schools.value.filter(school => 
    school.nome_escola.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    school.municipio.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    school.codigo_escola.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const totalPages = computed(() => {
  return Math.ceil(filteredSchools.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage.value, filteredSchools.value.length)
})

const paginatedSchools = computed(() => {
  return filteredSchools.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Watchers
watch(searchTerm, () => {
  currentPage.value = 1 // Reset to first page when search changes
})

// Methods
const loadSchools = async () => {
  try {
    loading.value = true
    const response = await api.get('/escolas')
    schools.value = response.data
    calculateStats()
  } catch (error) {
    console.error('Erro ao carregar escolas:', error)
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  const municipios = new Set(schools.value.map(e => e.municipio))
  stats.value = {
    totalMunicipios: municipios.size
  }
}

const editSchool = (school) => {
  editingSchool.value = { ...school }
  showEditModal.value = true
}

const updateSchool = async () => {
  try {
    await api.put(`/escolas/${editingSchool.value.id}`, editingSchool.value)
    await loadSchools()
    showEditModal.value = false
    alert('Escola atualizada com sucesso!')
  } catch (error) {
    console.error('Erro ao atualizar escola:', error)
    alert('Erro ao atualizar escola')
  }
}

const deleteSchool = async (id) => {
  if (!confirm('Tem certeza que deseja deletar esta escola?')) return

  try {
    await api.delete(`/escolas/${id}`)
    await loadSchools()
    alert('Escola deletada com sucesso!')
  } catch (error) {
    console.error('Erro ao deletar escola:', error)
    alert('Erro ao deletar escola')
  }
}

const goToPage = (page) => {
  currentPage.value = page
}

// Lifecycle
onMounted(() => {
  loadSchools()
})
</script>

<style scoped>
.listagem-container {
  min-height: 100vh;
  background: #f8fafc;
}

.listagem-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.search-section {
  margin-bottom: 30px;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.search-box {
  flex: 1;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.stats-info {
  display: flex;
  gap: 20px;
}

.stat-item {
  color: #718096;
  font-size: 14px;
}

.stat-item strong {
  color: #2d3748;
}

.schools-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.loading {
  text-align: center;
  padding: 60px;
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
  padding: 60px 20px;
  color: #718096;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  color: #2d3748;
  font-size: 20px;
  margin: 0 0 8px 0;
}

.empty-state p {
  margin: 4px 0;
  font-size: 16px;
}

.empty-action {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 16px;
  transition: all 0.3s ease;
}

.empty-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.schools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.school-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  background: white;
}

.school-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
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
  padding: 6px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.icon-button.edit:hover {
  background: #edf2f7;
  color: #667eea;
}

.icon-button.delete:hover {
  background: #fed7d7;
  color: #c53030;
}

.school-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.detail-label {
  color: #718096;
  font-size: 14px;
  font-weight: 500;
}

.detail-value {
  color: #2d3748;
  font-size: 14px;
  font-weight: 600;
}

.status-yes {
  color: #38a169;
  background: #f0fff4;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status-no {
  color: #e53e3e;
  background: #fff5f5;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
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

/* Pagination */
.pagination {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.pagination-info {
  display: flex;
  gap: 20px;
  color: #718096;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-button {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.pagination-button:hover:not(:disabled) {
  background: #cbd5e0;
  color: #2d3748;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-button {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 40px;
  font-size: 14px;
}

.page-button:hover {
  background: #cbd5e0;
  color: #2d3748;
}

.page-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.page-button.active:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* Responsividade */
@media (max-width: 768px) {
  .search-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .stats-info {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .schools-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    margin: 20px;
    padding: 24px;
  }
  
  .pagination-info {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
  
  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 8px;
  }
}
</style>