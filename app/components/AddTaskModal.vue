<template>
  <BModal v-model="show" :title="isUpdate ? 'Обновить задачу' : 'Новая задача'" centered no-footer>
    <BForm @submit.prevent="onSubmit">
      <BFormGroup
        label="Текст задачи"
        label-for="task-text"
        :state="textState"
        invalid-feedback="Введите текст задачи"
      >
        <BFormTextarea
          id="task-text"
          v-model="textModal"
          rows="3"
          placeholder="Что нужно сделать?"
          :state="textState"
        />
      </BFormGroup>

      <BAlert v-if="serverError" variant="danger" :model-value="true" class="mb-3">
        {{ serverError }}
      </BAlert>

      <div class="d-flex justify-content-end gap-2 mt-2">
        <BButton variant="secondary" @click="show = false"> Отмена </BButton>
        <BButton type="submit" variant="primary" :disabled="isSubmitting">
          {{ isUpdate ? "Обновить" : "Сохранить" }}
        </BButton>
      </div>
    </BForm>
  </BModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  userId: number | undefined;
  task?: Task | null;
}>();

const emit = defineEmits<{
  created: []; // сообщаем родителю, что задача создана
}>();

// Двусторонняя привязка к родительскому showModal
const show = defineModel<boolean>("show", { default: false });

//локальные переменные
const textModal = ref("");
const isSubmitting = ref(false);
const serverError = ref<string | null>(null);
const submitted = ref(false);

const isUpdate = computed(() => !!props.task);

// Сбрасываем форму каждый раз при открытии
watch(show, (val) => {
  if (val) {
    textModal.value = props.task?.text ?? "";
    serverError.value = null;
    submitted.value = false;
    isSubmitting.value = false;
  }
});

const textState = computed<boolean | null>(() => {
  if (!submitted.value && !textModal.value) return null;
  return textModal.value.trim().length > 0;
});

async function onSubmit() {
  submitted.value = true;
  serverError.value = null;

  if (!textModal.value.trim()) return;
  if (!props.userId) {
    serverError.value = "Пользователь не авторизован";
    return;
  }

  isSubmitting.value = true;

  try {
    if (isUpdate.value && props.task) {
      await $fetch(`/api/task/${props.task.id}`, {
        method: "PUT",
        body: {
          text: textModal.value.trim(),
          userId: props.userId,
        },
      });
    } else {
      await $fetch("/api/task/task", {
        method: "POST",
        body: { text: textModal.value.trim(), userId: props.userId },
      });
    }

    emit("created");
    show.value = false;
  } catch (err: any) {
    serverError.value = err?.data?.message || err?.message || "Не удалось создать задачу";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
