import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import CreateHashtag from './pages/CreateHashtag.vue';
import SendDM from './pages/SendDM.vue';

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/hashtag/create', name: 'create-hashtag', component: CreateHashtag},
    { path: '/send_dm', name: 'send-dm', component: SendDM },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;