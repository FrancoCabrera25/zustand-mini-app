/* eslint-disable no-useless-catch */

import { createJSONStorage, StateStorage } from 'zustand/middleware';

const firebaseUrl = 'https://zustand-storage-a859d-default-rtdb.firebaseio.com/zustand';

const firebaseStorageApi: StateStorage = {
    getItem: async function (name: string): Promise<string | null> {
        try {
            const data = await fetch(`${firebaseUrl}/${name}.json`).then((res) => res.json());
            console.log('firebase', data);
            return JSON.stringify(data);
        } catch (error) {
            throw error;
        }
    },
    setItem: async function (name: string, value: string): Promise<void> {
         await fetch(`${firebaseUrl}/${name}.json`,{
            method: "PUT",
            body: value,
        }).then((res) => res.json());

        return;
    },
    removeItem: function (name: string): void | Promise<void> {
        sessionStorage.removeItem(name);
    },
};

export const customFirebaseSessionStorage = createJSONStorage(() => firebaseStorageApi);
