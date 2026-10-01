<template>
  <PageTittle colorClass="text-info">Hellow world</PageTittle>
  <NuxtLink to="/about">About</NuxtLink>
  {{ localval }} {{ globalval }}
  <BButton
    @click="
      localval++;
      globalval++;
    "
    >Click</BButton
  >
  <p v-if="pending">Loading...</p>
  <ul v-else class="list-group">
    <li class="list-group-item" v-for="item in data?.fruits" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
const localval = ref(0);
const globalval = useState<number>("count", () => 0);

const { data, pending } = useLazyFetch("/api/hello");

useHead({
  title: "W^^W",
});
</script>
