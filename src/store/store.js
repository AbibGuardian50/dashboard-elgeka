// store.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isSuperAdmin: false
    }),
    actions: {
        setIsSuperAdmin(isSuperAdmin) {
            this.isSuperAdmin = isSuperAdmin;
        }
    }
});
