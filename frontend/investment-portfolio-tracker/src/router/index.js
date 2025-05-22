import {createRouter, createWebHistory} from 'vue-router'
import TransactionHistory from '../views/TransactionHistory.vue'
import BuyInvestment from '../views/BuyInvestment.vue'
import MyPortfolio from '../views/MyPortfolio.vue'
import SellInvestment from '../views/SellInvestment.vue'
const routes = [
    {path : '/transactions', component: TransactionHistory},
    {path : '/BuyInvestment', component: BuyInvestment},
    {path : '/myportfolio', component: MyPortfolio},
    {
        path: '/sell-investment/:id',
        name: 'SellInvestment',
        component: SellInvestment,
        props: true
      },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router