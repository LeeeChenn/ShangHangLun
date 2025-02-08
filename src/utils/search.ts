import { Article, Formula } from '@/store/type';
import { useArticleStoreHook } from '@/store/modules/article';
import { useFormulaStoreHook } from '@/store/modules/formula';

export enum SearchType {
    Article = 0,
    Formula = 1,
}

export type MatchRange = {
    start: number;
    end: number;
    length: number;
}

// 分隔符
const OrSperator = '|'; // 或
const AndSperator = ' '; // 与 

const ChineseRegex = /[\p{Script=Han}]+/gu;
const NoChineseRegexS = '[^\\p{Script=Han}]*';

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

// 获取纯中文
const getChineseText = (text: string) => {
    return text.match(ChineseRegex)?.join('') || '';
}

// 获取匹配序号范围
const getMatchRanges = (text: string, keywords: string[][]) => {
    const ranges: MatchRange[] = [];
    for (const keyword of keywords) {
        for (const word of keyword) {
            const arr = word.split('');
            const s = arr.join(NoChineseRegexS);
            const rex = new RegExp(s, 'gu');
            const matches = text.match(rex);
            if (matches) {
                for (const match of matches) {
                    const start = text.indexOf(match);
                    const end = start + match.length;
                    ranges.push({ start, end, length: match.length });
                }
            }
        }
    }

    let chars = new Array(text.length).fill(0);
    for (const range of ranges) {
        for (let i = range.start; i < range.end; i++) {
            chars[i] = 1;
        }
    }

    const results: MatchRange[] = [];
    for (let i = 0; i < chars.length; i++) {
        if (chars[i] === 1) {
            let start = i;
            while (chars[i] === 1 && i < chars.length) {
                i++;
            }
            results.push({ start, end: i, length: i - start });
        }
    }

    return results;
}

// 填充关键词样式
export const fillText = (text: string, keywords: string[][]) => {
    let ranges = getMatchRanges(text, keywords);
    let result = text;

    console.log(text);
    for (let i = ranges.length - 1; i >= 0; i--) {
        const range = ranges[i];
        result = result.slice(0, range.start) + '<span class="red">' + result.slice(range.start, range.end) + '</span>' + result.slice(range.end);
    }
    return result;
}

// 关键词解析
export const parseKeywords = (query: string) => {
    let result = query.trim().replace(/\s*\|\s*/g, "|");  // 去除 | 前后的空格
    const andKeywords = result.split(AndSperator).filter(char => char.trim().length > 0);
    if (andKeywords.length === 0) {
        return []
    }
    const keywords = andKeywords.map(keyword => keyword.split(OrSperator).map(char => getChineseText(char)).filter(char => char.length > 0))
                        .filter(keyword => keyword.length > 0);
    return keywords;
}

// 根据查询条件搜索
export const searchByQuery = (query: string): SearchResult[] => {
    if (!query || query.trim().length === 0) {
        return []
    }

    const keywords = parseKeywords(query);
    if (keywords.length === 0) {
        return []
    }
    const articles = useArticleStoreHook().getPureArticles;
    const formulas = useFormulaStoreHook().formulas;
    const results: SearchResult[] = [];

    // 条文
    for (const article of articles) {
        let text = getChineseText(article.text);
        if (isMatch(keywords, text)) {
            results.push({ data: article, type: SearchType.Article });
        }
    }
    // 方剂
    for (const formula of formulas) {
        let text = formula.Hname || formula.name;
        formula.list.forEach(item => {
            text += ',' + item[0] + ',' + item[1] + ',' + item[2];
        })
        if (formula.fa) {
            text += ',' + getChineseText(formula.fa);
        }
        if (formula.zhu) {
            text += ',' + getChineseText(formula.zhu);
        }
        if (isMatch(keywords, text)) {
            results.push({ data: formula, type: SearchType.Formula });
        }
    }

    return results;
}