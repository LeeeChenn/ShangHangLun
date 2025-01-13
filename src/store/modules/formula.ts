import { defineStore } from 'pinia';
import { type Formula, store } from '../utils';

export const useFormulaStore = defineStore('formula', {
    state: () => ({
        formulas: [] as Formula[],
        formulaMap: new Map<string, Formula>(),
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
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        },
        getFormula(name: string): Formula | undefined {
            return this.formulaMap.get(name);
        }
    },
    getters: {
        getFormulas(): Formula[] {
            return this.formulas;
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