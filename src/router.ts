import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import CreateHashtag from './pages/CreateHashtag.vue';

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/hashtag/create', name: 'create-hashtag', component: CreateHashtag},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;