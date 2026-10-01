<template>
  <h1>About</h1>
  {{ localval }} {{ globalval }}
</template>

<script lang="ts" setup>
const localval = ref(0);
const globalval = useState("count", () => 0);
</script>
