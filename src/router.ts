import { createRouter, createWebHistory } from 'vue-router';
import '@mdi/font/css/materialdesignicons.css' 
import Home from './pages/Home.vue';
import CreateHashtag from './pages/CreateHashtag.vue';
import SendDM from './pages/SendDM.vue';
import ScrapingAccount from './pages/ScrapingAccount.vue';

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/scraping_accounts', name: 'scraping-account', component: ScrapingAccount },
    { path: '/hashtag/create', name: 'create-hashtag', component: CreateHashtag },
    { path: '/send_dm', name: 'send-dm', component: SendDM },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;