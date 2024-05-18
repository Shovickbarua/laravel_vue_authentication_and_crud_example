import { createRouter, createWebHistory } from 'vue-router'
import Login from "../pages/auth/Login.vue";
import Register from "../pages/auth/Register.vue";
import Inventory from "../pages/inventories/Inventory.vue";
import InventoryForm from "../pages/inventories/InventoryForm.vue";
import Items from "../pages/items/Items.vue";
import ItemForm from "../pages/items/ItemForm.vue";
import Root from "../Root.vue"
import GuestRoot from "../GuestRoot.vue"
import useAuth from '../composables/UseAuth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      {
        path: '/',
        name: 'guest',
        component: GuestRoot,
        children: [
          { path: '/', name: 'login', component: Login },
          { path: '/register', name: 'register', component: Register },
        ]
      },
      {
        path: '/',
        name: 'root',
        component: Root,
        meta: { requiresAuth: true },
        children: [
          { path: '/inventory', name: 'inventory', component: Inventory },
          { path: '/add-inventory', name: 'add-inventory', component: InventoryForm },
          { path: '/edit-inventory/:id', name: 'edit-inventory', component: InventoryForm, props: true },
          { path: '/item', name: 'item', component: Items },
          { path: '/add-item', name: 'add-item', component: ItemForm },
          { path: '/edit-item/:id', name: 'edit-item', component: ItemForm, props: true },
        ]
      },
  
    ]
  })
  
  router.beforeEach((to, from, next) => {
    const { isAuthenticated } = useAuth();
    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated.value) {
      next({ path: '/' });
    } else {
      next();
    }
  });
  
  export default router