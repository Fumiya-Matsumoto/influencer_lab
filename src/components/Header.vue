<template>
    <v-app-bar>
        <template v-slot:prepend>
            <v-app-bar-nav-icon
                v-if="store.state.isLogin"
                @click.stop="store.state.rail = !store.state.rail">
            </v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>InfluencerLab</v-app-bar-title>

        <v-btn
            v-if="!store.state.isLogin"
            @click="onLogin"
        >
            ログイン
        </v-btn>
        <v-btn
            v-else
            @click="onLogout"
        >
            ログアウト
        </v-btn>
        <!-- <v-btn @click="onGetLoginStatus">
            ログインステータス
        </v-btn> -->

        <v-menu
            v-if="store.state.isLogin"
            v-model="menu"
            :close-on-content-click="false"
            location="bottom"
        >
            <template v-slot:activator="{ props }">
                <v-btn
                    icon
                    v-bind="props"
                >
                    <!-- <v-icon>mdi-dots-vertical</v-icon> -->
                    <v-avatar class="mr-2">
                        <v-img
                            :src="store.state.facebookPage.picture.data.url"
                            :alt="store.state.facebookPage.name"
                        ></v-img>
                    </v-avatar>
                </v-btn>
            </template>

            <v-card min-width="300">
                <v-list>
                    <v-list-item
                        :prepend-avatar="store.state.facebookPage.picture.data.url"
                        :title="store.state.facebookPage.name"
                        :subtitle="store.state.facebookPage.category"
                    >
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                    <v-list-item
                        v-for="facebookPage in store.state.facebookPages"
                        :key="facebookPage.id"
                        :prepend-avatar="facebookPage.picture.data.url"
                        :title="facebookPage.name"
                        :subtitle="facebookPage.category"
                        height="60"
                        @click="selectFacebookPage(facebookPage)"
                    >
                    </v-list-item>
                </v-list>
            </v-card>
        </v-menu>     
    </v-app-bar>
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import { FacebookSdk } from "./facebookSdk";
import { useRouter } from 'vue-router';
import { store } from '../store/store';
import * as ActionTypes from "../store/actionTypes";


type Category = {
    id: string;
    name: string;
}

type Picture = {
    data: {
        height: number;
        width: number;
        is_silhouette: boolean;
        url: string;
    }
}

type FacebookPage = {
    id: string;
    access_token: string;
    name: string;
    category: string;
    category_list: Category[];
    link: string;
    picture: Picture;
}


export default defineComponent({
    setup() {
        const facebookSdk = new FacebookSdk();
        const appId = ref(import.meta.env.VITE_APP_FACEBOOK_APP_ID || "");
		const appSecrets = ref(import.meta.env.VITE_APP_FACEBOOK_APP_SECRETS || "");

        const user_id = ref(""); // ユーザーID
		const accessToken = ref(""); // ユーザーアクセストークン
		const longAccessToken = ref(""); // 長期ユーザーアクセストークン（60日）

        const facebookPages = ref()
		const facebookPage = ref();

        const router = useRouter();
        const menu = ref<boolean>(false);

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
                store.dispatch(ActionTypes.FacebookPage, facebookPage.value);
			}

			console.log({
				json
			});
		};

        const onLogout = () => {
			facebookSdk.logout();
		};

        const onGetLoginStatus = () => {
			facebookSdk.getLoginStatus();
		};

		const selectFacebookPage = (facebookPage: FacebookPage) => {
			store.dispatch(ActionTypes.FacebookPage, facebookPage)
		}

        return {
            store,
            router,
            menu,
            onLogin,
            onLogout,
            onGetLoginStatus,
            selectFacebookPage
        }
    }
})

</script>