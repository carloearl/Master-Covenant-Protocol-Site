import React, { createContext, useContext, useReducer } from "react";
import { studioReducer } from "./reducer";
import { initialState } from "./initialState";
import { StudioAction } from "./actionTypes";

type StudioContextType = {
  state: typeof initialState;
  dispatch: React.Dispatch<StudioAction>;
};

const StudioContext = createContext<StudioContextType | null>(null);

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(studioReducer, initialState);

  return (
    <StudioContext.Provider value={{ state, dispatch }}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be inside <StudioProvider>");
  return ctx;
}