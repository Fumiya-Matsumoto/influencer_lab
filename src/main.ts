import { createApp } from 'vue'
import "@/assets/scss/style.scss"
import App from './App.vue'
import router from './router';
import { key, store } from './store/store';
// import axios from 'axios';


// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const vuetify = createVuetify({
  components,
  directives,
})


const app = createApp(App)


// axiosの設定
// app.config.globalProperties.$axios = axios.create({
//   baseURL: 'https://influencer-lab-backend.herokuapp.com/'
// })

app.use(router)
app.use(store, key)
app.use(vuetify)


app.mount('#app')
