import AsyncStorage from "@react-native-async-storage/async-storage";
import { create, StateCreator } from "zustand";
import { persist, PersistStorage, StorageValue } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type ImmerStore<T> = StateCreator<T, [["zustand/immer", never]], []>;

interface CreateStoreParams<T> {
  creator: ImmerStore<T>;
  storageKey?: string; // AsyncStorage 키 (persist 사용 시에만)
}

const createJSONStorage = <T>(): PersistStorage<T> => ({
  getItem: async (name: string): Promise<StorageValue<T> | null> => {
    try {
      const value = await AsyncStorage.getItem(name);

      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Failed to get item with name: ${name}`, error);
      return null;
    }
  },
  setItem: async (name: string, value: StorageValue<T>): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set item with name: ${name}`, error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.error(`Failed to remove item with name: ${name}`, error);
    }
  },
});

export function createStore<T>(params: CreateStoreParams<T>) {
  const { creator, storageKey } = params;

  if (!storageKey) {
    return create<T>()(immer(creator));
  }

  return create<T>()(
    persist(immer(creator), {
      name: storageKey,
      storage: createJSONStorage<T>(),
    })
  );
}
