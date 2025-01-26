import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Store {
  userEmail: string | null;
  randomColor: any;
  messages: any[];
  isChatSelected: boolean;
  currentUsername: string | null;
  userStatus: string | null;
  requestedUser: string[];
  requests: any[];
  setUserEmail: (email: string) => void;
  setRandomColor: (color: string) => void;
  setMessages: (state: any) => void;
  setIsChatSelected: (state: boolean) => void;
  setCurrentUsername: (state: string) => void;
  setUserStatus: (state: string) => void;
  setRequestedUser: (email: string) => void;
  setRequests: (newRequests: any) => void;
  removeRequestedUser: (email: string) => void;
}

const initialState = {
  userEmail: null,
  randomColor: {},
  messages: [],
  isChatSelected: false,
  currentUsername: null,
  userStatus: null,
  requestedUser: [],
  requests: [],
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      ...initialState,
      setUserEmail: (email: string) => set({ userEmail: email }),
      setRandomColor: (color: string) => set({ randomColor: color }),
      setMessages: (state) => set({ messages: state }),
      setIsChatSelected: (state) => set({ isChatSelected: state }),
      setCurrentUsername: (state) => set({ currentUsername: state }),
      setUserStatus: (state) => set({ userStatus: state }),
      setRequestedUser: (email: string) =>
        set((state) => ({
          requestedUser: [...state.requestedUser, email],
        })),
      removeRequestedUser: (email: string) =>
        set((state) => ({
          requestedUser: state.requestedUser.filter((user) => user !== email),
        })),
      setRequests: (newRequests) => set({ requests: newRequests }),
    }),
    {
      name: "userStorage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
