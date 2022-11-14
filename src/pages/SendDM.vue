<template>
    <div>
        <p class="bg-blue-200 text-2xl p-4">DM自動送信</p>
        <div class="px-4 pt-4">
          <p v-show="error_flag">サーバーとの通信にエラーが発生しています。</p>
          <div class="pb-4">
            <label for="sender" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">DM送信アカウント</label>
            <select v-model='sender' type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option disabled selected>DMを送信するアカウントは？</option>
                <option v-for="(send_dm_param, idx) in send_dm_params" :key="idx">{{ send_dm_param.name }}</option>
            </select>
          </div>
          <div v-if="sender" class="pb-4">
            <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">メッセージ</label>
            <select v-model='message' type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option disabled selected>送信するメッセージは？</option>
                <option v-for="(message, idx) in messages" :key="idx" :value="message">メッセージ{{ idx+1 }}</option>
            </select>
            <p class="pt-2">{{ message }}</p>
          </div>
          <div class="pb-4">
            <label for="max_count" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">配信数</label>
            <input v-model='max_count' type="number" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          </div>
          <button class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" @click="sendDM">送信</button>
        </div>
        <div class="px-4 pt-4">
          <p>DM受信アカウント</p>
          <ul>
            <li v-for="(receiver, idx) in receivers" :key="idx">{{ receiver }}</li>
          </ul>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import axios from "axios";

interface SendDMParam {
    name: string
    password: string
    messages: string[]
}

export default defineComponent({
    setup() {
        // data
        const sender = ref<string>();
        const password = ref<string>();
        const send_dm_params = ref<any>();
        const message = ref<string>();
        const messages = ref<string[]>();
        const max_count = ref<number>();
        const receivers = ref<string[]>();
        const sent_count = ref<number>();
        const error_flag = ref<boolean>(false);

        // methods
        async function getSendDMParams() {
            await axios
                .get('https://influencer-lab-backend.herokuapp.com/send_dm_params')
                .then(response => send_dm_params.value = response.data.senders)
        }

        async function sendDM() {
            await axios
                .post('https://influencer-lab-backend.herokuapp.com/send_dm', {
                    ScrapingAccountUsername: sender.value,
                    Password: password.value,
                    Message: message.value,
                    MaxCount: max_count.value
                })
                .then((res) => {
                    console.log(res);
                    receivers.value = res.data.receiver_list;
                    sent_count.value = res.data.sent_count;
                })
                .catch((err) => {
                    console.log(err);
                    error_flag.value = true;
                })
            
        }

        // mount
        onMounted(() => {
            getSendDMParams()
        });

        // watch
        watch(sender, () => {
            if (typeof send_dm_params != "undefined") {
                messages.value = send_dm_params.value.find((send_dm_param: { name: string | undefined; }) => send_dm_param.name == sender.value).messages;
                password.value = send_dm_params.value.find((send_dm_param: { name: string | undefined; }) => send_dm_param.name == sender.value).password;
            } 
        })

        return {
            send_dm_params,
            sender,
            messages,
            message,
            password,
            max_count,
            receivers,
            sent_count,
            error_flag,
            sendDM,
            getSendDMParams,
        }
    }
})
</script>