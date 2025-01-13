<script lang="tsx" setup>
import { computed } from 'vue';
import { useFormulaStoreHook } from '@/store/modules/formula';
const props = defineProps({
    fang: {
        type: String,
        required: true
    },
    showHname: {
        type: Boolean,
        required: false,
        default: false
    }
});
const formulaStore = useFormulaStoreHook();
const formula = computed(() => formulaStore.getFormula(props.fang));

const formatText = (text: string) => {
    return text.split('\\n').map((line, index) => {
        return `<span key="${index}" class="block text-xs text-red-800 my-1">${line}</span>`
    }).join('');
}

</script>

<template>
    <div v-if="formula" class="bg-gray-100 border-t border-b border-black-500 my-4">
        <!-- 方剂名称 - 灰色背景 -->
        <div class="bg-gray-200 py-3 mb-4">
            <div class="text-base font-bold text-red-600 text-center">
                {{ showHname ? (formula.Hname || formula.name) : formula.name }}方
            </div>
        </div>

        <!-- 药材列表 -->
        <div class="px-6 mb-4">
            <div class="flex flex-wrap gap-x-3 gap-y-2 text-base leading-relaxed">
                <div v-for="(item, index) in formula.list" 
                     :key="index"
                     class="flex items-center text-red-600">
                    <span class="text-sm font-bold m-1">{{ item[0] }}</span>
                    <span class="text-xs">{{ item[1] }}</span>
                    <span class="text-xs">{{ item[2] ? '(' + item[2] + ')' : '' }}</span>
                </div>
            </div>
        </div>

        <!-- 服法 -->
        <div class="px-6 space-y-3 mb-4">
            <div class="text-blue-900 text-xs leading-relaxed">{{ formula.fa }}</div>
            
            <!-- 少阴篇（注意事项） -->
            <div v-if="formula.zhu" class="space-y-2">
                <!-- <div class="text-gray-900 leading-relaxed">{{ formatText(formula.zhu) }}</div> -->
                 <div v-html="formatText(formula.zhu)"></div>
            </div>
        </div>
    </div>
</template>