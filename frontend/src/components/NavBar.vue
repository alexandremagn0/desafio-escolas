<template>
  <header class="navbar-header">
    <div class="header-content">
      <div class="header-left">
        <h1>{{ title }}</h1>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <div class="header-right">
        <router-link v-if="showAddButton" :to="addButtonTo" class="add-button">
          <span>{{ addButtonText || '+ Nova Escola' }}</span>
        </router-link>
        <router-link v-if="router.currentRoute.value.path !== '/'" to="/" class="dashboard-button">
          <span>🏠 Dashboard</span>
        </router-link>
        <button @click="logout" class="logout-button">
          <span>⏻ Sair</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
// Componente NavBar reutilizável para navegação principal
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  showAddButton: { type: Boolean, default: false },
  addButtonTo: { type: String, default: '/escolas/nova' },
  addButtonText: { type: String, default: '+ Nova Escola' }
})

const logout = () => {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.navbar-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.header-left h1 {
  color: #2d3748;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.header-left p {
  color: #718096;
  margin: 0;
  font-size: 16px;
}

.add-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-right: 10px;
}
.add-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
.dashboard-button {
  background: #edf2f7;
  color: #2d3748;
  text-decoration: none;
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: 600;
  margin-right: 10px;
  transition: all 0.3s ease;
  border: none;
  display: inline-block;
}
.dashboard-button:hover {
  background: #e2e8f0;
  color: #667eea;
}
.logout-button {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.logout-button:hover {
  background: #c53030;
}
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  .header-right {
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
}
</style> 