import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import { isAuthenticated } from "../Authentication/auth";
import NotFoundView from "../views/NotFoundView.vue";
import DashboardView from "../views/DashboardView.vue";
import RegisterView from "../views/RegisterView.vue";


const router = createRouter({
    history:createWebHistory(),
    routes:[{
        path:'/login',
        name:'loginPage',
        component:LoginView
    },
    {
        path:'/dashboard',
        name:'dashboard',
        component:DashboardView
    },
    {
        path:'/register',
        name:'register',
        component:RegisterView
    },
    { path: '/:catchAll(.*)', name: 'NotFound', component: NotFoundView }
   
]
})


router.beforeEach((to,from,next)=>{
    const publicPages = ['/login','/register']
    const authRequired = !publicPages.includes(to.path);
    const userLogedIn = isAuthenticated();    

    if(!userLogedIn && authRequired){
        return next('/login');
    }

    if(userLogedIn && (to.path === '/login'||to.path === '/register')){
        return next('/');
    }
    next();
})

export default router;