import { defineStore } from 'pinia';
import { type Article, store } from '../utils';

export const useArticleStore = defineStore('article', {
    state: () => ({
        articles: [] as Article[],
    }),
    actions: {
        async readArticle() {
            try {
                const response = await fetch('./article.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                this.articles = await response.json();
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        },
        getListByFang(fang: string): Article[] {
            return this.articles.filter(item => item.fang && item.fang.includes(fang));
        }
    },
    getters: {
        getArticles(): Article[] {
            return this.articles;
        },
        getPureArticles(): Article[] {
            let pnums = [0];
            pnums = pnums.concat(this.articles.filter(item => item.isList === 1).map(item => item.num));
            return this.articles.filter(item => (!(pnums.includes(item.pnum) && item.ppnum === undefined) 
                && (item.ppnum && item.ppnum >= 5 && item.ppnum < 21)));
        },
        getList(): Article[] {
            let pnums = [0];
            pnums = pnums.concat(this.articles.filter(item => item.isList === 1).map(item => item.num));
            return this.articles.filter(item => pnums.includes(item.pnum) && item.ppnum === undefined);
        }
    }
});

let initialized = false;

export function useArticleStoreHook() {
    const articleStore = useArticleStore(store);
    if (!initialized) {
        articleStore.readArticle();
        initialized = true;
    }
    return articleStore;
}