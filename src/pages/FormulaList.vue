<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { PageType } from './type';
import Card from '@/components/Card.vue'
import FormulaDetail from '@/pages/FormulaDetail.vue';
import { type Formula } from '@/store/utils';
import { useFormulaStoreHook } from '@/store/modules/formula';
import MainHeader from '@/components/MainHeader.vue';

const emit = defineEmits(['goto-page', 'search']);

const formulas = computed<Formula[]>(() => useFormulaStoreHook().getFormulas);
const storeHook = useFormulaStoreHook();
//
const currentPage = ref(0); // 0 方剂， 1 方剂详情
const formulaIndex = ref(0);

const handleLetterHover = (letter: string) => {
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

const activeTab = ref('方剂');  
const handleTabClick = () => {
  emit('goto-page', PageType.List);
}

</script>

<template>
  <div>
    <Card v-show="currentPage === 0" :needLetter="true">
      <template #header>
        <MainHeader :activeTab="activeTab" :onTabClick="handleTabClick" :onSearch="() => emit('search')" />
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
