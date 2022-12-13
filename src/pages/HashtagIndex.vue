<template>
    <v-container fluid>
        <base-title>
            ハッシュタグ一覧
            <template #subtext>DBに保存されているハッシュタグの一覧を表示しています。</template>
        </base-title>

        <v-row align="end">
            <v-col cols="4">
                <h2
                    class="text-body-1 font-weight-bold my-5"
                >
                    ジャンルと紐づくユーザーを選択
                </h2>
                <v-select
                    label="ユーザー"
                    v-model="selected_user_id"
                    :items="users"
                    item-title="username"
                    item-value="id"
                    density="compact"
                    hide-details="auto"
                >
                </v-select>
            </v-col>
            <v-col cols="3">
                <h2
                    class="text-body-1 font-weight-bold my-5"
                >
                    検索キーワード
                </h2>
                <v-text-field
                    label="キーワード"
                    v-model="q"
                    density="compact"
                    hide-details="auto"
                >
                </v-text-field>
            </v-col>
            <v-col cols="3">
                <h2
                    class="text-body-1 font-weight-bold my-5"
                >
                    1ページあたりの表示件数
                </h2>
                <v-text-field
                    label="件数"
                    v-model="page_size"
                    density="compact"
                    hide-details="auto"
                >
                </v-text-field>
            </v-col>
            <v-col cols="1">
                <v-btn
                    small
					color="success"
					class="mr-4"
					:loading="search_loading"
					@click="search"
                >
                検索
                </v-btn>
            </v-col>
        </v-row>
        <v-row align="end">
            <v-col>
                <h2
                    class="text-body-1 font-weight-bold my-5"
                >
                    ジャンル一括付与
                </h2>
                <v-select
                    label="ジャンル"
                    v-model="selected_instagram_genre"
                    :items="instagram_genres.filter((obj) => obj.user_id == selected_user_id)"
                    item-title="name"
                    item-value="value"
                    return-object
                    density="compact"
                    hide-details="auto"
                >
                </v-select>                
            </v-col>
            <v-col>
                <v-btn
                    color="success"
                    :loading="register_genre_loading"
                    @click="registerGenres"
                >
                    一括登録
                </v-btn>
            </v-col>
        </v-row>

        <v-table hover class="py-2">
            <thead>
                <tr>
                    <th>
                        <v-checkbox
                            v-model="isSelectAll"
                            @click="selectAllHashtags"
                            hide-details="auto"
                        > 
                        </v-checkbox>
                    </th>
                    <th class="text-left">
                        ハッシュタグ名
                    </th>
                    <th class="text-left">
                        投稿数
                    </th>
                    <th class="text-left">
                        ジャンル
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="instagram_hashtag in instagram_hashtags"
                    :key="instagram_hashtag.id"
                    @click="openModal(instagram_hashtag)"
                >
                    <td>
                        <v-checkbox
                            :value="instagram_hashtag"
                            v-model="selected_instagram_hashtags"
                            hide-details="auto"
                            @click.stop
                        >
                        </v-checkbox>
                    </td>
                    <td>{{ instagram_hashtag.name }}</td>
                    <td>{{ instagram_hashtag.media_count }}</td>
                    <td>
                        <v-chip-group>
                            <v-chip
                                v-for="genre in instagram_hashtag.instagram_genres.filter((obj) => obj.user_id == selected_user_id)"
                                :key="genre.id"
                            >
                                {{ genre.name }}
                            </v-chip>
                        </v-chip-group>
                        
                    </td>
                </tr>
            </tbody>
        </v-table>

        <v-dialog
            v-model="dialog"
            scrollable
        >
            <v-card>
                <v-card-title>{{ selected_instagram_hashtag?.name }}のジャンル一覧</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <div class="px-4">
                        <v-combobox
                            v-model="selected_instagram_genres"
                            :items="instagram_genres.filter((obj) => obj.user_id == selected_user_id)"
                            item-title="name"
                            chips
                            clearable
                            multiple
                            variant="underlined"
                        >
                            <template v-slot:selection="{ attrs, item, select, selected }">
                                <v-chip
                                    v-bind="attrs"
                                    :model-value="selected"
                                    closable
                                    @click="select"
                                    @click:close="remove(item)"
                                >
                                </v-chip>
                            </template>
                        </v-combobox>
                    </div>
                </v-card-text>
                
                <v-card-actions>
                    <v-btn
                        color="success"
                        variant="text"
                        :loading="update_genre_loading"
                        @click="updateGenres()"
                    >
                        Update
                    </v-btn>
                    <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="(dialog = false)"
                    >
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
import { defineComponent, onMounted, ref, watchEffect } from 'vue';
import axios from 'axios';

import BaseTitle from '../components/BaseTitle.vue';


type InstagramGenre = {
    id: string;
    name: string;
    user_id: string
}


type InstagramHashtag = {
    id: string;
    name: string;
    media_count: number;
    instagram_genres: InstagramGenre[];
}


type User = {
    id: string;
    company_id: string;
    name: string;
    username: string;
}


export default defineComponent({
    components: {
        BaseTitle
    },
    setup() {
        const instagram_hashtags = ref<InstagramHashtag[]>([]);
        const instagram_genres = ref<InstagramGenre[]>([]);

        // query
        const q = ref<string>('');
        const page = ref<number>(1);
        const page_size = ref<number>(25);

        const page_length = ref<number>(0);
        const hashtag_total_num = ref<number>(0);
        const previous_url = ref<string|null>();
        const next_url = ref<string|null>();

        const users = ref<User[]>([]);
        const selected_user_id = ref<string>('875b3c9e-cb54-4398-97e6-e5010610b960');
        const selected_instagram_hashtag = ref<InstagramHashtag>();
        const selected_instagram_hashtags = ref<InstagramHashtag[]>([]);
        const selected_instagram_genre = ref<InstagramGenre>();
        const selected_instagram_genres = ref<InstagramGenre[]>([])
        const not_selected_instagram_genres = ref<InstagramGenre[]>([])

        const dialog = ref(false);
        const search_loading = ref<boolean>(false);
        const register_genre_loading = ref<boolean>(false);
        const update_genre_loading = ref<boolean>(false);
        const isSelectAll = ref<boolean>(false);

        // methods
        const getHashtags = async (page_num?: number, page_size?: number, q?: string) => {
            await axios
                .get(
                    'https://influencer-lab-backend.herokuapp.com/instagram_hashtags',
                    {
                        params: {
                            page_num: page_num,
                            page_size: page_size,
                            q: q
                        }
                    }
                )
                .then(response => {
                    instagram_hashtags.value = response.data.data;
                    hashtag_total_num.value = response.data.total;
                    previous_url.value = response.data.pagenation.previous;
                    next_url.value = response.data.pagenation.next;
                })
        }

        const getGenres = async () => {
            await axios
                .get(
                    'https://influencer-lab-backend.herokuapp.com/instagram_genres',
                )
                .then(response => {
                    instagram_genres.value = response.data;
                })
        }

        const getUsers = async () => {
            await axios
                .get('http://influencer-lab-backend.herokuapp.com/users')
                .then(response => {
                    users.value = response.data
                })
        }

        const search = () => {
            page.value = 1
            getHashtags(page.value, page_size.value, q.value);
        }

        const pagination = () => {
            getHashtags(page.value, page_size.value);
        }

        const remove = (instagram_genre: any) => {
            instagram_genres.value.splice(instagram_genres.value.indexOf(instagram_genre), 1)
            instagram_genres.value = [...instagram_genres.value]
        }

        const openModal = (instagram_hashtag: InstagramHashtag) => {
            dialog.value = true
            selected_instagram_hashtag.value = instagram_hashtag
            selected_instagram_genres.value = instagram_hashtag.instagram_genres.filter((obj) => obj.user_id == selected_user_id.value)
            not_selected_instagram_genres.value = instagram_hashtag.instagram_genres.filter((obj) => obj.user_id != selected_user_id.value)
        }

        async function updateGenres() {
            update_genre_loading.value = true
            const add_instagram_genres = selected_instagram_genres.value.concat(not_selected_instagram_genres.value);
            console.log(add_instagram_genres.map((genre) => genre.id))
            if (selected_instagram_hashtag.value) {
                await axios
                .put(`https://influencer-lab-backend.herokuapp.com/instagram_hashtags/${selected_instagram_hashtag.value.id}`, {
                    name: selected_instagram_hashtag.value.name,
                    media_count: selected_instagram_hashtag.value.media_count,
                    instagram_genre_ids: add_instagram_genres.map((genre) => genre.id)
                })
                .then((res) => {
                    getHashtags(page.value, page_size.value, q.value)
                    selected_instagram_genres.value = []
                    not_selected_instagram_genres.value = []
                    console.log('OK');
                })
                .catch((err) => {
                    console.log(err);
                })
            }
            update_genre_loading.value = false
            dialog.value = false
        }

        const selectAllHashtags = () => {
            selected_instagram_hashtags.value = [];

            if (!isSelectAll.value) {
                selected_instagram_hashtags.value = instagram_hashtags.value
            }
        }

        async function registerGenres() {
            register_genre_loading.value = true
            await Promise.all(selected_instagram_hashtags.value.map(async (hashtag: InstagramHashtag) => {
                if (selected_instagram_genre.value) {
                    const add_instagram_genres = hashtag.instagram_genres

                    if (!hashtag.instagram_genres.map(genre => {return genre.id}).includes(selected_instagram_genre.value.id)) {
                        add_instagram_genres.push(selected_instagram_genre.value)
                    }
                    
                    await axios
                        .put(`https://influencer-lab-backend.herokuapp.com/instagram_hashtags/${hashtag.id}`, {
                            name: hashtag.name,
                            media_count: hashtag.media_count,
                            instagram_genre_ids: add_instagram_genres.map((genre) => genre.id)
                        })
                        .then((res) => {
                            getHashtags(page.value, page_size.value, q.value)
                            console.log('OK');
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
                return
            }))
            register_genre_loading.value = false;
        }

        // mouont
        onMounted(() => {
            getHashtags(page.value, page_size.value);
            getUsers();
            getGenres();
            page_length.value = Math.trunc( hashtag_total_num.value / page_size.value ) + 1;
        })

        // watchEffect
        watchEffect(() => {
            page_length.value = Math.trunc( hashtag_total_num.value / page_size.value ) + 1;
        })

        // 

        return {
            instagram_hashtags,
            instagram_genres,
            page,
            q,
            page_size,
            page_length,
            hashtag_total_num,
            previous_url,
            next_url,
            users,
            selected_user_id,
            selected_instagram_hashtag,
            selected_instagram_hashtags,
            selected_instagram_genre,
            selected_instagram_genres,
            not_selected_instagram_genres,
            search,
            pagination,
            remove,
            openModal,
            updateGenres,
            selectAllHashtags,
            registerGenres,
            dialog,
            search_loading,
            register_genre_loading,
            update_genre_loading,
            isSelectAll
        }
    }
})
</script>