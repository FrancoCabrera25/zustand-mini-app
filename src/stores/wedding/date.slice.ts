import { StateCreator } from 'zustand';

export interface DateSlice {
    eventDate: number;

    eventYYYYMMDD: () => string;
    eventHHMM: () => string;

    setEventDate: (parcialDate: string) => void;
    setEventTime: (eventTime: string) => void;
}

export const createDateSlice: StateCreator<DateSlice> = (set, get) => ({
    eventDate: new Date().getTime(),

    eventYYYYMMDD: () => {
        return new Date(get().eventDate).toISOString().split('T')[0];
    },

    eventHHMM: () => {
        const hours = new Date(get().eventDate).getHours().toString().padStart(2, '0');
        const minutes = new Date(get().eventDate).getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    },

    setEventDate: (parcialDate: string) =>
        set((state) => {
            const date = new Date(parcialDate);

            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();

            const newDate = new Date(state.eventDate);
            newDate.setFullYear(year, month, day);

            return { eventDate: newDate.getTime() };
        }),

    setEventTime: (eventTime: string) => {
        set((state) => {
            const hours = parseInt(eventTime.split(':')[0]);
            const minutes = parseInt(eventTime.split(':')[1]);

            const newDate = new Date(state.eventDate);
            newDate.setHours(hours, minutes);

            return { eventDate: newDate.getTime() };
        });
    },
});
