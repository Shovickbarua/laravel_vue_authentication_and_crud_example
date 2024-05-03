import { createRouter, createWebHistory } from 'vue-router'
import Login from "../pages/auth/Login.vue";
import Register from "../pages/auth/Register.vue";
import Inventory from "../pages/inventories/Inventory.vue";
import InventoryForm from "../pages/inventories/InventoryForm.vue";
import Items from "../pages/items/Items.vue";
import ItemForm from "../pages/items/ItemForm.vue";
import Root from "../Root.vue"
import GuestRoot from "../GuestRoot.vue"
import { inject } from 'vue'

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
  
  // Global beforeEach guard to redirect based on user state
  router.beforeEach((to, from, next) => {
    const user = inject('user'); // This retrieves the 'user' context
    console.log('user', user);
    if (to.path === '/' || to.path === '/register') {
      // Guest routes
      if (user && user.value) {
        // Redirect logged-in users to inventory
        return next('/inventory');
      }
    } else {
      // Protected routes
      if (!user || !user.value) {
        // Redirect not-logged-in users to login
        return next('/');
      }
    }
  
    next(); // Proceed to the next step if all checks pass
  });
  export default router