<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h1 class="card-title h3 mb-4 text-center">Register</h1>

            <form @submit.prevent="onSubmit">
              <!-- Поле Name -->
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  name="name"
                  class="form-control"
                  placeholder="Введите имя"
                />
              </div>

              <!-- Поле Password -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  name="password"
                  class="form-control"
                  placeholder="Введите пароль"
                />
              </div>

              <!-- Кнопка -->
              <div class="d-grid mb-3">
                <button type="submit" class="btn btn-primary">Submit</button>
              </div>

              <p v-if="error">{{ error }}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const error = ref<string | null>(null);
import { reactive } from "vue";

const form = reactive({
  name: "",
  password: "",
});

async function onSubmit() {
  error.value = null;

  const result = await $fetch.raw("/api/auth/register", {
    method: "POST",
    body: form,
    async onResponseError({ response }) {
      error.value = response._data.message;
      return;
    },
  });

  await navigateTo("/auth/login");
}
</script>
