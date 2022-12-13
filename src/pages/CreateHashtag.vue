<template>
	<v-container fluid>
		<base-title>
            ハッシュタグ登録
            <template #subtext>ハッシュタグを登録します。投稿数は必須ではありません。</template>
        </base-title>
		<v-form
		  :v-model="valid"
		  class="py-3"
		  ref="form"
		>
			<v-row v-for="hashtag in hashtagList" :key="hashtag.id">
				<v-col cols="5">
					<v-text-field
						label="ハッシュタグ名"
						v-model="hashtag.name"
						required
						:rules="[v => !!v || 'ハッシュタグ名は必須です', v => !dbRegisterdHashtagList?.includes(v)  || 'ハッシュタグ名は既に登録されています']"
					></v-text-field>
				</v-col>
				<v-col cols="2">
					<v-text-field
						label="投稿数"
						v-model="hashtag.media_count"
						suffix="件"
					></v-text-field>
				</v-col>
				<v-col cols="3">
					<v-select
						label="ジャンル名"
						v-model="hashtag.genre_id"
						:items="genreList"
						item-title="name"
						item-value="id"
					>
					</v-select>
				</v-col>
				<v-col cols="2">
					<v-btn 
						small 
						color="grey" 
						class="ma-2" 
						@click="removeInput(hashtag.id)"
					>
					<v-icon dark>mdi-minus</v-icon>
					</v-btn>
				</v-col>
		  	</v-row>

			<v-row justify="center">
				<v-btn
					small 
					color="grey" 
					class="ma-2" 
					@click="addInput()"
				>
				<v-icon dark>mdi-plus</v-icon>
				</v-btn>
			</v-row>

			<div class="mt-5">
				<v-btn
					small
					color="success"
					class="mr-4"
					:loading="loading"
					@click="submit"
				>
				登録
				</v-btn>

				<v-btn
					small
					color="error"
					@click="reset"
				>
				リセット
				</v-btn>
			</div>
		</v-form>
		

		<div class="px-4 pt-4">
			<p>登録したハッシュタグ</p>
			<ul>
				<li v-for="(hashtag, idx) in registerdHashtagList" :key="idx">{{ hashtag }}</li>
			</ul>
		</div>
	</v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import axios from 'axios';

import BaseTitle from '../components/BaseTitle.vue';

interface HashtagInput {
	id: number
	name: string
	media_count: number|null
	genre_id: string|null
}

interface Genre {
	id: string
	name: string
	user_id: string
}

interface Hashtag {
	id: string
	name: string
	media_count: number
}

export default defineComponent({
	components: {
		BaseTitle
	},
	setup() {
		const error_flag = ref<boolean>(false);
		const loading = ref<boolean>(false);
		const valid = ref<boolean>(true);
		const form = ref();
		const dbRegisterdHashtagList = ref<string[]>();
		const hashtagList = ref<HashtagInput[]>([
			{
				id: 0,
				name: '',
				media_count: null,
				genre_id: null
			}
		]);
		const registerdHashtagList = ref<string[]>([]);
		const genreList = ref<Genre[]>();

		// methods
		async function getHashtags() {
			await axios
				.get('https://influencer-lab-backend.herokuapp.com/instagram_hashtags/all')
				.then(response => dbRegisterdHashtagList.value = response.data.map((hashtag: Hashtag) => hashtag.name))
		};

		async function getGenres() {
			await axios
				.get('https://influencer-lab-backend.herokuapp.com/instagram_genres')
				.then(
					response => genreList.value = response.data.filter(function(genre: Genre){
						return genre.user_id === '875b3c9e-cb54-4398-97e6-e5010610b960'
					}) 
				)
		};

		async function createHashtag(name: string, media_count: number|null, genre_id: string|null) {
			await axios
				.post('https://influencer-lab-backend.herokuapp.com/instagram_hashtags', {
					name: name,
					media_count: media_count,
					instagram_genre_id: genre_id,
				})
				.then((res) => {
					console.log(res);
					registerdHashtagList.value.unshift(res.data.name);
				})
				.catch((err) => {
					console.log(err);
					error_flag.value = true;
				});
		};

		async function createHashtags() {
			loading.value = true;
			await Promise.all(hashtagList.value.map(async (hashtag, i) => {
				await createHashtag(hashtag.name, hashtag.media_count, hashtag.genre_id)
				return
			}))
			loading.value = false;
		};

		const addInput = () => {
			hashtagList.value.push(
				{
					id: hashtagList.value.length,
					name: '',
					media_count: null,
					genre_id: ''
				}
			)
		};

		const removeInput = (id: number) => {
			let inputList = hashtagList.value;
			inputList = inputList.filter((input) => { return input.id !== id;});
			hashtagList.value = makeNewInput(inputList);
		};

		const makeNewInput = (inputList: HashtagInput[]) => {
			let newInputList = [];
			for (let i = 0; i < inputList.length; i++) {
				newInputList.push({
					id: i,
					name: inputList[i].name,
					media_count: inputList[i].media_count,
					genre_id: inputList[i].genre_id
				});
			}
			return newInputList;
		}

		const submit = async (event: any) => {
			const form_validation = await form.value.validate();
			console.log(form_validation);

			if (!form_validation.valid) {
				valid.value = false
				event.preventDefault();
				return;
			} else {
				createHashtags();
				getHashtags();
			}
		}

		const reset = () => {
			form.value.reset();
		}

		onMounted(() => {
			getHashtags()
			getGenres()
		});

		return {
			error_flag,
			loading,
			valid,
			form,
			genreList,
			dbRegisterdHashtagList,
			hashtagList,
			registerdHashtagList,
			getHashtags,
			getGenres,
			createHashtag,
			createHashtags,
			addInput,
			removeInput,
			submit,
			reset
		}
	}
});
</script>
