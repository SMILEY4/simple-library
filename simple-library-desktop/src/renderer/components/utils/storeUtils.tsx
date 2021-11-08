import React, {Context, createContext, Dispatch, ReactElement, useContext, useReducer} from "react";

export class ReducerConfigMap<ACTION_TYPE, STATE> extends Map<ACTION_TYPE, (state: STATE, payload: any) => STATE> {
}

export interface GenericStateAction<ACTION_TYPE> {
	type: ACTION_TYPE,
	payload: any
}

export type IStateHookResultReadWrite<STATE, ACTION_TYPE> = [STATE, ({type}: { type: ACTION_TYPE, payload?: any }) => void];
export type IStateHookResultWriteOnly<ACTION_TYPE> = ({type}: { type: ACTION_TYPE, payload?: any }) => void;
export type IStateHookResultReadOnly<STATE> = STATE;


export function buildContext<ACTION_TYPE, STATE>(): [Context<STATE>, Context<Dispatch<GenericStateAction<ACTION_TYPE>>>] {
	const stateContext = createContext<STATE | undefined>(undefined);
	const dispatchContext = createContext<Dispatch<GenericStateAction<ACTION_TYPE>>>(() => {
	});
	return [stateContext, dispatchContext];
}

export function applyStateAction<ACTION_TYPE, STATE>(
	configMap: Map<ACTION_TYPE, (state: STATE, payload: any) => STATE>,
	action: GenericStateAction<ACTION_TYPE>,
	state: STATE
): STATE {
	if (configMap.has(action.type)) {
		return configMap.get(action.type)(state, action.payload);
	} else {
		console.error("Unknown action-type: '" + action.type + "'");
		return state;
	}
}

export function useReducerFromConfig<ACTION_TYPE, STATE>(initState: STATE, configMap: Map<ACTION_TYPE, (state: STATE, payload: any) => STATE>) {
	const reducer = (state: STATE, action: GenericStateAction<ACTION_TYPE>) => applyStateAction(configMap, action, state);
	return useReducer(reducer, initState);
}

export function GenericContextProvider<STATE, ACTION_TYPE>(
	children: any,
	initialState: STATE,
	reducerConfigMap: Map<ACTION_TYPE, (state: STATE, payload: any) => STATE>,
	stateContext: Context<STATE>,
	dispatchContext: Context<Dispatch<GenericStateAction<ACTION_TYPE>>>
): ReactElement {
	const [state, dispatch] = useReducerFromConfig(initialState, reducerConfigMap);

	return React.createElement(
		stateContext.Provider,
		{
			children: React.createElement(
				dispatchContext.Provider,
				{
					children: children,
					value: dispatch
				}
			),
			value: state
		}
	);
}

export function useGlobalStateReadWrite<STATE, ACTION_TYPE>(stateContext: Context<STATE>, dispatchContext: Context<Dispatch<GenericStateAction<ACTION_TYPE>>>): IStateHookResultReadWrite<STATE, ACTION_TYPE> {
	const state: STATE = useGlobalStateReadOnly(stateContext);
	const dispatch = useGlobalStateWriteOnly(dispatchContext);
	return [state, dispatch];
}

export function useGlobalStateReadOnly<STATE>(stateContext: Context<STATE>): STATE {
	const state: STATE = useContext(stateContext);
	if (state) {
		return state;
	} else {
		throw "Error: No global read-only-state found";
	}
}

export function useGlobalStateWriteOnly<ACTION_TYPE>(dispatchContext: Context<Dispatch<GenericStateAction<ACTION_TYPE>>>): ({type}: { type: ACTION_TYPE, payload?: any }) => void {
	const dispatch = useContext(dispatchContext);
	if (dispatch) {
		return dispatch;
	} else {
		throw "Error: No global write-only-state found";
	}
}