import { type Article, type Formula } from '@/store/utils';

export enum PageType {
    List = 0,
    Chapter = 1,
    FormulaList = 2,
    Formula = 3,
    Search = 4
}

export interface PageData {
    data: Article | Formula | null;
    index: number;
}