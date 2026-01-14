import { create } from 'zustand';

interface DrawSettingsState {
  color: string;
  strokeWidth: number;
  isEraser: boolean; 
  clearCanvasSignal: number;
  setColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setIsEraser: (isEraser: boolean) => void; 
  triggerClearCanvas: () => void;
}

export const useDrawSettingsStore = create<DrawSettingsState>((set) => ({
  color: '#000000', 
  strokeWidth: 4,  
  isEraser: false,
  clearCanvasSignal: 0,
  setColor: (color) => set({ color }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  setIsEraser: (isEraser) => set({ isEraser }),
  triggerClearCanvas: () => set((state) => ({ clearCanvasSignal: state.clearCanvasSignal + 1 })),
}));