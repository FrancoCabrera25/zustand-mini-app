import { create, StateCreator } from 'zustand';
import { AuthStatus } from '../../interfaces/auth-status.interface';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { devtools, persist } from 'zustand/middleware';

export interface AuthState {
    status: AuthStatus;
    token?: string;
    user?: User;

    loginUser: (email: string, password: string) => Promise<void>;
    checkAuthStatus: () => Promise<void>;
    logoutUser: () => void ;
}

const storeApi: StateCreator<AuthState> = (set) => ({
    status: 'unauthorized',
    token: undefined,
    user: undefined,

    loginUser: async (email: string, password: string) => {
        try {
            const { token, ...user } = await AuthService.login(email, password);

            set({ status: 'authorized', token, user });
        } catch (error) {
            set({ status: 'unauthorized', token: undefined, user: undefined });
        }
    },
    checkAuthStatus: async () => {
        try {
            const { token, ...user } = await AuthService.checkStatus();
            set({ status: 'authorized', token, user });
        } catch (error) {
            set({ status: 'unauthorized', token: undefined, user: undefined });
        }
    },
    logoutUser: () => {
        set({ status: 'unauthorized', token: undefined, user: undefined });
    }
});

export const useAuthStore = create<AuthState>()(devtools(persist(storeApi, { name: 'auth-store' })));
