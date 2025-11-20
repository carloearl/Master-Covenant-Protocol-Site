import React, { createContext, useContext, useReducer } from "react";
import { studioReducer } from "./reducer";
import { initialState } from "./initialState";

const StudioContext = createContext(null);

export function StudioProvider({ children }) {
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