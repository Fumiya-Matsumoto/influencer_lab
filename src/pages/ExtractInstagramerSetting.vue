<template>
    <v-container fluid>
        <v-alert 
            v-if="alert_flg == 'success'"
            type="success"
            class="mb-4"
        >ジャンルを登録しました</v-alert>
        <v-alert
            v-else-if="alert_flg == 'error'"
            type="error"
            class="mb-4"
        >ジャンルの登録に失敗しました</v-alert>

        <base-title>
            Instagramer抽出設定
            <template #subtext>Instagramer抽出の設定を行います。※インフルエンサーワークス、カラフルキャスティング用の場合、ユーザーは「all」を選択してください。</template>
        </base-title>

        <v-form
            :v-model="valid"
            class="py-3"
            ref="form"
        >
            <v-row>
                <v-col>
                    <v-select
                        label="ユーザー"
                        v-model="selected_service_id"
                        :items="all_services"
                        item-title="name"
                        item-value="id"
                        required
                    ></v-select>

                </v-col>
                <v-col>
                    <v-select
                        label="ジャンル"
                        v-model="selected_genre_name"
                        :items="genre_names"
                        item-title="name"
                        item-value="name"
                        requierd
                    ></v-select>
                </v-col>
            </v-row>

            <v-btn
                small
                color="success"
                class="mr-4"
                :loading="loading"
                @click="submit"
            >
                登録
            </v-btn>

        </v-form>

    </v-container>
</template>


<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import axios from 'axios';

import BaseTitle from '../components/BaseTitle.vue'

interface Genre {
	id: string
	name: string
	service_id: string
}


interface Service {
    id: string,
    company_id: string,
    name: string,
}


export default defineComponent({
    components: {
        BaseTitle
    },
    setup() {
        const genres = ref<Genre[]>();
        const selected_genre_name = ref<string>('');
        const all_services = ref<Service[]>();
        const selected_service_id = ref<string>('');
        const valid = ref<boolean>(true);
        const form = ref();
        const loading = ref<boolean>(false);
        const alert_flg = ref<string>('');


        // methods
        async function getInstagramerSetting() {
            await axios
                .get('https://influencer-lab-backend.herokuapp.com/extract_instagramer/setting')
                .then(response => {
                    selected_service_id.value = response.data.service.id;
                    all_services.value = response.data.all_services;
                    selected_genre_name.value = response.data.genre.name;
                    genres.value = response.data.all_genres;
                })
        }

        async function updateInstagramerSetting(service_id: string, genre_name: string) {
            loading.value = true;
            await axios
                .post('https://influencer-lab-backend.herokuapp.com/extract_instagramer/setting', {
                    service_id: service_id,
                    genre_name: genre_name
                })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                })
            loading.value = false;
        }

        const submit = async (event: any) => {
            const form_validation = await form.value.validate();
            console.log(form_validation);

            if (!form_validation.valid) {
                valid.value = false;
                event.preventDefault();
                alert_flg.value = 'error';
                return;
            } else {
                updateInstagramerSetting(selected_service_id.value, selected_genre_name.value);
                alert_flg.value = 'success';
            }
        }

        // computed
        const genre_names = computed(() => {
            if (selected_service_id && genres.value) {
                return Array.from(new Set(genres.value.filter((genre) => genre.service_id == selected_service_id.value)))
            }
        })

        onMounted(() => {
            getInstagramerSetting()
        })

        return {
            genres,
            genre_names,
            selected_genre_name,
            all_services,
            selected_service_id,
            valid,
            form,
            loading,
            alert_flg,
            submit,
        }
    }
})
</script>