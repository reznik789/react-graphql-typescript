import * as React from "react";
import { Viewer } from "../../lib/types";
import {
  Action,
  Dispatch,
  State,
  ViewerActionTypes,
  ViewerProviderProps,
} from "./types";

const ViewerStateContext = React.createContext<{ viewer: Viewer } | undefined>(
  undefined
);

const ViewerDispatchContext = React.createContext<
  { dispatch: Dispatch<Viewer>, } | undefined
>(undefined);

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const viewerReducer = (state: State, action: Action<Viewer>) => {
  switch (action.type) {
    case ViewerActionTypes.SetViewer: {
      return { viewer: action.payload || initialViewer };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

export const ViewerProvider = ({ children }: ViewerProviderProps) => {
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action<Viewer>>>(viewerReducer, {
    viewer: initialViewer,
  });
  return (
    <ViewerStateContext.Provider value={{ ...state }}>
      <ViewerDispatchContext.Provider value={{ dispatch }}>
        {children}
      </ViewerDispatchContext.Provider>
    </ViewerStateContext.Provider>
  );
};

export const useViewerState = () => {
  const context = React.useContext<{viewer: Viewer} | undefined>(ViewerStateContext);
  if (context === undefined) {
    throw new Error("useViewerState must be used within a ViewerProvider");
  }
  return context;
};

export const useViewerDispatch = () => {
  const context = React.useContext<{dispatch: Dispatch<Viewer>} | undefined>(ViewerDispatchContext);
  if (context === undefined) {
    throw new Error("useViewerDispatch must be used within a ViewerProvider");
  }
  return context;
};
