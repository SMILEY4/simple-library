import {GlobalApplicationState, initialState} from './state';
import React, {Context, createContext, useCallback, useReducer} from 'react';
import {Reducer} from './reducer';


interface IGlobalStateContext {
    state: GlobalApplicationState;
    dispatch: ({type}: { type: string; payload?: any; }) => void
}


export const GlobalStateContext: Context<IGlobalStateContext> = createContext({} as IGlobalStateContext);


interface StateProviderProps {
    children: any;
}


export function GlobalStateProvider(props: StateProviderProps) {
    const [state, dispatchBase] = useReducer(Reducer, initialState);
    const dispatch = useCallback(asyncer(dispatchBase, state), []);
    return (
        <GlobalStateContext.Provider value={{state, dispatch}}>
            {props.children}
        </GlobalStateContext.Provider>
    );
}


const asyncer = (dispatch: any, state: GlobalApplicationState) => (action: any) =>
    typeof action === 'function'
        ? action(dispatch, state)
        : dispatch(action);

