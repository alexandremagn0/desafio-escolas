<template>
  <div class="container-fluid">
    <div class="row m-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h3 mb-1">Instalações Escolares</h1>
            <p class="text-muted mb-0">Gestão profissional</p>
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
              @click="loadStats"
              size="sm"
            >
              <i class="bi bi-arrow-clockwise me-2"></i>
              Atualizar Estatísticas
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

    <div class="row justify-content-center m-4">
      <BCol md="3" sm="6" class="mb-3">
        <BCard class="text-center h-100">
          <div class="d-flex align-items-center justify-content-center mb-3">
            <i class="bi bi-building display-4 text-primary"></i>
          </div>
          <h3 class="text-primary mb-1">{{ stats.totalEscolas }}</h3>
          <p class="text-muted mb-0">Total de Escolas</p>
        </BCard>
      </BCol>
      
      <BCol md="3" sm="6" class="mb-3">
        <BCard class="text-center h-100">
          <div class="d-flex align-items-center justify-content-center mb-3">
            <i class="bi bi-geo-alt display-4 text-success"></i>
          </div>
          <h3 class="text-success mb-1">{{ stats.totalMunicipios }}</h3>
          <p class="text-muted mb-0">Municípios</p>
        </BCard>
      </BCol>
      
      <BCol md="3" sm="6" class="mb-3">
        <BCard class="text-center h-100">
          <div class="d-flex align-items-center justify-content-center mb-3">
            <i class="bi bi-cup-hot display-4 text-warning"></i>
          </div>
          <h3 class="text-warning mb-1">{{ stats.comRefeitorio }}</h3>
          <p class="text-muted mb-0">Com Refeitório</p>
        </BCard>
      </BCol>
      
      <BCol md="3" sm="6" class="mb-3">
        <BCard class="text-center h-100">
          <div class="d-flex align-items-center justify-content-center mb-3">
            <i class="bi bi-graph-up display-4 text-info"></i>
          </div>
          <h3 class="text-info mb-1">{{ stats.mediaSalas }}</h3>
          <p class="text-muted mb-0">Média de Salas</p>
        </BCard>
      </BCol>
    </div>

    <div class="row justify-content-center m-4">
      <BCol lg="6" class="mb-4">
        <BCard>
          <div class="d-flex align-items-center mb-3">
            <i class="bi bi-upload text-primary me-3 fs-4"></i>
            <h5 class="mb-0">Upload de CSV</h5>
          </div>
          <p class="text-muted mb-4">Importe dados de escolas via arquivo CSV</p>
          
          <BForm @submit.prevent="uploadCsv">
            <BFormGroup>
              <BFormFile
                v-model="selectedFile"
                accept=".csv"
                placeholder="Escolher arquivo CSV..."
                drop-placeholder="Arraste o arquivo aqui..."
                :state="selectedFile ? true : null"
              />
            </BFormGroup>
            
            <BButton 
              type="submit" 
              variant="primary" 
              :disabled="!selectedFile || uploading"
              class="w-100"
            >
              <BSpinner v-if="uploading" small class="me-2"></BSpinner>
              {{ uploading ? 'Enviando...' : 'Enviar CSV' }}
            </BButton>
          </BForm>
        </BCard>
      </BCol>
      
      <BCol lg="6" class="mb-4">
        <BCard class="h-100">
          <div class="d-flex align-items-center mb-3">
            <i class="bi bi-list-ul text-success me-3 fs-4"></i>
            <h5 class="mb-0">Gerenciar Escolas</h5>
          </div>
          <p class="text-muted mb-4">Acesse a listagem completa de escolas cadastradas no sistema</p>
          
          <BButton 
            variant="success" 
            @click="$router.push('/escolas')"
            class="w-100 mt-3"
          >
            <i class="bi bi-eye me-2"></i>
            Ver Escolas
          </BButton>
        </BCard>
      </BCol>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'

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

const logout = () => {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  router.push('/login')
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* @media (max-width: 768px) {
  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn {
    width: 100%;
  }
} */
</style>
