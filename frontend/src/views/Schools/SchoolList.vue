<template>
  <div class="container-fluid">
    <div class="row m-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h3 mb-1">Escolas Cadastradas</h1>
            <p class="text-muted mb-0">Gerencie todas as escolas do sistema</p>
          </div>
          <div class="d-flex gap-2">
            <BButton 
              variant="outline-primary"
              @click="$router.push('/escolas/nova')"
              size="sm"
            >
              <i class="bi bi-plus-circle me-2"></i>
              Nova Escola
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

    <div class="row m-4">
      <div class="col-md-8">
        <BFormInput
          v-model="searchTerm"
          type="text"
          placeholder="Buscar escolas por nome, município ou código..."
          class="form-control"
        />
      </div>
      <div class="col-md-4">
        <div class="d-flex justify-content-end">
          <div class="text-end">
            <div class="small text-muted">
              <strong>{{ paginatedSchools.length }}</strong> escolas na página
            </div>
            <div class="small text-muted">
              <strong>{{ filteredSchools.length }}</strong> total encontradas
            </div>
            <div class="small text-muted">
              <strong>{{ stats.totalMunicipios }}</strong> municípios
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row m-4">
      <div class="col-12">
        <BCard>
          <div v-if="loading" class="text-center py-5">
            <BSpinner variant="primary" class="mb-3"></BSpinner>
            <p class="text-muted">Carregando escolas...</p>
          </div>

          <div v-else-if="filteredSchools.length === 0" class="text-center py-5">
            <div class="mb-3">
              <i class="bi bi-building display-1 text-muted"></i>
            </div>
            <h4>Nenhuma escola encontrada</h4>
            <p class="text-muted" v-if="searchTerm">
              Tente ajustar sua busca ou
            </p>
            <p class="text-muted" v-else>
              Comece adicionando a primeira escola
            </p>
            <BButton 
              variant="primary" 
              @click="$router.push('/escolas/nova')"
            >
            <i class="bi bi-plus-circle me-2"></i>
              Adicionar Escola
            </BButton>
          </div>

          <div v-else>
            <BTable
              :items="paginatedSchools"
              :fields="tableFields"
              striped
              hover
              responsive
              class="mb-0"
            >
              <template #cell(school_name)="data">
                <strong>{{ data.item.school_name }}</strong>
              </template>

              <template #cell(school_code)="data">
                <code class="bg-light px-2 py-1 rounded">{{ data.item.school_code }}</code>
              </template>

              <template #cell(municipality)="data">
                <span class="badge bg-secondary">{{ data.item.municipality }}</span>
              </template>

              <template #cell(teaching_directorate)="data">
                {{ data.item.teaching_directorate }}
              </template>

              <template #cell(total_classrooms)="data">
                <span class="badge bg-info">{{ data.item.total_classrooms }}</span>
              </template>

              <template #cell(cafeteria)="data">
                <BBadge 
                  :variant="data.item.cafeteria ? 'success' : 'danger'"
                  pill
                >
                  {{ data.item.cafeteria ? 'Sim' : 'Não' }}
                </BBadge>
              </template>

              <template #cell(actions)="data">
                <div class="btn-group" role="group">
                  <BButton
                    variant="outline-primary"
                    size="sm"
                    @click="editSchool(data.item)"
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </BButton>
                  <BButton
                    variant="outline-danger"
                    size="sm"
                    @click="deleteSchool(data.item.id)"
                    title="Excluir"
                  >
                    <i class="bi bi-trash"></i>
                  </BButton>
                </div>
              </template>
            </BTable>

            <div v-if="totalPages > 1" class="d-flex justify-content-between align-items-center mt-4">
              <div class="text-muted small">
                Página {{ currentPage }} de {{ totalPages }} | 
                Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ filteredSchools.length }} escolas
              </div>
              
              <BPagination
                v-model="currentPage"
                :total-rows="filteredSchools.length"
                :per-page="itemsPerPage"
                align="center"
                size="sm"
              />
            </div>
          </div>
        </BCard>
      </div>
    </div>

    <!-- Modal de Edição -->
    <div 
      v-if="showEditModal" 
      class="modal fade show" 
      style="display: block; background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Escola</h5>
            <button 
              type="button" 
              class="btn-close" 
              @click="showEditModal = false"
            ></button>
          </div>
          
          <div class="modal-body">
            <SchoolFormComponent
              ref="editFormRef"
              :initial-data="editingSchool"
              :loading="updating"
              submit-text="Salvar Alterações"
              @submit="updateSchool"
              @cancel="showEditModal = false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api/axios'
import SchoolFormComponent from './components/SchoolFormComponent.vue'

const router = useRouter()

// State
const schools = ref([])
const loading = ref(true)
const searchTerm = ref('')
const showEditModal = ref(false)
const updating = ref(false)
const editingSchool = ref({
  id: null,
  school_name: '',
  school_code: '',
  municipality: '',
  teaching_directorate: '',
  total_classrooms: 0,
  cafeteria: false
})
const currentPage = ref(1)
const itemsPerPage = ref(10)

const tableFields = [
  { key: 'school_name', label: 'Nome da Escola', sortable: true },
  { key: 'school_code', label: 'Código', sortable: true },
  { key: 'municipality', label: 'Município', sortable: true },
  { key: 'teaching_directorate', label: 'Diretoria', sortable: true },
  { key: 'total_classrooms', label: 'Salas', sortable: true },
  { key: 'cafeteria', label: 'Refeitório', sortable: true },
  { key: 'actions', label: 'Ações', sortable: false }
]

const filteredSchools = computed(() => {
  if (!searchTerm.value) return schools.value
  
  const term = searchTerm.value.toLowerCase()
  return schools.value.filter(school => 
    school.school_name.toLowerCase().includes(term) ||
    school.school_code.toLowerCase().includes(term) ||
    school.municipality.toLowerCase().includes(term) ||
    school.teaching_directorate.toLowerCase().includes(term)
  )
})

const paginatedSchools = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSchools.value.slice(start, end)
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

const stats = computed(() => {
  const municipalities = new Set(schools.value.map(school => school.municipality))
  return {
    totalMunicipios: municipalities.size
  }
})

// Methods
const fetchSchools = async () => {
  try {
    loading.value = true
    const response = await api.get('/schools')
    schools.value = response.data
  } catch (error) {
    console.error('Erro ao carregar escolas:', error)
  } finally {
    loading.value = false
  }
}

const editSchool = async (school) => {
  editingSchool.value = { ...school }
  showEditModal.value = true
  await nextTick()
}

const updateSchool = async (formData) => {
  try {
    updating.value = true
    console.log('Atualizando escola:', formData)
    
    await api.put(`/schools/${editingSchool.value.id}`, formData)
    
    const index = schools.value.findIndex(s => s.id === editingSchool.value.id)
    if (index !== -1) {
      schools.value[index] = { ...editingSchool.value, ...formData }
    }
    
    showEditModal.value = false
    editingSchool.value = {
      id: null,
      school_name: '',
      school_code: '',
      municipality: '',
      teaching_directorate: '',
      total_classrooms: 0,
      cafeteria: false
    }
  } catch (error) {
    console.error('Erro ao atualizar escola:', error)
  } finally {
    updating.value = false
  }
}

const deleteSchool = async (schoolId) => {
  if (!confirm('Tem certeza que deseja excluir esta escola?')) return
  
  try {
    await api.delete(`/schools/${schoolId}`)
    schools.value = schools.value.filter(school => school.id !== schoolId)
  } catch (error) {
    console.error('Erro ao excluir escola:', error)
  }
}

const logout = () => {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  router.push('/login')
}

// Watchers
watch(searchTerm, () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  fetchSchools()
})
</script>

<style scoped>
.modal {
  z-index: 1050;
}

.modal.show {
  display: block !important;
}

.modal-backdrop {
  z-index: 1040;
}
</style>