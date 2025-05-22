import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Button from "primevue/button"
import 'primeicons/primeicons.css'
import 'bootstrap/dist/css/bootstrap.min.css'




const app = createApp(App)

app.use(router)

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.component('Button', Button);


app.mount('#app')
