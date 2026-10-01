<template>
  {{ id }}
</template>

<script lang="ts" setup>
const id = useRoute().params.id;

definePageMeta({
  layout: "profile",
});
</script>
