import React, {Context, createContext, ReactElement, Reducer, useCallback, useReducer} from "react";

export class ReducerConfigMap<ACTION_TYPE, STATE> extends Map<ACTION_TYPE, (state: STATE, payload: any) => STATE> {
}

export interface GenericStateAction<ACTION_TYPE> {
	type: ACTION_TYPE,
	payload: any
}

export interface GenericGlobalStateContext<STATE> {
	state: STATE,
	dispatch: ({type}: { type: string; payload?: any; }) => void
}

export function buildGlobalStateContext<STATE>(): Context<GenericGlobalStateContext<STATE>> {
	return createContext({} as GenericGlobalStateContext<STATE>);
}

function buildAsyncer<STATE>(): (dispatch: any, state: STATE) => (action: any) => any {
	return (dispatch: any, state: STATE) =>
		(action: any) =>
			typeof action === 'function'
				? action(dispatch, state)
				: dispatch(action);
}

function useGenericGlobalStateProvider<R extends Reducer<any, any>>(
	initialState: any,
	reducer: R,
	asyncer: any
) {
	const [state, dispatchBase] = useReducer(reducer, initialState);
	const dispatch = useCallback(asyncer(dispatchBase, state), []);
	return [state, dispatch]
}

function applyStateAction<ACTION_TYPE, STATE>(
	configMap: Map<ACTION_TYPE, (state: STATE, payload: any) => STATE>,
	action: GenericStateAction<ACTION_TYPE>,
	state: STATE
): STATE {
	if (configMap.has(action.type)) {
		return configMap.get(action.type)(state, action.payload);
	} else {
		console.error("Unknown ActionType: '" + action.type + "'");
		return state;
	}
}

export function genericStateProvider<STATE, ACTION_TYPE>(
	children: any,
	initialState: STATE,
	reducerConfigMap: Map<ACTION_TYPE, (state: STATE, payload: any) => STATE>,
	context: Context<GenericGlobalStateContext<STATE>>
): ReactElement {
	const reducer = (state: STATE, action: GenericStateAction<ACTION_TYPE>) => applyStateAction(reducerConfigMap, action, state);
	const [state, dispatch] = useGenericGlobalStateProvider(initialState, reducer, buildAsyncer<STATE>())
	return React.createElement(context.Provider, {children: children, value: {state, dispatch}});
}
