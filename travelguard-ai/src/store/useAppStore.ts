import { create } from 'zustand';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type AppState = {
  userLocation: Coordinates | null | undefined;
  setUserLocation: (location: Coordinates | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  userLocation: null,
  setUserLocation: (userLocation) => set({ userLocation }),
}));

