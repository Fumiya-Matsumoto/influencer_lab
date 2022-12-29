<template>
	<v-app :theme="theme">
		<!-- ヘッダー -->
		<header-component></header-component>

		<!-- ナビゲーションバー -->
		<navigation-drawer></navigation-drawer>

		<v-main>
			<v-container fluid>
				<router-view></router-view>
			</v-container>
		</v-main>
	</v-app>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import HeaderComponent from './components/Header.vue';
import NavigationDrawer from './components/NavigationDrawer.vue';
import { useRouter } from 'vue-router';
import { store } from './store/store';


export default defineComponent({
	components: {
		HeaderComponent,
		NavigationDrawer
	},
	setup() {
		const theme = ref('light');
		const drawer = ref(false);
		const group = ref(null);
		const menu = ref<boolean>(false);
		const router = useRouter();

		const nav_lists = [
			{
				name: 'ホーム',
				icon: 'mdi-view-dashboard',
				link: '/',
			},
			{
				name: 'スクレイピングアカウント',
				icon: 'mdi-account-multiple',
				link: '/scraping_accounts',
			},
			{
				name: 'ハッシュタグ一覧',
				icon: 'mdi-format-list-bulleted',
				link: '/instagram_hashtags',
			},
			{
				name: 'ハッシュタグ登録',
				icon: 'mdi-pound-box-outline',
				link: '/instagram_hashtags/create',
			},
			{
				name: 'DM自動送信',
				icon: 'mdi-send',
				link: '/send_dm',
			},
			{
				name: '抽出設定',
				icon: 'mdi-cog-outline',
				link: '/extract_instagramer/setting'
			}
		]

		function onClick() {
			theme.value = theme.value === 'light' ? 'dark' : 'light'
		}

		const onLogin = () => {
			router.push('/login')
		}

		const selectFacebookPage = () => {
			console.log('OK')
		}

		watch(group, () => {
			drawer.value = false
		})

		return {
			theme,
			drawer,
			group,
			menu,
			nav_lists,
			onClick,
			onLogin,
			selectFacebookPage,
			store,
		}
	}
})


</script>

<style>

</style>
