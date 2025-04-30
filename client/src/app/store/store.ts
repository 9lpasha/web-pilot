import {create} from 'zustand';
import {devtools, persist, createJSONStorage} from 'zustand/middleware';

import {CanvasNodeStore, FunctionStore, GlobalCanvasInfo, VariableStore} from '@/shared/types';
import {parseHtmlFile} from '@shared/lib';

import {AppStore} from './types';

export const useAppStore = create<AppStore>()(
  devtools(
    persist<AppStore>(
      (set) => ({
        htmlNodes: [],
        mainCanvasNodes: [],
        functions: {},
        globalCanvasInfo: {main: undefined, functions: {}},
        htmlContent: '',

        createHtmlNodes: async (file: File) => {
          try {
            const htmlNodes = await parseHtmlFile(file, set);

            set({htmlNodes});
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            throw Error(err?.response?.data?.error);
          }
        },
        createFunction: (func: FunctionStore) => {
          set((state) => ({...state, functions: {...state.functions, [func.id]: func}}));
        },
        saveCanvasNodes: (mainCanvasNodes: CanvasNodeStore[]) => {
          set({mainCanvasNodes});
        },
        saveFunctionNodes: (nodes: CanvasNodeStore[], functionId: string) => {
          set((state) => {
            return {...state, functions: {...state.functions, [functionId]: {...state.functions[functionId], nodes}}};
          });
        },
        saveFunctionVariables: (variables: VariableStore[], functionId: string) => {
          set((state) => {
            return {...state, functions: {...state.functions, [functionId]: {...state.functions[functionId], variables}}};
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
          set({htmlNodes: [], mainCanvasNodes: [], functions: {}, globalCanvasInfo: undefined});
        },
      }),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);
