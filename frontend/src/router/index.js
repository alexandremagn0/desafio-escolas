import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import SchoolList from '../views/Schools/SchoolList.vue'
import SchoolForm from '../views/Schools/SchoolForm.vue'

const routes = [
  { 
    path: '/', 
    redirect: (to) => {
      const token = localStorage.getItem('token')
      return token ? '/dashboard' : '/login'
    }
  },
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
    component: SchoolList,
    meta: { requiresAuth: true }
  },
  {
    path: '/escolas/nova',
    component: SchoolForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/escolas/editar/:id',
    component: SchoolForm,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

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
