import {create} from "zustand";
import {persist} from "zustand/middleware";
import type {StateCreator} from "zustand";


type InitialState = {
  appVersion: number;
  hasHydrated: boolean;
  selectedChainId: number;
};

type StoreMethods = {
  setHasHydrated: (hydrated: boolean) => void;
  setSelectedChainId: (chainId: number) => void;
};

const initialState: InitialState = {
  appVersion: 0,
  hasHydrated: false,
  selectedChainId: 0,
};

const reducer: StateCreator<InitialState & StoreMethods> = (set, get) => ({
  ...initialState,
  setHasHydrated: (hydrated: boolean) => set({hasHydrated: hydrated}),
  setSelectedChainId: (chainId: number) => set({selectedChainId: chainId}),
});

export const useStore = create(
  persist<InitialState & StoreMethods>(reducer, {
    name: "base-gas-tool",
    onRehydrateStorage: () => (state: any) => state?.setHasHydrated(true),
  })
);
