<script setup lang="ts">
import Card from '@/components/Card.vue';
import PageButton from '@/components/PageButton.vue';
import { type Formula } from '@/store/utils';
import FormulaUnit from './Formula.vue';
import { computed, type PropType } from 'vue';
import { useArticleStoreHook } from '@/store/modules/article';
import { formatText } from '@/utils/format';

const props = defineProps({
    data: {
        type: Object as PropType<Formula>,
        required: false
    }
});
const emit = defineEmits(['back', 'prev', 'next']);
const articleStore = useArticleStoreHook();
const fang = computed(() => {
    return props.data ? (props.data?.Hname || props.data.name) : '';
});
const articles = computed(() => articleStore.getListByFang(fang.value));

</script>

<template>
    <Card>
        <template #header>
            <div class="relative flex items-center justify-center w-full">
                <div
                    @click="emit('back')" 
                    class="absolute left-0 flex items-center text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer gap-1 p-1 rounded-lg"
                >
                    <span class="text-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                          </svg>
                    </span>
                </div>
                <h2 class="text-xl font-bold text-gray-800 px-2 font-serif tracking-wide">方剂详情</h2>
            </div>
        </template>
        <div class="fixed left-2 top-1/2 -translate-y-1/2">
            <PageButton @click="emit('prev')">←</PageButton>
        </div>
        <div class="fixed right-2 top-1/2 -translate-y-1/2">
            <PageButton @click="emit('next')">→</PageButton>
        </div>
        <FormulaUnit :fang="fang" :showHname="true" />
        <div v-for="(data, index) in articles" :key="index" 
             :class="'p-3 mb-2 bg-white ' + (data.ppnum && data.ppnum >= 21 ? '' : 'border-gray-300 border-b border-dashed')">
            <div v-html="formatText(data.text, data)" class="font-serif tracking-wide leading-relaxed"></div>
        </div>
    </Card>
</template>