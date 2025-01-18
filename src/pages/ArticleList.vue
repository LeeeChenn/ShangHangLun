<script lang="ts" setup>
import { ref, type PropType, computed } from 'vue';
import Card from '@/components/Card.vue';
import { type Article } from '@/store/utils';
import { PageType } from './type';
import ArticleChapter from './ArticleChapter.vue';
import { useArticleStoreHook } from '@/store/modules/article';
import MainHeader from '@/components/MainHeader.vue';

const emit = defineEmits(['goto-page', 'search']);

const articles = computed<Article[]>(() => useArticleStoreHook().getArticles);
const list = computed<Article[]>(() => useArticleStoreHook().getList);
const currentPage = ref(0); // 0 list, 1 chapter
const chapterHeader = ref('');
const currentArticleIndex = ref(0);
const datas = ref<Article[]>([]);

const handleClick = (article: Article, index: number) => {
    if (article.isList === 1) return;
    currentPage.value = 1;
    currentArticleIndex.value = index;
    let ppnum = article.pnum === 0 ? undefined : article.pnum;
    datas.value = articles.value.filter(item => item.pnum === article.num && item.ppnum === ppnum);
    if (article.pnum !== 0) {
      chapterHeader.value = article.text;
    } else if (datas.value.length > 0 && datas.value[0].style === 0) {
      chapterHeader.value = datas.value[0].text;
      datas.value.shift();
    } else {
      chapterHeader.value = '';
    }
}

const prevArticle = () => {
  let prevIndex = -1;
  for (let i = currentArticleIndex.value - 1; i >= 0; i--) {
    if (list.value[i].isList !== 1) {
      prevIndex = i;
      break;
    }
  }
  if (prevIndex >= 0) {
    handleClick(list.value[prevIndex], prevIndex);
  }
}

const nextArticle = () => {
  let nextIndex = -1;
  for (let i = currentArticleIndex.value + 1; i < list.value.length; i++) {
    if (list.value[i].isList !== 1) {
      nextIndex = i;
      break;
    }
  }
  if (nextIndex >= 0) {
    handleClick(list.value[nextIndex], nextIndex);
  }
}

const activeTab = ref('原文');  
const handleTabClick = () => {
  emit('goto-page', PageType.FormulaList);
}

</script>

<template>
  <div>
    <Card v-show="currentPage === 0">
      <template #header>
        <MainHeader :activeTab="activeTab" :onTabClick="handleTabClick" :onSearch="() => emit('search')" />
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
    <ArticleChapter v-if="currentPage === 1" 
      :datas="datas" 
      :header="chapterHeader" 
      @back="currentPage = 0" 
      @prev="prevArticle" 
      @next="nextArticle" />
  </div>

  
</template>
