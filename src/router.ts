import { createRouter, createWebHistory } from 'vue-router';
import '@mdi/font/css/materialdesignicons.css' 
import Home from './pages/Home.vue';
import Login from './components/FacebookLoginForm.vue';
import InstagramLeadIndex from './pages/InstagramLeadIndex.vue';
import HashtagIndex from './pages/HashtagIndex.vue';
import CreateHashtag from './pages/CreateHashtag.vue';
import SendDM from './pages/SendDM.vue';
import ScrapingAccount from './pages/ScrapingAccount.vue';
import ExtractInstagramerSetting from './pages/ExtractInstagramerSetting.vue'
import { store } from './store/store';


const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'home', component: Login },
    { path: '/instagram_leads', name: 'instagram-lead', component: InstagramLeadIndex },
    { path: '/scraping_accounts', name: 'scraping-account', component: ScrapingAccount, meta: { requiresAuth: true } },
    { path: '/instagram_hashtags', name: 'hashtag-index', component: HashtagIndex, meta: { requiresAuth: true } },
    { path: '/instagram_hashtags/create', name: 'create-hashtag', component: CreateHashtag, meta: { requiresAuth: true } },
    { path: '/send_dm', name: 'send-dm', component: SendDM, meta: { requiresAuth: true }},
    { path: '/extract_instagramer/setting', name: 'extract-instagramer-setting', component: ExtractInstagramerSetting, meta: { requiresAuth: true } },
]


const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.state.isLogin) {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath
                }
            })
        } else {
            next();
        }
    } else {
        next();
    }
});


export default router;