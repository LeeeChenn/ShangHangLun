<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue';
import { type Article, type Formula } from '@/store/utils';
import { PageType, type PageData } from './pages/type';
// Search
import Search from '@/components/Search.vue';
import SearchResultPage from './pages/SearchResult.vue';
import { searchByQuery, SearchResult } from '@/utils/search';
// Article
import ArticleList from './pages/ArticleList.vue';
import ArticleChapter from './pages/ArticleChapter.vue';
import { useArticleStoreHook } from '@/store/modules/article';
// Formula
import FormulaList from './pages/FormulaList.vue';
import FormulaDetail from './pages/FormulaDetail.vue';
import { useFormulaStoreHook } from '@/store/modules/formula';
const current = ref(PageType.List);
const prevs = ref<PageType[]>([]); 

const gotoPage = (page: number, data?: PageData) => {
  if (current.value === page) return;
  prevs.value.push(current.value)
  current.value = page;
  if (page === PageType.Chapter) {
    selectChapter(data!.data as Article, data!.index);
  } else if (page === PageType.Formula) {
    selectFormula(data!.data as Formula, data!.index);
  }
}

const back = () => {
  if (prevs.value.length > 0) {
    current.value = prevs.value.pop()!;
  } else {
    current.value = PageType.List;
  }
}

/**
 *  Articles
 **/
const articles = computed<Article[]>(() => useArticleStoreHook().getArticles);
const list = computed<Article[]>(() => useArticleStoreHook().getList);
const datas = ref<Article[]>([]);
const chapterHeader = ref('');
const currentArticleIndex = ref(0);

const selectChapter = (article: Article, index: number) => {
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
    selectChapter(list.value[prevIndex], prevIndex);
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
    selectChapter(list.value[nextIndex], nextIndex);
  }
}

/**
 * Formula
 **/
const formulas = computed<Formula[]>(() => useFormulaStoreHook().getFormulas);
const currentFormulaIndex = ref(0);
const selectFormula = (formula: Formula, index: number) => {
  let _ = formula
  currentFormulaIndex.value = index;
}

const prevFormula = () => {
  if (currentFormulaIndex.value > 0) {
    currentFormulaIndex.value--;
  }
}

const nextFormula = () => {
  if (currentFormulaIndex.value < formulas.value.length - 1) {
    currentFormulaIndex.value++;
  }
}

/**
 * Search
 **/
const showSearch = ref(false);
const searchResultPage = ref<InstanceType<typeof SearchResultPage>>();

const search = () => {
  showSearch.value = true;
}

const closeSearch = () => {
  showSearch.value = false;
}

const onSearch = (query: string) => {
  const results = searchByQuery(query);
  nextTick(() => {
    searchResultPage.value?.setData(query, results);
  });
  gotoPage(PageType.Search);
}

</script>

<template>
  <ArticleList 
    v-show="current === PageType.List" 
    :list="list" 
    @goto-page="gotoPage" 
    @search="search" />
  <ArticleChapter 
    v-if="current === PageType.Chapter" 
    :datas="datas" 
    :header="chapterHeader"
    @back="back" 
    @prev="prevArticle"
    @next="nextArticle"
    />
  <FormulaList 
    v-show="current === PageType.FormulaList" 
    :need-letter="true"
    @goto-page="gotoPage" 
    @search="search" />
  <FormulaDetail 
    v-if="current === PageType.Formula" 
    :data="formulas[currentFormulaIndex]"
    @back="back"
    @prev="prevFormula"
    @next="nextFormula"
    />

  <Search 
    :visible="showSearch" 
    :on-close="closeSearch" 
    :on-search="onSearch" />

  <SearchResultPage 
    ref="searchResultPage"
    v-show="current === PageType.Search" 
    @back="back" 
    @goto-page="gotoPage"
    @search="search" />

</template>


