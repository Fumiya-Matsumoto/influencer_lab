<template>
    <v-navigation-drawer
        v-if="store.state.isLogin"
        v-model="drawer"
        :rail="store.state.rail"
        permanent
        disable-resize-watcher
        @click="store.state.rail = false"
    >
        <v-list density="compact" nav>
            <v-list-item
                v-for="menu in menuTree"
                :key="menu.name"
                :prepend-icon="menu.icon"
                :title="menu.name"
                :value="menu.value"
                :to="menu.link"
            ></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import { store } from '../store/store';


export default defineComponent({
    setup() {
        const drawer = ref<boolean>(true);
        const menuTree = [
            {
				name: 'ホーム',
				icon: 'mdi-view-dashboard',
                value: 'home',
				link: '/',
			},
            {
				name: 'Instagramリード',
				icon: 'mdi-view-dashboard',
                value: 'instagram_leads',
				link: '/instagram_leads',
			},
			{
				name: 'スクレイピングアカウント',
				icon: 'mdi-account-multiple',
                value: 'scraping_account',
				link: '/scraping_accounts',
			},
			{
				name: 'ハッシュタグ一覧',
				icon: 'mdi-format-list-bulleted',
                value: 'hashtags',
				link: '/instagram_hashtags',
			},
			{
				name: 'ハッシュタグ登録',
				icon: 'mdi-pound-box-outline',
                value: 'hashtags_create',
				link: '/instagram_hashtags/create',
			},
			{
				name: 'DM自動送信',
				icon: 'mdi-send',
                value: 'send_dm',
				link: '/send_dm',
			},
			{
				name: '抽出設定',
				icon: 'mdi-cog-outline',
                value: 'extract_instagramer_setting',
				link: '/extract_instagramer/setting'
			}
        ]

        return {
            drawer,
            menuTree,
            store,
        }
    }
})
</script>