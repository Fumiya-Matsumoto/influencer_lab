<template>
    <v-container fluid>
        <base-title>
            スクレイピングアカウント稼働状況
            <template #subtext>Instagramer抽出に使うスクレイピング用アカウントの稼働状況を確認・変更するページです。</template>
        </base-title>
        <div>
            <v-table>
                <thead>
                    <tr>
                    <th class="text-left">
                        ユーザー名
                    </th>
                    <th class="text-left">
                        稼働状況
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="scraping_account in scraping_accounts"
                        :key="scraping_account.id"
                    >
                    <td>{{ scraping_account.username }}</td>
                    <td v-if="scraping_account.is_deleted" >
                        <v-btn
                            rounded="lg"
                            color="error"
                            class="font-weight-bold"
                            @click="updateOperationStatus(scraping_account)"
                        >停止中
                        </v-btn>
                    </td>
                    <td v-else >
                        <v-btn
                            @click="updateOperationStatus(scraping_account)"
                            rounded="lg"
                            color="success"
                            class="font-weight-bold"
                        >稼働中
                        </v-btn>
                    </td>
                    </tr>
                </tbody>
            </v-table>
        </div>  
    </v-container>
  </template>


<script lang="ts">
import { defineComponent,onMounted,ref } from 'vue';
import axios from 'axios';
import _ from 'lodash';

import BaseTitle from '../components/BaseTitle.vue';


type ScrapingAccount = {
    id: string;
    username: string;
    password: string;
    igsid: string|null;
    is_deleted: boolean;
}

export default defineComponent({
    components: {
        BaseTitle
    },
    setup() {
        // data
        const scraping_accounts = ref<ScrapingAccount[]>([]);

        // methods
        async function getScrapingAccounts() {
            await axios
                .get('https://influencer-lab-backend.herokuapp.com/scraping_accounts')
                .then(response => scraping_accounts.value = _.orderBy(response.data, 'is_deleted'))
        }

        async function updateOperationStatus(scraping_account: ScrapingAccount) {
            await axios
                .put('https://influencer-lab-backend.herokuapp.com/scraping_accounts/' + scraping_account.id, {
                    username: scraping_account.username,
                    password: scraping_account.password,
                    is_deleted: !scraping_account.is_deleted,
                })
                .then(res => {
                    console.log(res)
                    getScrapingAccounts()
                })
                .catch(err => {
                    console.log(err);
                })
        }

        // mount
        onMounted(() => {
            getScrapingAccounts()
        });

        return {
            scraping_accounts,
            getScrapingAccounts,
            updateOperationStatus,
        }
    }

})
</script>