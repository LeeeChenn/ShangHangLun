<script lang="ts" setup>
import { ref, nextTick, getCurrentInstance } from 'vue';
import { PageType } from './pages/type';
import { type Article } from '@/store/utils';
// Search
import Search from '@/components/Search.vue';
import SearchResultPage from './pages/SearchResult.vue';
import { searchByQuery } from '@/utils/search';
// Article
import ArticleList from './pages/ArticleList.vue';
// Formula
import FormulaList from './pages/FormulaList.vue';

const current = ref(PageType.List);
const prevs = ref<PageType[]>([]); 
const { proxy } = getCurrentInstance()!;

const gotoPage = (page: number) => {
  if (current.value === page) return;
  prevs.value.push(current.value)
  current.value = page;
}

const back = () => {
  if (prevs.value.length > 0) {
    current.value = prevs.value.pop()!;
  } else {
    current.value = PageType.List;
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

const onSearch = (query: string): boolean => {
  const results = searchByQuery(query);
  if (results.length === 0) {
    proxy?.$toast.show('未找到相关内容');
    return false;
  }
  nextTick(() => {
    searchResultPage.value?.setData(query, results);
  });
  gotoPage(PageType.Search);
  return true;
}

const articleListRef = ref<{ openArticleFromSearch: (a: Article) => void } | null>(null);

const onOpenArticleFromSearch = (article: Article) => {
  gotoPage(PageType.List);
  nextTick(() => {
    articleListRef.value?.openArticleFromSearch(article);
  });
};

</script>

<template>
  <div>
    <ArticleList 
    ref="articleListRef"
    v-show="current === PageType.List" 
    @goto-page="gotoPage" 
    @back="back"
    @search="search" />

  <FormulaList 
    v-show="current === PageType.FormulaList" 
    @goto-page="gotoPage" 
    @search="search" />

  <Search 
    :visible="showSearch" 
    :on-close="closeSearch" 
    :on-search="onSearch" />

  <SearchResultPage 
    ref="searchResultPage"
    v-show="current === PageType.Search" 
    @back="back" 
    @goto-page="gotoPage"
    @open-article="onOpenArticleFromSearch"
    @search="search" />
  </div>
</template>


