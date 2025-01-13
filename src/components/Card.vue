<script setup lang="ts">
import { onMounted, onUnmounted, ref, onUpdated, onBeforeUnmount } from 'vue';
defineSlots<{
  header?: () => any;
  default: () => any;
  letter?: () => any;
}>();

const props = defineProps({
  needLetter: {
    type: Boolean,
    default: false
  }
})

let scrollTimer: NodeJS.Timeout | null = null;
const contentRef = ref<HTMLElement | null>(null);

const scrollToTop = () => {
  if (contentRef.value) {
    contentRef.value.scrollTo(0, 0);
  }
};

const updateLetterPosition = () => {
  if (contentRef.value) {
    const rect = contentRef.value.getBoundingClientRect()
    document.documentElement.style.setProperty('--content-top', `${rect.top - 33}px`)
    document.documentElement.style.setProperty('--content-height', `${rect.height}px`)
  }
}

onMounted(() => {
  // const content = document.querySelector('.content');
  const content = contentRef.value
  if (!content) return;
  content.addEventListener('scroll', () => {
    content.classList.remove('scrollbar-hide');
    if (scrollTimer) clearTimeout(scrollTimer);
    
    scrollTimer = setTimeout(() => {
      content.classList.add('scrollbar-hide');
    }, 2000); 
  });

  updateLetterPosition()
  if (props.needLetter) {
    window.addEventListener('resize', updateLetterPosition)
  }
});

onUpdated(() => {
  if (props.needLetter) {
    updateLetterPosition()
  }
})

onBeforeUnmount(() => {
  if (props.needLetter) {
    window.removeEventListener('resize', updateLetterPosition)
  }
})

onUnmounted(() => {
  if (scrollTimer) clearTimeout(scrollTimer);
});

defineExpose({
  scrollToTop
})
</script>

<template>
    <div class="w-full mx-auto my-4 flex flex-col bg-white rounded-xl shadow-lg relative
      border border-gray-200 hover:shadow-xl transition-shadow duration-300 max-h-[calc(100vh-64px)] h-fit">
        <div v-if="$slots.header" class="p-4 sm:p-6 border-b border-gray-200">
          <slot name="header"></slot>
        </div>
        <div ref="contentRef" class="content flex-1 p-4 sm:p-6 overflow-y-auto hover:scrollbar-default"
        :class="[
          $slots.letter 
            ? 'p-4 pr-4 mr-10 sm:p-6 sm:pr-4' 
            : 'p-4 sm:p-6 scrollbar-hide'
          ]"
        >
          <div class="content-inner">
            <slot></slot>
          </div>
        </div>
        <div v-if="$slots.letter" class="absolute right-0 top-[var(--content-top)] h-[var(--content-height)] w-9 border-l border-gray-200 bg-white rounded-r-xl">
          <slot name="letter"></slot>
        </div>
      </div>
</template>

<style scoped>
/* 基础滚动条样式 */
.content::-webkit-scrollbar {
  width: 8px;               /* 滚动条宽度 */
}

.content::-webkit-scrollbar-track {
  background: #f1f1f1;      /* 轨道背景色 */
  border-radius: 4px;       /* 轨道圆角 */
}

.content::-webkit-scrollbar-thumb {
  background: #c1c1c1;      /* 滑块颜色 */
  border-radius: 4px;       /* 滑块圆角 */
  transition: background 0.2s ease;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;      /* 滑块悬停颜色 */
}

/* Firefox 滚动条样式 */
.content {
  scrollbar-width: thin;    /* 'thin' 或 'auto' */
  scrollbar-color: #c1c1c1 transparent;  /* 滑块颜色 轨道颜色 */
}

/* 保持原有的隐藏滚动条功能 */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-color: transparent transparent;  /* 滑块颜色 轨道颜色 */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>