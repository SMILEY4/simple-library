import {
	applyStateAction,
	buildContext,
	GenericStateAction,
	IStateHookResultReadWrite,
	IStateHookResultWriteOnly,
	ReducerConfigMap,
	useGlobalStateReadWrite,
	useGlobalStateWriteOnly
} from "../../components/utils/storeUtils";
import React, {useReducer} from "react";
import {unique} from "../common/arrayUtils";


// STATE

export interface ItemSelectionState {
	selectedItemIds: number[],
	lastSelectedItemId: number | null,
}

const initialState: ItemSelectionState = {
	selectedItemIds: [],
	lastSelectedItemId: null
};


// REDUCER

export enum ItemSelectionActionType {
	ITEM_SELECTION_SET = "items.selection.set",
	ITEM_SELECTION_ADD = "items.selection.add",
	ITEM_SELECTION_REMOVE = "items.selection.remove",
	ITEM_SELECTION_SET_LAST = "item.selection.set-last",
}

const reducerConfigMap: ReducerConfigMap<ItemSelectionActionType, ItemSelectionState> = new ReducerConfigMap([
	[ItemSelectionActionType.ITEM_SELECTION_SET, (state, payload) => ({
		...state,
		selectedItemIds: payload,
	})],
	[ItemSelectionActionType.ITEM_SELECTION_ADD, (state, payload) => ({
		...state,
		selectedItemIds: unique<number>([...state.selectedItemIds, ...payload]),
	})],
	[ItemSelectionActionType.ITEM_SELECTION_REMOVE, (state, payload) => ({
		...state,
		selectedItemIds: state.selectedItemIds.filter(itemId => payload.indexOf(itemId) === -1),
	})],
	[ItemSelectionActionType.ITEM_SELECTION_SET_LAST, (state, payload) => ({
		...state,
		lastSelectedItemId: payload,
	})],
])


// CONTEXT

const [
	stateContext,
	dispatchContext
] = buildContext<ItemSelectionActionType, ItemSelectionState>()

const reducer = (state: ItemSelectionState, action: GenericStateAction<ItemSelectionActionType>) => applyStateAction(reducerConfigMap, action, state);

export function ItemSelectionStateProvider(props: { children: any }) {
	const [state, dispatch] = useReducer(reducer, {
		selectedItemIds: [],
		lastSelectedItemId: null
	});
	return (
		<stateContext.Provider value={state}>
			<dispatchContext.Provider value={dispatch}>
				{props.children}
			</dispatchContext.Provider>
		</stateContext.Provider>
	);
}

export function useItemSelectionState(): IStateHookResultReadWrite<ItemSelectionState, ItemSelectionActionType> {
	return [useItemSelectionStateReadOnly(), useItemSelectionStateDispatch()];
}

export function useItemSelectionStateReadOnly(): ItemSelectionState {
	const state = React.useContext(stateContext)
	if (typeof state === 'undefined') {
		throw new Error('state must be used within a Provider')
	}
	return state
}


export function useItemSelectionStateDispatch(): IStateHookResultWriteOnly<ItemSelectionActionType> {
	const dispatcher = React.useContext(dispatchContext)
	if (typeof dispatcher === 'undefined') {
		throw new Error('dispatcher must be used within a Provider')
	}
	return dispatcher
}
