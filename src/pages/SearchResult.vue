<script setup lang="ts">
import { SearchResult, SearchType } from '@/utils/search';
import { ref, computed } from 'vue';
import { PageType } from './type';
import Card from '@/components/Card.vue';
import { type Formula, type Article } from '@/store/utils';
import { formatText } from '@/utils/format';
import { useFormulaStoreHook } from '@/store/modules/formula';

const emit = defineEmits(['back', 'search', 'goto-page']);
const allFormulas = computed<Formula[]>(() => useFormulaStoreHook().getFormulas);
const formulaIsExpanded = ref(true);
const formulas = ref<Formula[]>([]);
const articleIsExpanded = ref(true);
const articles = ref<Article[]>([]);
const query = ref<string>('');

const setData = (text: string, results: SearchResult[]) => {
    query.value = text;
    formulas.value = [];
    articles.value = [];
    formulaIsExpanded.value = true;
    articleIsExpanded.value = true;
    results.forEach(result => {
        if (result.type === SearchType.Formula) {
            formulas.value.push(result.data as Formula);
        } else {
            articles.value.push(result.data as Article);
        }
    });
}

const handleFormulaClick = (formula: Formula) => {
  let index = allFormulas.value.findIndex(item => (item.Hname || item.name) === (formula.Hname || formula.name));
  emit('goto-page', PageType.Formula, {data: formula, index: index});
}

defineExpose({
    setData
});
</script>

<template>
    <Card>
        <template #header>
            <div class="relative flex items-center justify-between w-full">
                <div class="flex items-center">
                    <div
                        @click="emit('back')" 
                        class="flex items-center text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer gap-1 p-1 rounded-lg"
                    >
                        <span class="text-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </span>
                    </div>
                    <span class="text-base font-bold text-gray-800 px-2 font-serif tracking-wide"><span class="text-blue-500">关键词：</span>{{ query }}</span>
                </div>
                <div>
                    <span class="text-gray-600 cursor-pointer" @click="emit('search')">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-400 hover:text-blue-500 cursor-pointer transition-colors">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </span>
                </div>
            </div>
        </template>

        <ul class="space-y-2 font-serif tracking-wide">
            <template v-if="formulas.length > 0">
                <li class="flex justify-between items-center p-2 transition-colors duration-200 border-b border-dashed border-gray-200 cursor-pointer"
                    @click="formulaIsExpanded = !formulaIsExpanded">
                    <span class="text-gray-400 font-medium w-full px-2 py-1 rounded leading-relaxed">
                        方剂
                    </span>
                    <span class="text-gray-400">
                        <svg :class="{'rotate-180': !formulaIsExpanded}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                    </span>
                </li>
                <li v-if="formulaIsExpanded" v-for="(formula, index) in formulas" :key="index" 
                    class="flex justify-between items-center p-2 transition-colors duration-200 border-b border-dashed border-gray-200 cursor-pointer"
                    @click="handleFormulaClick(formula)">
                    <span class="text-gray-800 font-medium w-full px-2 py-1 rounded leading-relaxed">
                        {{ formula.Hname || formula.name }}
                    </span>
                    <span class="text-gray-400 text-lg">›</span>
                </li>
            </template>
            <template v-if="articles.length > 0">
                <li class="flex justify-between items-center p-2 transition-colors duration-200 border-b border-dashed border-gray-200 cursor-pointer"
                    @click="articleIsExpanded = !articleIsExpanded">
                    <span class="text-gray-400 font-medium w-full px-2 py-1 rounded leading-relaxed">
                        条文
                    </span>
                    <span class="text-gray-400 text-lg">
                        <svg :class="{'rotate-180': !articleIsExpanded}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                    </span>
                </li>
                <div v-if="articleIsExpanded" v-for="(article, index) in articles" :key="index" class="p-3 mb-2 bg-white border-gray-300 border-b border-dashed">
                    <div v-html="formatText(article.text, article)" class="font-serif tracking-wide leading-relaxed"></div>
                </div>
            </template>
        </ul>
    </Card>
</template>
