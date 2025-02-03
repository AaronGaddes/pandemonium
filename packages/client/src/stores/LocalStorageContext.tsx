import { createContext, useContext, type ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";

export type LocalStorageState = {
  authToken: string;
};

export type SetLocalLocalStorageItemFn = <K extends keyof LocalStorageState>(
  key: K,
  value: LocalStorageState[K]
) => void;

export type RemoveLocalLocalStorageItemFn = <K extends keyof LocalStorageState>(
  key: K
) => void;

export type LocalStorageValue = [
  state: LocalStorageState,
  actions: {
    setItem: SetLocalLocalStorageItemFn;
    removeItem: RemoveLocalLocalStorageItemFn;
  }
];

const defaultState = {
  authToken: localStorage.getItem("authToken") ?? "",
};

const LocalStorageContext = createContext<LocalStorageValue>([
  defaultState,
  {
    setItem: () => undefined,
    removeItem: () => undefined,
  },
]);

export const LocalStorageProvider: ParentComponent = (props) => {
  const [state, setState] = createStore<LocalStorageState>({
    ...defaultState,
  });

  const setItem: SetLocalLocalStorageItemFn = (key, value) => {
    console.log("setting item", key, value);
    localStorage.setItem(key, value);
    setState(key, value);
  };

  const removeItem: RemoveLocalLocalStorageItemFn = (key) => {
    localStorage.removeItem(key);
    setState(key, "");
  };

  return (
    <LocalStorageContext.Provider value={[state, { setItem, removeItem }]}>
      {props.children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorage = () => useContext(LocalStorageContext);
