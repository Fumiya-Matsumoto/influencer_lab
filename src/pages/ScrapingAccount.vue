<template>
    <div>
        <p class="bg-blue-200 text-2xl p-4">スクレイピングアカウント</p>
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
    </div>
  </template>


<script lang="ts">
import { defineComponent,onMounted,ref } from 'vue';
import axios from 'axios';
import orderBy from 'lodash/orderBy';

type ScrapingAccount = {
    id: string;
    username: string;
    password: string;
    igsid: string|null;
    is_deleted: boolean;
}

export default defineComponent({
    setup() {
        // data
        const scraping_accounts = ref<ScrapingAccount[]>([]);

        // methods
        async function getScrapingAccounts() {
            await axios
                .get('http://localhost:5000/scraping_accounts')
                .then(response => scraping_accounts.value = orderBy(response.data, 'is_deleted'))
        }

        async function updateOperationStatus(scraping_account: ScrapingAccount) {
            await axios
                .put('http://localhost:5000/scraping_accounts/' + scraping_account.id, {
                    username: scraping_account.username,
                    password: scraping_account.password,
                    igsid: scraping_account.igsid,
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