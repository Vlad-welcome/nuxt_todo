<template>
  <h1 class="text-center mb-md-4">Главная страница</h1>
  <div class="container py-4">
    <div class="d-flex align-items-center gap-3">
      <h3>Мои задачи</h3>
      <BButton v-if="userId" variant="outline-success" size="sm" @click="openAdd">
        Добавить
      </BButton>
    </div>

    <p v-if="!tasks.length" class="text-muted">Нет заданий</p>

    <BAlert v-else-if="error" variant="danger" :model-value="true">
      Не удалось загрузить задачи: {{ error.message }}
    </BAlert>

    <ul v-else class="list-group">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span class="text-break" style="min-width: 0">{{ task.text }}</span>
        <div class="flex-shrink-0 ms-2 d-flex align-items-center gap-2">
          <BFormCheckbox
            style="cursor: pointer"
            :model-value="task.completed"
            switch
            @update:model-value="completedTask(task)"
          ></BFormCheckbox>
          <BButton
            variant="outline-info"
            size="sm"
            :disabled="updatingId === task.id"
            @click="updateTask(task)"
          >
            Обновить
          </BButton>
          <BButton
            variant="outline-danger"
            size="sm"
            :disabled="deletingId === task.id"
            @click="removeTask(task.id)"
          >
            Удалить
          </BButton>
        </div>
      </li>
    </ul>

    <!-- Модалка добавления/обновления -->
    <AddTaskModal
      v-model:show="showModal"
      :user-id="userId"
      :task="editingTask"
      @created="refresh"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Task } from "~~/shared/types/task";

const { data: user } = await useAsyncData("navbar-user", verifyAuth);
const userId = computed(() => user.value?.id);

const { data, error, refresh } = await useFetch<{ tasks: Task[] }>("/api/task/tasks", {
  query: { userId },
  immediate: false,
});

watch(
  userId,
  (id) => {
    if (id) {
      refresh();
    } else {
      // Пользователь вышел
      data.value = { tasks: [] };
    }
  },
  { immediate: true },
);

const tasks = computed<Task[]>(() => data.value?.tasks ?? []);
const deletingId = ref<number | null>(null);
const updatingId = ref<number | null>(null);

const showModal = ref(false);
const editingTask = ref<Task | null>(null);

async function removeTask(id: number) {
  if (!confirm("Удалить задачу?")) return;
  deletingId.value = id;

  try {
    await $fetch(`/api/task/${id}`, { method: "DELETE" });
    await refresh();
  } catch (err: any) {
    alert(err?.data?.message || "Не удалось удалить задачу");
  } finally {
    deletingId.value = null;
  }
}

function openAdd() {
  editingTask.value = null;
  showModal.value = true;
}

function updateTask(task: Task) {
  editingTask.value = { ...task };
  showModal.value = true;
}

async function completedTask(task: Task) {
  try {
    await $fetch(`/api/task/completed/${task.id}`, {
      method: "PUT",
      body: {
        completed: !task.completed,
      },
    });
    await refresh();
  } catch (err: any) {
    alert(err?.data?.message || "Не удалось обновить задачу");
  }
}

useHead({
  title: "Todo-list",
});
</script>
