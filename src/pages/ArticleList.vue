<script lang="ts" setup>
import { ref, type PropType } from 'vue';
import Card from '@/components/Card.vue';
import { type Article } from '@/store/utils';
import { PageType } from './type';

const emit = defineEmits(['goto-page', 'search']);
const props = defineProps({
    list: {
        type: Array as PropType<Article[]>,
        required: true
    }
})

const handleClick = (article: Article, index: number) => {
    if (article.isList === 1) return;
    console.log(article);
    emit('goto-page', PageType.Chapter, {data: article, index: index});
}

const activeTab = ref('原文');  
const tabs = ['原文', '方剂'];
const handleTabClick = (tab: string) => {
  if (activeTab.value === tab) return;
  emit('goto-page', PageType.FormulaList);
}

</script>

<template>
  <Card>
    <template #header>
      <div class="flex justify-between items-center px-2">
        <h2 class="text-xl font-bold text-gray-800 font-serif tracking-wide">桂林古本伤寒杂病论</h2>
        <div class="flex items-center space-x-4">
          <span class="text-gray-600 cursor-pointer" @click="emit('search')">
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
    <ul class="space-y-2 font-serif tracking-wide">
      <li v-for="(article, index) in list" 
          :key="index" 
          class="flex justify-between items-center p-2 transition-colors duration-200 border-b border-gray-200 cursor-pointer"
          @click="handleClick(article, index)">
        <span v-if="article.isList === 1" class="text-gray-800 font-medium bg-blue-50 w-full px-2 py-1 rounded cursor-default leading-relaxed">
          <span class="text-blue-600 mr-2">■</span>{{ article.text }}
        </span>
        <template v-else>
          <span class="flex items-center text-gray-700 leading-relaxed">
            <span class="text-blue-500 mr-2">🔖</span>
            {{ article.text }}
          </span>
          <span class="text-gray-400 text-lg">›</span>
        </template>
      </li>
    </ul>
  </Card>
  
</template>
