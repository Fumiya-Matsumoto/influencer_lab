<template>
    <h1 class="text-h5 font-weight-bold">
        <slot></slot>
    </h1>
    <v-divider
        color="black"
        length="20px"
        thickness="3px"
        class="my-5"
    ></v-divider>
    <p class="text-body-2">
        <slot name="subtext"></slot>
    </p>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        
    },
})
</script>
