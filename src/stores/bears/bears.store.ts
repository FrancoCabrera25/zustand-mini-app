import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Bear {
    id: number;
    name: string;
}

interface BearState {
    blackBears: number;
    polarBears: number;
    pandaBears: number;

    bears: Bear[];

    // computed: {
    //     totalBears: number;
    // };

    increaseBlackBears: (by: number) => void;
    increasePolarBears: (by: number) => void;
    increasePandaBears: (by: number) => void;
    totalBears: () => number;

    doNothing: () => void;
    addBear: () => void;
    clearBears: () => void;
}

export const useBearStore = create<BearState>()(
    persist(
        (set, get) => ({
            blackBears: 10,
            polarBears: 5,
            pandaBears: 1,
            bears: [{ id: 1, name: 'Oso 1' }],

            // computed: {
            //     get totalBears() {
            //         return get().blackBears + get().pandaBears + get().polarBears + get().bears.length;
            //     },
            // },
            totalBears: () => {
                return get().blackBears + get().pandaBears + get().polarBears;
            },
            increaseBlackBears: (by: number) => set((state) => ({ blackBears: state.blackBears + by })),
            increasePolarBears: (by: number) => set((state) => ({ polarBears: state.polarBears + by })),
            increasePandaBears: (by: number) => set((state) => ({ pandaBears: state.pandaBears + by })),

            doNothing: () => set((state) => ({ bears: [...state.bears] })),
            addBear: () =>
                set((state) => ({
                    bears: [...state.bears, { id: state.bears.length + 1, name: `Oso ${state.bears.length + 1}` }],
                })),
            clearBears: () => set({ bears: [] }),
        }),
        {
            name: 'bears-store',
        }
    )
);
