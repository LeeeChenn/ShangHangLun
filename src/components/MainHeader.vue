<script setup lang="ts">
import { ref } from 'vue';
import { generateZip } from '../utils/generator';

const props = defineProps<{
  activeTab: string,
  onTabClick: () => void,
  onSearch: () => void,
}>();

const tabs = ['原文', '方剂'];
const handleTabClick = (tab: string) => {
  if (props.activeTab === tab) return;
  props.onTabClick();
}

const onDownload = () => {
  generateZip();
}
</script>

<template>
    <div class="flex justify-between items-center px-2">
        <h2 class="text-base sm:text-lg md:text-xl font-bold text-gray-800 font-serif tracking-wide">{{activeTab === '原文' ? '桂林古本伤寒杂病论' : '汤方索引'}}</h2>
        <div class="flex items-center space-x-4">
          <span class="text-gray-600 cursor-pointer group relative" @click="onSearch">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 sm:size-5.5 md:size-6 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-500 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              搜索
            </span>
          </span>
          <span class="text-gray-600 cursor-pointer group relative" @click="onDownload">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 sm:size-5.5 md:size-6 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
            </svg>
            <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-500 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              下载全文(Obsidian)
            </span>
          </span>
          <div class="inline-flex rounded-lg border border-gray-200">
            <span
              v-for="(tab, index) in tabs"
              :key="tab"
              :class="[
                'px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer',
                index === 0 ? 'rounded-l-md' : '',
                index === tabs.length - 1 ? 'rounded-r-md' : '',
                activeTab === tab 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-blue-500 hover:bg-gray-50'
              ]"
              @click="handleTabClick(tab)"
            >
              {{ tab }}
            </span>
          </div>
        </div>
    </div>
</template>