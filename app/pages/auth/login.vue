<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <BCard class="shadow-sm">
          <template #header>
            <h1 class="h3 mb-0 text-center">Авторизация</h1>
          </template>
          <BForm @submit="onSubmit" novalidate>
            <BFormGroup
              label="Email"
              label-for="input-email"
              :state="emailState"
              invalid-feedback="Введите корректный email"
              class="mb-2"
            >
              <BFormInput
                id="input-email"
                v-model="email"
                type="email"
                name="email"
                placeholder="Введите email"
                :state="emailState"
                autocomplete="email"
              />
            </BFormGroup>

            <BFormGroup
              label="Password"
              label-for="input-password"
              :state="passwordState"
              invalid-feedback="Пароль должен быть не короче 6 символов"
            >
              <BFormInput
                id="input-password"
                v-model="password"
                type="password"
                name="password"
                placeholder="Введите пароль"
                :state="passwordState"
                autocomplete="new-password"
                class="mb-2"
              />
            </BFormGroup>

            <BAlert v-if="serverError" variant="danger" :model-value="true">
              {{ serverError }}
            </BAlert>

            <div class="d-grid mt-3">
              <BButton type="submit" variant="primary" :disabled="isSubmitting">
                <span
                  v-if="isSubmitting"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                {{ isSubmitting ? "Отправка..." : "Отправить" }}
              </BButton>
            </div>
          </BForm>
        </BCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { loginSchema } from "#shared/validation/auth";

const refreshKey = useState<number>("navRefreshKey", () => 0);

const serverError = ref<string | null>(null);
const submitted = ref(false);

const { handleSubmit, errors, defineField, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

// defineField создаёт реактивное поле + валидацию
const [email] = defineField("email");
const [password] = defineField("password");

const emailState = computed<boolean | null>(() => {
  if (!submitted.value && !email.value) return null;
  return !errors.value.email;
});

const passwordState = computed<boolean | null>(() => {
  if (!submitted.value && !password.value) return null;
  return !errors.value.password;
});

const onSubmit = handleSubmit(
  async (values) => {
    serverError.value = null;
    try {
      const result = await $fetch.raw("/api/auth/login", {
        method: "POST",
        body: values,
      });

      useCookie("token").value = result._data?.token;
      refreshKey.value++;
      await navigateTo("/");
    } catch (err: any) {
      serverError.value = err?.data?.message || err?.message || "Ошибка авторизации";
    }
  },
  ({ errors: validationErrors }) => {
    submitted.value = true;
  },
);
</script>
