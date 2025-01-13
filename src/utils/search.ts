import { Article, Formula } from '@/store/type';
import { useArticleStoreHook } from '@/store/modules/article';
import { useFormulaStoreHook } from '@/store/modules/formula';

export enum SearchType {
    Article = 0,
    Formula = 1,
}

// 分隔符
const OrSperator = '|'; // 或
const AndSperator = ' '; // 与 

const ChineseRegex = /[\u4e00-\u9fa5]+/g;

export type SearchResult = {
    data: Article | Formula;
    type: SearchType;
}

const isMatch = (keywords: string[][], text: string) => {
    let isMatch = true;
    for (const keyword of keywords) {
        isMatch = isMatch && keyword.some(keyword => text.includes(keyword));
        if (!isMatch) {
            break;
        }
    }
    return isMatch;
}

export const searchByQuery = (query: string): SearchResult[] => {
    if (!query || query.trim().length === 0) {
        return []
    }
    const andKeywords = query.split(AndSperator).filter(char => char.trim().length > 0);
    if (andKeywords.length === 0) {
        return []
    }
    const keywords = andKeywords.map(keyword => keyword.split(OrSperator).filter(char => char.trim().length > 0))
                        .filter(keyword => keyword.length > 0);
    if (keywords.length === 0) {
        return []
    }
    const articles = useArticleStoreHook().getPureArticles;
    const formulas = useFormulaStoreHook().formulas;
    const results: SearchResult[] = [];

    for (const article of articles) {
        let text = article.text.match(ChineseRegex)?.join('') || '';
        if (isMatch(keywords, text)) {
            results.push({ data: article, type: SearchType.Article });
        }
    }
    for (const formula of formulas) {
        let text = formula.Hname || formula.name;
        formula.list.forEach(item => {
            text += ',' + item[0] + ',' + item[1] + ',' + item[2];
        })
        if (formula.fa) {
            text += ',' + formula.fa.match(ChineseRegex)?.join('') || '';
        }
        if (formula.zhu) {
            text += ',' + formula.zhu.match(ChineseRegex)?.join('') || '';
        }
        if (isMatch(keywords, text)) {
            results.push({ data: formula, type: SearchType.Formula });
        }
    }

    return results;
}