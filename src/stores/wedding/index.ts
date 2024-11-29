import { create } from 'zustand';
import { createPersonSlice, PersonSlice } from './person.slice';
import { devtools, persist } from 'zustand/middleware';
import { createGuestSlice, GuestSlice } from './guest.slice';
import { createDateSlice, DateSlice } from './date.slice';
import { ConfirmationSlice, createConfirmationSlice } from './confirmation.slice';

type ShareState = PersonSlice & GuestSlice & DateSlice & ConfirmationSlice;

export const useWeddingBoundStore = create<ShareState>()(
  persist(
    devtools((...a) => ({
        ...createPersonSlice(...a),
        ...createGuestSlice(...a),
        ...createDateSlice(...a),
        ...createConfirmationSlice(...a),
    })), { name: 'wedding-store'}
)
  )
