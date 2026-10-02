<template>
  <nav class="d-flex justify-content-between align-items-center p-3 mb-3" :key="refreshKey">
    <NuxtLink to="/" class="btn btn-outline-primary">ToDo List</NuxtLink>
    <ul class="d-flex list-unstyled mb-0">
      <template v-if="!user" class="d-flex">
        <li class="list-inline-item">
          <NuxtLink to="/auth/register" class="btn btn-primary"> Регистрация </NuxtLink>
        </li>
        <li class="list-inline-item">
          <NuxtLink to="/auth/login" class="btn btn-primary"> Авторизация </NuxtLink>
        </li>
      </template>
      <template v-else class="d-flex">
        <li class="list-inline-item btn btn-primary" @click="logout">Выйти</li>
        <li class="list-inline-item">
          <NuxtLink to="/" class="btn btn-primary"> {{ user?.name }} </NuxtLink>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
const refreshKey = useState<number>("navRefreshKey", () => 0);

const { data: user } = await useAsyncData("navbar-user", verifyAuth, {
  watch: [refreshKey],
});

async function logout() {
  const token = useCookie("token");
  token.value = null;
  refreshKey.value++;
}
</script>
