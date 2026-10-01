<template>
  <nav
    class="d-flex justify-content-between align-items-center p-3 bg-black mb-3"
    :key="refreshKey"
  >
    <NuxtLink to="/" class="btn btn-outline-primary">Website</NuxtLink>
    <ul class="d-flex list-unstyled mb-0">
      <li class="list-inline-item">
        <NuxtLink to="/about" class="btn btn-outline-primary"> About </NuxtLink>
      </li>
      <div v-if="!user" class="d-flex">
        <li class="list-inline-item">
          <NuxtLink to="/auth/register" class="btn btn-outline-primary"> Register </NuxtLink>
        </li>
        <li class="list-inline-item">
          <NuxtLink to="/auth/login" class="btn btn-outline-primary"> Login </NuxtLink>
        </li>
      </div>
      <div v-else class="d-flex">
        <li class="list-inline-item btn btn-outline-primary" @click="logout">Logout</li>
        <li class="list-inline-item">
          <NuxtLink to="/me" class="btn btn-outline-primary"> {{ user?.name }} </NuxtLink>
        </li>
      </div>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
const refreshKey = useState<number>("navRefreshKey", () => 0);

const { data: user } = await useAsyncData("navbar-user", verifyAuth, {
  watch: [refreshKey],
});

async function verifyAuth() {
  const token = useCookie("token");

  if (!token) {
    return;
  }

  const result = await $fetch("/api/auth/verifyToken", {
    method: "POST",
    body: { token: token.value },
    async onResponseError({ response }) {
      return;
    },
  });

  if (!result.success) {
    return;
  }

  return result.user;
}

async function logout() {
  useCookie("token").value = undefined;
  refreshKey.value++;
}
</script>
