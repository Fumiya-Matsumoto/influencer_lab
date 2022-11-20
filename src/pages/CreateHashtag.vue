<template>
    <div>
        <p class="bg-blue-200 text-2xl p-4">ハッシュタグ登録</p>
        <!-- <div class="grid gap-6 mb-6 md:grid-cols-2 p-4"> -->
        <!-- </div> -->
        <div class="px-4 pt-4">
          <p v-show="error_flag">サーバーとの通信にエラーが発生しています。</p>
          <div class="pb-4">
            <label for="hashtag_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">ハッシュタグ名</label>
            <input v-model='hashtag_name' type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          </div>
          <div class="pb-4">
            <label for="num_post" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">投稿数</label>
            <input v-model='media_count' type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          </div>
          <div class="flex items-start mb-6">
            <div class="flex items-center h-5">
              <input id="terms" type="checkbox" value="" class="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required>
            </div>
            <label for="terms" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ジャンルを紐付ける</label>
          </div>
          <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="createHashtag">登録</button>
        </div>
        <div class="px-4 pt-4">
          <p>登録したハッシュタグ</p>
          <ul>
            <li v-for="(hashtag, idx) in hashtags" :key="idx">{{ hashtag }}</li>
          </ul>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import axios from 'axios';

export default defineComponent({
  setup() {
    const hashtag_name = ref();
    const media_count = ref<number>();
    const error_flag = ref<boolean>(false);
    const hashtags = ref<string[]>([]);

    // methods
    async function createHashtag() {
      await axios
        .post('https://influencer-lab-backend.herokuapp.com/instagram_hashtags', {
          name: hashtag_name.value,
          media_count: media_count.value
        })
        .then((res) => {
          console.log(res);
          hashtags.value.unshift(res.data.name);
        })
        .catch((err) => {
          console.log(err);
          error_flag.value = true;
        });
    }
    onMounted(() => {
    });

    return {
      hashtag_name,
      media_count,
      error_flag,
      hashtags,
      createHashtag,
    }
  }
});
</script>
