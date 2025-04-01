import {create} from 'zustand';
import {devtools, persist, createJSONStorage} from 'zustand/middleware';

import {CanvasNodeStore, FunctionNode, GlobalCanvasInfo} from '@/shared/types';
import {parseHtmlFile} from '@shared/lib';

import {AppStore} from './types';

export const useAppStore = create<AppStore>()(
  devtools(
    persist<AppStore>(
      (set) => ({
        htmlNodes: [],
        mainCanvasNodes: [],
        functions: [],
        globalCanvasInfo: {main: undefined, functions: {}},

        createHtmlNodes: async (file: File) => {
          try {
            const htmlNodes = await parseHtmlFile(file);

            set({htmlNodes});
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            throw Error(err?.response?.data?.error);
          }
        },
        createFunction: (func: FunctionNode) => {
          set((state) => ({...state, functions: [...state.functions, func]}));
        },
        saveCanvasNodes: (mainCanvasNodes: CanvasNodeStore[]) => {
          set({mainCanvasNodes});
        },
        saveFunctionNodes: (functionNodes: CanvasNodeStore[], functionId: string) => {
          set((state) => {
            const functions = state.functions.map((f) => (f.id === functionId ? {...f, nodes: functionNodes} : f));
            return {...state, functions};
          });
        },
        saveGlobalCanvasInfo: (globalCanvasInfo: GlobalCanvasInfo | undefined) => {
          set((state) => ({...state, globalCanvasInfo: {...state.globalCanvasInfo, main: globalCanvasInfo}}));
        },
        saveGlobalCanvasInfoForFunction: (globalCanvasInfo: GlobalCanvasInfo | undefined, functionId: string) => {
          set((state) => ({
            ...state,
            globalCanvasInfo: {...state.globalCanvasInfo, functions: {...state.globalCanvasInfo.functions, [functionId]: globalCanvasInfo}},
          }));
        },
        resetStore: () => {
          set({htmlNodes: [], mainCanvasNodes: [], functions: [], globalCanvasInfo: undefined});
        },
      }),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
