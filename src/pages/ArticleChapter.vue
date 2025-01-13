<script lang="tsx" setup>
import Card from '@/components/Card.vue';
import { type PropType, ref, watch } from 'vue';
import { type Article } from '@/store/utils';
import Formula from './Formula.vue';
import PageButton from '@/components/PageButton.vue';
import { formatText } from '@/utils/format';
const props = defineProps({
    datas: {
        type: Array as PropType<Article[]>,
        required: true
    },
    header: {
        type: String,
        required: false,
        default: ''
    }
});
const emit = defineEmits(['back', 'prev', 'next']);

interface CardExpose {
  scrollToTop: () => void;
}
const cardRef = ref<CardExpose | null>(null);

watch(() => props.datas, () => {
    if (cardRef.value) {
        cardRef.value.scrollToTop();
    }
});
</script>

<template>
    <Card ref="cardRef">
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
                <h2 class="text-xl font-bold text-gray-800 px-2 font-serif tracking-wide">{{ header }}</h2>
            </div>
        </template>
        <div class="fixed left-2 top-1/2 -translate-y-1/2">
            <PageButton @click="emit('prev')">←</PageButton>
        </div>
        <div class="fixed right-2 top-1/2 -translate-y-1/2">
            <PageButton @click="emit('next')">→</PageButton>
        </div>
        <div v-for="(data, index) in datas" :key="index" 
             :class="'p-3 mb-2 bg-white ' + (data.ppnum && data.ppnum >= 21 ? '' : 'border-gray-300 border-b border-dashed')">
            <div v-html="formatText(data.text + (data.text1 ? ' ' + data.text1 : ''), data)" class="font-serif tracking-wide leading-relaxed"></div>
            <div 
                v-if="data.fang"
                v-for="(fang, index) in data.fang"
                :key="index"
                class="text-base text-gray-800"
            >
                <Formula :fang="fang" />
            </div>
        </div>
    </Card>
</template>

<style scoped>
.red {
    color: red;
}
</style>