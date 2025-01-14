<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const message = ref('');

const show = (msg: string) => {
  message.value = msg;
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, 2000);
};

defineExpose({ show });
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform opacity-0"
      enter-to-class="transform opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform opacity-100"
      leave-to-class="transform opacity-0"
    >
      <div v-if="visible" 
           class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] px-4 py-2 bg-black/75 text-white rounded-lg text-sm">
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>