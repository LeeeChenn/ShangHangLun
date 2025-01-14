<script setup lang="ts">
import { ref } from 'vue';

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
</script>

<template>
    <div class="flex justify-between items-center px-2">
        <h2 class="text-xl font-bold text-gray-800 font-serif tracking-wide">{{activeTab === '原文' ? '桂林古本伤寒杂病论' : '汤方索引'}}</h2>
        <div class="flex items-center space-x-4">
          <span class="text-gray-600 cursor-pointer" @click="onSearch">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </span>
          <div class="inline-flex rounded-lg border border-gray-200">
            <span
              v-for="(tab, index) in tabs"
              :key="tab"
              :class="[
                'px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer',
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