import { defineConfig } from 'vite'
import path from "path";
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		}
	},
	css: {
    	preprocessorOptions: {
			scss: {
				additionalData: `@import "@/assets/scss/_variables.scss";`,
			}
		}
	},
  	server: {
    	host: true
 	}  
})
