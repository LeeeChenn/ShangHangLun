import { defineStore } from 'pinia';
import { type Formula, store } from '../utils';

export const useFormulaStore = defineStore('formula', {
    state: () => ({
        formulas: [] as Formula[],
        formulaMap: new Map<string, Formula>(),
        letterMap: new Map<string, Formula[]>(),
        letters: [] as string[],
    }),
    actions: {
        async readFormula() {
            try {
                const response = await fetch('/formula.json');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                this.formulas = await response.json();
                this.formulas.forEach(formula => {
                    this.formulaMap.set(formula.Hname || formula.name, formula);
                });
                this.letterMap = new Map<string, Formula[]>();
                this.formulas.forEach((formula, index) => {
                    const letter = formula.letter;
                    if (!this.letterMap.has(letter)) {
                        this.letterMap.set(letter, []);
                    }
                    this.letterMap.get(letter)?.push({...formula, index});
                });
                this.letters = Array.from(this.letterMap.keys()).sort();
                console.log('letter map')
                console.log(this.letterMap)
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        },
        getFormula(name: string): Formula | undefined {
            return this.formulaMap.get(name);
        },
    },
    getters: {
        getFormulas(): Formula[] {
            return this.formulas;
        },
        getLetterMap(): Map<string, Formula[]> {
            return this.letterMap;
        },
        getLetters(): string[] {
            return this.letters;
        }
    }
})

let initialized = false;

export function useFormulaStoreHook() {
    const formulaStore = useFormulaStore(store);
    if (!initialized) {
        formulaStore.readFormula();
        initialized = true;
    }
    return formulaStore;
}