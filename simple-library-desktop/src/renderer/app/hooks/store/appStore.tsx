import {
	buildContext,
	GenericContextProvider,
	IStateHookResultReadWrite,
	IStateHookResultWriteOnly,
	ReducerConfigMap,
	useGlobalStateReadWrite,
	useGlobalStateWriteOnly
} from "../../../components/utils/storeUtils";
import React from "react";


// STATE

export interface AppState {
	theme: "light" | "dark";
}

const initialState: AppState = {
	theme: "light"
};


// REDUCER

enum AppActionType {
	SET_THEME = "app.theme.set",
}

const reducerConfigMap: ReducerConfigMap<AppActionType, AppState> = new ReducerConfigMap([
	[AppActionType.SET_THEME, (state, payload) => ({
		...state,
		theme: payload
	})]
]);


// CONTEXT

const [
	stateContext,
	dispatchContext
] = buildContext<AppActionType, AppState>();


export function AppStateProvider(props: { children: any }) {
	return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useAppContext(): IStateHookResultReadWrite<AppState, AppActionType> {
	return useGlobalStateReadWrite<AppState, AppActionType>(stateContext, dispatchContext);
}

function useAppDispatch(): IStateHookResultWriteOnly<AppActionType> {
	return useGlobalStateWriteOnly<AppActionType>(dispatchContext);
}

export function useAppTheme() {
	const [state] = useAppContext();
	return state.theme;
}


export function useDispatchSetTheme() {
	const dispatch = useAppDispatch();
	return (theme: "light" | "dark") => {
		dispatch({
			type: AppActionType.SET_THEME,
			payload: theme
		});
	};
}
