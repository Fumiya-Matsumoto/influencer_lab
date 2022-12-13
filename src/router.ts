import { createRouter, createWebHistory } from 'vue-router';
import '@mdi/font/css/materialdesignicons.css' 
import Home from './pages/Home.vue';
import HashtagIndex from './pages/HashtagIndex.vue';
import CreateHashtag from './pages/CreateHashtag.vue';
import SendDM from './pages/SendDM.vue';
import ScrapingAccount from './pages/ScrapingAccount.vue';
import ExtractInstagramerSetting from './pages/ExtractInstagramerSetting.vue'

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/scraping_accounts', name: 'scraping-account', component: ScrapingAccount },
    { path: '/instagram_hashtags', name: 'hashtag-index', component: HashtagIndex },
    { path: '/instagram_hashtags/create', name: 'create-hashtag', component: CreateHashtag },
    { path: '/send_dm', name: 'send-dm', component: SendDM },
    { path: '/extract_instagramer/setting', name: 'extract-instagramer-setting', component: ExtractInstagramerSetting},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;