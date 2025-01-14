<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { useHistoryStoreHook } from '@/store/modules/history';

const props = defineProps<{
  visible: boolean,
  onClose: () => void,
  onSearch: (query: string) => boolean,
}>();

const searchQuery = ref('');
const searchHistory = useHistoryStoreHook().getHistorys;

// 监听 visible 变化，当显示时自动聚焦
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    nextTick(() => {
      document.querySelector<HTMLInputElement>('.search-input')?.focus();
    });
  }
});

const selectHistory = (query: string) => {
  searchQuery.value = query;
  handleSearch();
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) return;
  const result = props.onSearch(searchQuery.value);
  if (!result) return;
  if (searchHistory.includes(searchQuery.value)) {
    useHistoryStoreHook().removeHistory(searchHistory.indexOf(searchQuery.value));
  }
  useHistoryStoreHook().addHistory(searchQuery.value);
  searchQuery.value = '';
  props.onClose(); // 搜索后关闭对话框
}

const handleBackdropClick = (event: MouseEvent) => {
  // 确保点击的是背景层而不是内容区
  if ((event.target as HTMLElement).classList.contains('backdrop')) {
    props.onClose();
  }
}

const removeHistory = (index: number) => {
  useHistoryStoreHook().removeHistory(index);
}

const clearHistory = () => {
  useHistoryStoreHook().clearHistory();
}

const clickExample = (query: string) => {
  searchQuery.value = query;
  document.querySelector<HTMLInputElement>('.search-input')?.focus();
}

</script>

<template>
  <Teleport to="body" v-if="visible">
    <div class="fixed inset-0 bg-black/25 flex items-start justify-center z-50 backdrop"
      @click="handleBackdropClick">
      <div class="bg-white w-[600px] mr-1 ml-1 rounded-lg shadow-xl mt-[6vh]" @click.stop>
        <!-- 搜索框 -->
        <div class="p-4"
          :class="{ 'border-b border-gray-100': searchHistory.length > 0 }"
        >
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              class="search-input w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="搜索..."
              @keyup.enter="handleSearch"
            >
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-3 size-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <div class="mt-2 text-sm text-gray-500">
            <span class="mr-1">搜索语法：</span>
            <span class="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">空格</span>
            <span class="mx-1">表示且，</span>
            <span class="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">|</span>
            <span class="ml-1">表示或。</span>
            <div class="mt-1.5 text-gray-500">
              <span class="mr-1">搜索示例：</span>
              <span class="px-1.5 py-0.5 bg-blue-100 rounded text-gray-700 font-mono cursor-pointer" @click="clickExample('桂枝 甘草')">桂枝 甘草</span>
              <span class="mx-1">，</span>
              <span class="px-1.5 py-0.5 bg-blue-100 rounded text-gray-700 font-mono cursor-pointer" @click="clickExample('干姜|生姜 甘草')">干姜|生姜 甘草</span>
            </div>
          </div>
        </div>

        <!-- 搜索历史 -->
        <div v-if="searchHistory.length > 0" class="p-3">
          <div class="flex justify-between items-center px-2 py-1">
            <span class="text-sm text-gray-500">搜索历史</span>
            <span>
              <button 
                @click="clearHistory"
                class="text-sm text-red-500 hover:text-red-600 transition-colors mr-2">
                清空
              </button>
            </span>
            
          </div>
          <ul class="mt-1 max-h-[320px] overflow-y-auto custom-scrollbar">
            <li v-for="(item, index) in searchHistory" 
                :key="index"
                @click="selectHistory(item)"
                class="flex justify-between items-center px-3 py-2 hover:bg-gray-50 rounded-md cursor-pointer group active:bg-gray-100">
              <span class="text-gray-700">{{ item }}</span>
              <button 
                @click.stop="removeHistory(index)" 
                class="text-gray-400 hover:text-gray-600 transition-colors md:invisible md:group-hover:visible">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Teleport>

</template>

<style scoped>
.custom-scrollbar {
  /* 滚动条整体 */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  /* 滚动条轨道 */
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    background-color: #E5E7EB;
    border-radius: 2px;
    
    &:hover {
      background-color: #D1D5DB;
    }
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #E5E7EB transparent;
}

/* 当鼠标悬停在容器上时才显示滚动条 */
.custom-scrollbar {
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
  
  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: #E5E7EB;
    }
  }
}
</style>