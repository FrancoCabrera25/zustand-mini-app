import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { customSessionStorage } from '../storages/session-storage';
import { customFirebaseSessionStorage } from '../storages/firebase-storage';
import { logger } from '../middlewares/logger.middlewares';

interface PersonStore {
    firstName: string;
    lastName: string;
}

interface Actions {
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
}

const storeApi: StateCreator<PersonStore & Actions, [['zustand/devtools', unknown]]> = (set) => ({
    firstName: '',
    lastName: '',

    setFirstName: (value: string) => set((state) => ({ firstName: value }), false, 'setFirstName'),
    setLastName: (value: string) => set((state) => ({ lastName: value }), false, 'setLastName'),
});

export const usePersonStore = create<PersonStore & Actions>()(
    logger(
        devtools(
            persist(
                storeApi,

                {
                    name: 'personStore',

                    //storage: customSessionStorage
                    storage: customFirebaseSessionStorage,
                }
            )
        )
    )
);

usePersonStore.subscribe((nextState, prevState) => {
    console.log(nextState, prevState);
});
