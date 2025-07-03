import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import ListagemEscolas from '../views/Escolas/ListagemEscolas.vue'
import FormularioEscola from '../views/Escolas/FormularioEscola.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { 
    path: '/login', 
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/escolas',
    component: ListagemEscolas,
    meta: { requiresAuth: true }
  },
  {
    path: '/escolas/nova',
    component: FormularioEscola,
    meta: { requiresAuth: true }
  },
  {
    path: '/escolas/editar/:id',
    component: FormularioEscola,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Protege rotas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // Se a rota requer autenticação e não há token
  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }
  
  // Se a rota é para usuários não logados e há token
  if (to.meta.requiresGuest && token) {
    next('/dashboard')
    return
  }
  
  // Caso contrário, permite a navegação
  next()
})

export default router
