import { defineStore } from 'pinia';
import { store } from '@/store';

const MAX_HISTORY_LENGTH = 20;

export const useHistoryStore = defineStore('history', {
    state: () => ({
        historys: [] as string[],
    }),
    actions: {
        addHistory(history: string) {
            this.historys.splice(0, 0, history);
            if (this.historys.length > MAX_HISTORY_LENGTH) {
                this.historys.pop();
            }
        },
        clearHistory() {
            this.historys.splice(0, this.historys.length);
        },
        removeHistory(index: number) {
            this.historys.splice(index, 1);
        }
    },
    getters: {
        getHistorys(): string[] {
            return this.historys;
        }
    },
    persist: true,
});

export function useHistoryStoreHook() {
    const historyStore = useHistoryStore(store);
    return historyStore;
}