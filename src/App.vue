<template>
  <v-app :theme="theme">
    <v-card>
      <v-layout>
        <v-app-bar>
          <template v-slot:prepend>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
          </template>

          <v-app-bar-title>InfluencerLab</v-app-bar-title>

          <v-spacer></v-spacer>

          <v-btn
            :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            @click="onClick"
          ></v-btn>
        </v-app-bar>

        <v-navigation-drawer>
          <v-list
            density="compact"
            nav
          >
            <v-list-item
              v-for="(nav_list, idx) in nav_lists"
              :key="idx"
              :to="nav_list.link"
            >
              <template v-slot:prepend>
                <v-icon :icon="nav_list.icon"></v-icon>
              </template>

              <v-list-item-content>
                <v-list-item-title v-text="nav_list.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-main class="h-screen">
          <router-view></router-view>
        </v-main>

      </v-layout>
    </v-card>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({

  setup() {
    const theme = ref('light')
    const nav_lists = [
      {
        name: 'ホーム',
        icon: 'mdi-view-dashboard',
        link: '/',
      },
      {
        name: 'スクレイピングアカウント',
        icon: 'mdi-account-multiple',
        link: '/scraping_accounts',
      },
      {
        name: 'ハッシュタグ登録',
        icon: 'mdi-pound-box-outline',
        link: '/hashtag/create',
      },
      {
        name: 'DM自動送信',
        icon: 'mdi-send',
        link: '/send_dm',
      }
    ]

    function onClick() {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    return {
      theme,
      nav_lists,
      onClick,
    }
  }
})


</script>

<style></style>
