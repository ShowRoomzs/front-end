import { createStore } from "./createStore";
import { User } from "../types/User";

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
