import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Store {
  userEmail: string | null;
  randomColor: any;
  messages: [];
  isChatSelected: boolean;
  setUserEmail: (email: string) => void;
  setRandomColor: (color: string) => void;
  setMessages: (state: any) => void;
  setIsChatSelected: (state: boolean) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      userEmail: null,
      randomColor: {},
      messages: [],
      isChatSelected: false,
      setUserEmail: (email: string) => set({ userEmail: email }),
      setRandomColor: (color: string) => set({ randomColor: color }),
      setMessages: (state) => set({ messages: state }),
      setIsChatSelected: (state) => set({ isChatSelected: state }),
    }),
    {
      name: "userStorage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
