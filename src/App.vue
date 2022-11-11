<template>
  <div>
    <p class="bg-blue-200 text-2xl p-4">Influencer Lab</p>
    <div class="container mx-auto mt-4">
      <select v-model="sender" class="select select-primary mb-4">
        <option disabled selected>DMを送信するアカウントは？</option>
        <option v-for="(scraping_account, idx) in scraping_accounts" :key="idx">{{ scraping_account.username }}</option>
      </select>
      <br>
      <label>送信数</label>
      <input v-model="num_sent" type="number" class="form-control mb-4">
      <button class="btn btn-primary" @click="sendDM">DM送信</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import axios from 'axios';

export default defineComponent({
  name: "App",
  components: {
  },
  setup() {
    // const scraping_accounts = ref([
    //   {'username': 'influencerworks_recruit8'},

    // ]);
    const scraping_accounts = ref();
    const sender = ref();
    const num_sent = ref<Number>(0);

    // methods
    const sendDM = () => {
      console.log('DMを送信しました');
    }
    async function getScrapingAccounts() {
      await axios
        .get('http://0.0.0.0:5000/scraping_accounts')
        .then(response => scraping_accounts.value = response.data);
    }
    onMounted(() => {
      getScrapingAccounts()
    });

    return {
      scraping_accounts,
      sender,
      num_sent,
      getScrapingAccounts,
      sendDM
    }
  }
});
</script>

<style></style>
