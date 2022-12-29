<template>
    <v-container>
        <base-title>
            Instagramリード一覧
            <template #subtext>DBに保存されているInstagramリードの一覧を表示しています。</template>
        </base-title>

        <v-table
            hover
            fixed-header
            height="500px"
            class="py-4"
        >
            <thead>
                <tr>
                    <th>
                        <v-checkbox
                            v-model="isSelectAll"
                            @click="selectAllInstagramLeads"
                            hide-details="auto"
                        > 
                        </v-checkbox>
                    </th>
                    <th class="text-left">
                        Instagramer名
                    </th>
                    <th class="text-left">
                        フォロワー数
                    </th>
                    <th class="text-left">
                        フォロー数
                    </th>
                    <th class="text-left">
                        DM送付済み
                    </th>
                    <th class="text-left">
                        確約済み
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="instagram_lead in instagram_leads"
                    :key="instagram_lead.id"
                >
                    <td>
                        <v-checkbox
                            :value="instagram_lead"
                            v-model="selected_instagram_leads"
                            hide-details="auto"
                            @click.stop
                        >
                        </v-checkbox>
                    </td>
                    <td>{{ instagram_lead.instagramer.username }}</td>
                    <td>{{ instagram_lead.instagramer.followers_count }}</td>
                    <td>{{ instagram_lead.instagramer.follows_count }}</td>
                    <td>
                        <v-checkbox
                            v-model="instagram_lead.dm_is_sent"
                            hide-details="auto"
                            @click.stop="updateDMIsSent(instagram_lead)"
                        ></v-checkbox>
                    </td>
                    <td>
                        <v-checkbox
                            v-model="instagram_lead.conversion"
                            hide-details="auto"
                            @click.stop="updateConversation(instagram_lead)"
                        ></v-checkbox>
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-content>
            <div class="my-5">
                <v-pagination
                    v-model="page"
                    :length="page_length"
                    @click="pagination"
                >
                </v-pagination>
            </div>
        </v-content>
        
    </v-container>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted, watchEffect } from "vue";
import { store } from '../store/store';
import axios from "axios";

import BaseTitle from "../components/BaseTitle.vue";


type Instagramer = {
    id: string;
    business_account_id: string;
    username: string;
    name: string;
    biography: string;
    followers_count: number;
    follows_count: number;
    media_count: number;
    profile_picture_url: string;
    website: string;
    is_business_account: boolean
    sex: string;
}

type InstagramLead = {
    id: string;
    instagramer_id: string;
    user_id: string;
    status_id: string;
    dm_is_sent: boolean;
    dm_is_replied: boolean;
    conversion: boolean;
    instagramer: Instagramer
}

export default defineComponent({
    components: {
        BaseTitle
    },
    setup() {
        const instagram_leads = ref<InstagramLead[]>([]);
        const user_id = ref('5dbca154-51a4-45f6-a63a-152dd3c1f6a7')

        // page_info
        const lead_total_num = ref<number>(0);
        const page_length = ref<number>(0);
        const page = ref<number>(1);
        const page_size = ref<number>(25);
        
        // url
        const previous_url = ref<string|null>();
        const next_url = ref<string|null>();

        const isSelectAll = ref<boolean>(false);
        const selected_instagram_leads = ref<InstagramLead[]>([]);
        

        // methods
        const getInstagramLeads = async (page_num: number, page_size: number, user_id: string) => {
            await axios
            .get(
                'https://influencer-lab-backend.herokuapp.com/instagram_leads',
                {
                    params: {
                        page_num: page_num,
                        page_size: page_size,
                        user_id: user_id
                    }
                }
            )
            .then(response => {
                instagram_leads.value = response.data.data;
                lead_total_num.value = response.data.total;
                previous_url.value = response.data.pagenation.previous;
                next_url.value = response.data.pagenation.next;
            })
        }

        const pagination = () => {
            getInstagramLeads(page.value, page_size.value, user_id.value)
        }

        const selectAllInstagramLeads = () => {
            selected_instagram_leads.value = [];

            if (!isSelectAll.value) {
                selected_instagram_leads.value = instagram_leads.value
            }
        }

        const updateDMIsSent = async(instagram_lead: InstagramLead) => {
            await axios
                .put(`https://influencer-lab-backend.herokuapp.com/instagram_leads/${instagram_lead.id}`, {
                        status_id: instagram_lead.status_id,
                        dm_is_sent: !instagram_lead.dm_is_sent,
                        dm_is_replied: instagram_lead.dm_is_replied,
                        conversion: instagram_lead.conversion
                    })
                    .then((res) => {
                        // getInstagramLeads(page.value, page_size.value, user_id.value)
                        console.log('OK');
                    })
                    .catch((err) => {
                        console.log(err);
                    })
        }

        const updateConversation = async(instagram_lead: InstagramLead) => {
            await axios
                .put(`https://influencer-lab-backend.herokuapp.com/instagram_leads/${instagram_lead.id}`, {
                        status_id: instagram_lead.status_id,
                        dm_is_sent: instagram_lead.dm_is_sent,
                        dm_is_replied: instagram_lead.dm_is_replied,
                        conversion: !instagram_lead.conversion
                    })
                    .then((res) => {
                        // getInstagramLeads(page.value, page_size.value, user_id.value)
                        console.log('OK');
                    })
                    .catch((err) => {
                        console.log(err);
                    })
        }

        // mouont
        onMounted(() => {
            getInstagramLeads(page.value, page_size.value, user_id.value);
            page_length.value = Math.trunc( lead_total_num.value / page_size.value ) + 1;
        })

        // watchEffect
        watchEffect(() => {
            page_length.value = Math.trunc( lead_total_num.value / page_size.value ) + 1;
        })


        return {
            instagram_leads,
            selected_instagram_leads,
            isSelectAll,
            page,
            page_length,
            selectAllInstagramLeads,
            pagination,
            updateDMIsSent,
            updateConversation,
        }
    }
})
</script>


<style lang="scss" scoped>
thead tr th{
    background: lightgrey !important;
}

</style>