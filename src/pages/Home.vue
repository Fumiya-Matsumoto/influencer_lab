<template>
    <facebook-login-form></facebook-login-form>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import FacebookLoginForm from "../components/FacebookLoginForm.vue";


export default defineComponent({
    name: "Home",
    components: {
        FacebookLoginForm
    }
})

</script>