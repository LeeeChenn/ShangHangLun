<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PageType } from './type';
import Card from '@/components/Card.vue'
import FormulaDetail from '@/pages/FormulaDetail.vue';
import { type Formula } from '@/store/utils';
import { useFormulaStoreHook } from '@/store/modules/formula';

const emit = defineEmits(['goto-page', 'search']);

const formulas = computed<Formula[]>(() => useFormulaStoreHook().getFormulas);
const storeHook = useFormulaStoreHook();
//
const currentPage = ref(0); // 0 方剂， 1 方剂详情
const formulaIndex = ref(0);

const activeTab = ref('方剂');  
const tabs = ['原文', '方剂'];
const handleTabClick = (tab: string) => {
  if (activeTab.value === tab) return;
  emit('goto-page', PageType.List);
}

const handleLetterHover = (letter: string) => {
  // 可以在这里添加高亮对应字母分组的逻辑
  const element = document.getElementById(`letter-${letter}`)
  if (element) {
    element.scrollIntoView({ block: 'start' })
  }
}

const handleFormulaClick = (formula: Formula) => {
  let index = formulas.value.findIndex(item => (item.Hname || item.name) === (formula.Hname || formula.name));
  currentPage.value = 1;
  formulaIndex.value = index;
}

/**
 * Detail
 **/
const prevFormula = () => {
  if (formulaIndex.value > 0) {
    formulaIndex.value--;
  }
}
const nextFormula = () => {
  if (formulaIndex.value < formulas.value.length - 1) {
    formulaIndex.value++;
  }
}

</script>

<template>
  <div>
    <Card v-show="currentPage === 0" :needLetter="true">
      <template #header>
          <div class="flex justify-between items-center px-2">
              <h2 class="text-xl font-bold text-gray-800 font-serif tracking-wide">汤方索引</h2>
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
          <template v-for="letter in storeHook.getLetters" :key="letter">
              <li 
                :id="`letter-${letter}`"
                class="flex justify-between items-center p-2 transition-colors duration-200 border-b border-gray-200">
                  <span class="text-gray-400 font-medium w-full px-2 py-1 rounded cursor-default leading-relaxed">
                      {{ letter }}
                  </span>
              </li>
              <li v-for="(formula, index) in storeHook.getLetterMap.get(letter)" :key="index" 
                class="flex justify-between items-center p-2 transition-colors duration-200 border-b border-gray-200 cursor-pointer"
                @click="handleFormulaClick(formula)"
              >
                  <span class="text-gray-800 font-medium w-full px-2 py-1 rounded leading-relaxed">
                      {{ formula.Hname || formula.name }}
                  </span>
                  <span class="text-gray-400 text-lg">›</span>
              </li>
          </template>
      </ul>
  
      <template #letter>
          <ul class="h-full flex flex-col justify-between rounded-gl">
              <li 
                v-for="letter in storeHook.getLetters" 
                :key="letter"
                class="text-center text-gray-500 hover:text-white hover:bg-blue-500 cursor-pointer text-xs px-2 py-1.5 rounded-lg transition-colors"
                @click="handleLetterHover(letter)"
              >
                {{ letter }}
              </li>
          </ul>
      </template>
    </Card>  
    <FormulaDetail v-if="currentPage === 1"
      :data="formulas[formulaIndex]" 
      @back="currentPage = 0"
      @prev="prevFormula"
      @next="nextFormula" />
  </div>
</template>
