<template>
  <div class="fs-1" :class="props.colorClass">
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface PageTitleProperties {
  colorClass?: string;
}

const props = withDefaults(defineProps<PageTitleProperties>(), {
  colorClass: "text-danger",
});
</script>
