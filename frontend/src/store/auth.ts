import { create } from 'zustand';
import http from '../api/http';

type Role = 'USER' | 'ADMIN';

type UserInfo = {
    userId: number;
    username: string;
    fullName?: string;
    role: Role;
};

type AuthState = {
    token: string | null;
    user: UserInfo | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (data: { username: string; password: string; fullName?: string }) => Promise<void>;
    logout: () => void;
    restore: () => void;
};

const storageKey = 'cafe_auth';

const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,

    restore: () => {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
            const parsed = JSON.parse(raw) as { token: string; user: UserInfo };
            set({ token: parsed.token, user: parsed.user, isAuthenticated: true });
        }
    },

    login: async (username, password) => {
        const res = await http.post('/auth/login', { username, password });
        const { token, userId, username: name, fullName, role } = res.data as any;
        const user: UserInfo = { userId, username: name, fullName, role };
        localStorage.setItem(storageKey, JSON.stringify({ token, user }));
        set({ token, user, isAuthenticated: true });
    },

    register: async (data) => {
        const res = await http.post('/auth/register', data);
        const { token, userId, username: name, fullName, role } = res.data as any;
        const user: UserInfo = { userId, username: name, fullName, role };
        localStorage.setItem(storageKey, JSON.stringify({ token, user }));
        set({ token, user, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem(storageKey);
        set({ token: null, user: null, isAuthenticated: false });
    }
}));

// Initialize from storage immediately
useAuthStore.getState().restore();

export default useAuthStore;


