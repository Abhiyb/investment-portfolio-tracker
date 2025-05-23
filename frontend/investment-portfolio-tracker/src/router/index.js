import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import { isAuthenticated } from "../Authentication/auth";
import NotFoundView from "../views/NotFoundView.vue";
import DashboardView from "../views/DashboardView.vue";
import RegisterView from "../views/RegisterView.vue";

import InvestmentView from "../views/InvestmentView.vue";
import TransactionHistory from '../views/TransactionHistory.vue'
import BuyInvestment from '../views/BuyInvestment.vue'
import MyPortfolio from '../views/MyPortfolio.vue'
import SellInvestment from '../views/SellInvestment.vue'


const router = createRouter({
    history: createWebHistory(),
    routes: [{
        path: '/login',
        name: 'loginPage',
        component: LoginView
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardView
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/investments',
        name: 'investment',
        component: InvestmentView,
      },
    
    { path: '/transactions', component: TransactionHistory },
    { path: '/BuyInvestment', component: BuyInvestment },
    { path: '/myportfolio', component: MyPortfolio },
    {
        path: '/sell-investment/:id',
        name: 'SellInvestment',
        component: SellInvestment,
        props: true
    },
    {
        path: '/buy-investment/:id',
        name: 'BuyInvestment',
        component: BuyInvestment,
        props: true
    },
    { path: '/:catchAll(.*)', name: 'NotFound', component: NotFoundView },

    ]
})


router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register']
    const authRequired = !publicPages.includes(to.path);
    const userLogedIn = isAuthenticated();

    if (!userLogedIn && authRequired) {
        return next('/login');
    }

    if (userLogedIn && (to.path === '/login' || to.path === '/register')) {
        return next('/');
    }
    next();
})


export default router