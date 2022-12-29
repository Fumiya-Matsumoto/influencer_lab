<template>
	<div>
		<!-- <div>
			<h2>Step1 Facebook JavaScript SDKの初期化</h2>
			<p>appId: <input type="text" v-model="appId" /></p>
			<p>appSecrets: <input type="text" v-model="appSecrets" /></p>
			<button @click="onInit">Facebook App Init</button>
			<p style="color: red;">{{ facebookSdkInitStatus }}</p>
      	</div> -->
      	<div>
			<h2>Facebookログイン</h2>
			<v-btn @click="onLogin">Login</v-btn>
      	</div>

      	<!-- <div>
			<h2>長期トークンの取得</h2>
			<v-btn @click="onGetLongAccessToken">Get Long Access Token</v-btn>
			<p>long accessToken: {{ longAccessToken }}</p>
      	</div> -->

      	<div>
			<h2>Facebook Pageの選択</h2>
			<!-- <v-btn @click="onGetMeAccount">Get Me Account</v-btn> -->
			<v-select
				label="Facebook Page"
				v-model="facebookPage"
				:items="facebookPages"
				item-title="name"
				return-object
			></v-select>
      	</div>

      	<!-- <div>
			<h2>Instagram Business Account IDの取得</h2>
			<v-btn @click="onGetInstagramBusinessAccount">
				Get Instagram Business Account
			</v-btn>
			<p>Instagram Business ID: {{ instagramBusinessId }}</p>
      	</div> -->

      	<!-- <div>
			<h2>Instagram Mediaの取得</h2>
			<button @click="onGetMedia">
			Get Media</button
			><br />
			<img :src="instagramMediaSrc" width="400" />
      	</div> -->
    </div>
</template>
  
<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { defineComponent, ref, computed } from "vue";
import { FacebookSdk } from "./facebookSdk";
import { useRouter } from "vue-router";
import { useStore } from "../store/store";
import * as MutationTypes from "../store/mutationTypes";
import * as ActionTypes from "../store/actionTypes";


export default defineComponent({
	name: "FacebookLoginForm",
	setup() {
		const facebookSdk = new FacebookSdk();
		const isFacebookSdkInitialized = ref(false);
		const appId = ref(import.meta.env.VITE_APP_FACEBOOK_APP_ID || "");
		const appSecrets = ref(import.meta.env.VITE_APP_FACEBOOK_APP_SECRETS || "");

		const user_id = ref(""); // ユーザーID
		const accessToken = ref(""); // ユーザーアクセストークン
		const longAccessToken = ref(""); // 長期ユーザーアクセストークン（60日）

		const facebookPages = ref()
		const facebookPage = ref();
		const instagramBusinessId = ref("");
		const instagramMediaSrc = ref("");

		const facebookSdkInitStatus = computed(() =>
			isFacebookSdkInitialized.value ? "成功!!" : "まだ..."
		);

		const router = useRouter();
		const store = useStore();

		const onInit = () => {
			facebookSdk
				.init(appId.value)
				.then((fb: Facebook) => {
					isFacebookSdkInitialized.value = true;
					console.log(fb);
				})
				.catch((error: any) => {
					isFacebookSdkInitialized.value = false;
					console.error(error);
				});
		};

		const onLogin = () => {
			facebookSdk.login(
				(response: FacebookCallbackResponse) => {
					console.log({
						response,
						accessToken
					});

					// ユーザーID、短期アクセストークンを取得
					user_id.value = response.authResponse.userID;
					accessToken.value = response.authResponse.accessToken;

					// 長期アクセストークンの取得
					onGetLongAccessToken();

					// Facebookユーザーの情報を取得
					onGetMe();

					// ユーザーのFacebookページの取得
					onGetMeAccount();

					store.dispatch(ActionTypes.FETCH, user_id.value);
				},
				{
					scope: "instagram_basic,pages_show_list",
					return_scopes: true
				}
			);
		};

		const getAccessToken = (): string => {
			return longAccessToken.value || accessToken.value || "";
		};

		const onLogout = () => {
			facebookSdk.logout();
		};

		const onGetLoginStatus = () => {
			facebookSdk.getLoginStatus();
		};

		// https://developers.facebook.com/docs/instagram-api/getting-started
		const onGetLongAccessToken = async () => {
			const params = new URLSearchParams({
				grant_type: "fb_exchange_token",
				client_id: appId.value,
				client_secret: appSecrets.value,
				fb_exchange_token: getAccessToken() // Long Access Tokenでもいける
			});

			const response = await fetch(
				"https://graph.facebook.com/v15.0/oauth/access_token?" + params
			);

			const json = await response.json();

			longAccessToken.value = json.access_token;

			console.log({
				response,
				json,
				access_token: json.access_token
			});
		};

		const onGetMe = async () => {
			const params = new URLSearchParams({
				fields: "name,email,picture",
				access_token: getAccessToken(),
			});

			const response = await fetch(
				"https://graph.facebook.com/v15.0/me?" + params
			);

			const json = await response.json();

			store.dispatch(ActionTypes.FacebookUserInfo, json);

			console.log({
				json
			});
		}

		// https://developers.facebook.com/docs/instagram-api/getting-started
		const onGetMeAccount = async () => {
			const params = new URLSearchParams({
				fields: "emails,about,category,category_list,link,picture,name,access_token",
				access_token: getAccessToken(),
			});

			const response = await fetch(
				"https://graph.facebook.com/v15.0/me/accounts?" + params
			);

			const json: FacebookMeResponse = await response.json();

			if (json.data && json?.data?.length > 0) {
				facebookPages.value = json.data;
				facebookPage.value = json.data[0];

				store.dispatch(ActionTypes.FacebookPages, facebookPages.value);
			}

			console.log({
				json
			});
		};

		// GET /{page-id}?fields=instagram_business_account
		const onGetInstagramBusinessAccount = async () => {
			const params = new URLSearchParams({
				fields: "instagram_business_account",
				access_token: getAccessToken()
			});

			const response = await fetch(
				`https://graph.facebook.com/v15.0/${facebookPage.value.id}?` + params
			);

			const json: {
				id?: string;
				instagram_business_account?: { id: string };
			} = await response.json();
			
			instagramBusinessId.value = json?.instagram_business_account?.id || "";

			console.log({
				json
			});
		};

		// https://developers.facebook.com/docs/instagram-api/reference/media/
		const onGetMedia = async () => {
			const params = new URLSearchParams({
				fields: "name,media{caption,media_url,permalink,timestamp,username}",
				access_token: getAccessToken()
			});

			const response = await fetch(
				`https://graph.facebook.com/v9.0/${instagramBusinessId.value}?` + params
			);

			const json = await response.json();

			if (json.media.data && json.media.data.length > 0) {
				instagramMediaSrc.value = json.media.data[0].media_url;
				console.log({
					instagramMediaSrc,
					data: json.media.data
				});
			}

			console.log({
				json
			});
		};

		return {
			appId,
			appSecrets,
			accessToken,
			longAccessToken,
			facebookPages,
			facebookPage,
			instagramBusinessId,
			instagramMediaSrc,
			facebookSdkInitStatus,
			onInit,
			onLogin,
			onLogout,
			onGetLoginStatus,
			onGetLongAccessToken,
			onGetMeAccount,
			onGetInstagramBusinessAccount,
			onGetMedia
		};
	}
});
</script>
  
<style scoped>
</style>