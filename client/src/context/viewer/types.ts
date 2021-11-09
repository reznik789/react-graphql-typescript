import { Viewer } from "../../lib/types";

export enum ViewerActionTypes {
  SetViewer = "SET_VIEWER",
}

export type Action<T> = { type: ViewerActionTypes, payload?: T };
export type Dispatch<T> = (action: Action<T>) => void;
export type State = { viewer: Viewer };
export type ViewerProviderProps = { children: React.ReactNode };
