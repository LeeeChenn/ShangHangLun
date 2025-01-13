export type Article = {
    status: boolean;
    type: number;
    num: number;
    pnum: number;
    ppnum?: number;
    isList?: number;
    text: string;
    text1?: string;
    style?: number;
    fang?: string[];
}

export type Formula = {
    index?: number;
    status: boolean;
    letter: string;
    name: string;
    Hname?: string;
    list: string[][];
    fa: string;
    zhu?: string;
}