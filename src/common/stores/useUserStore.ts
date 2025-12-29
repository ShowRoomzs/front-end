import { createStore } from "@/common/stores/createStore";
import { User } from "@/features/user/types/user";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clear: () => void;
}

export const useUserStore = createStore<UserStore>({
  creator: set => ({
    user: null,
    setUser: user => set({ user }),
    clear: () => set({ user: null }),
  }),
});
