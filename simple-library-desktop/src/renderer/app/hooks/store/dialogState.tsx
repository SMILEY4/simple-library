import {
	buildContext,
	GenericContextProvider,
	IStateHookResultReadWrite,
	IStateHookResultWriteOnly,
	ReducerConfigMap,
	useGlobalStateReadWrite,
	useGlobalStateWriteOnly
} from "../../../components/utils/storeUtils";
import React, {ReactElement} from "react";
import {
	useCloseDialog,
	useOpenDialog
} from "../../../components/modals/appdialogs/useAppDialogs";


// STATE

export interface DialogEntry {
	id: string,
	content: ReactElement,
	blockOutside?: boolean, // => overlay + block pointer-events
}

export interface DialogState {
	entries: DialogEntry[],
}

const initialState: DialogState = {
	entries: [],
};


// REDUCER

enum DialogActionType {
	ADD = "dialogs.add",
	REMOVE = "dialogs.remove"
}

const reducerConfigMap: ReducerConfigMap<DialogActionType, DialogState> = new ReducerConfigMap([
	[DialogActionType.ADD, (state, payload) => ({
		...state,
		entries: [...state.entries, payload],
	})],
	[DialogActionType.REMOVE, (state, payload) => ({
		...state,
		entries: state.entries.filter(e => e.id !== payload)
	})],
])


// CONTEXT

const [
	stateContext,
	dispatchContext
] = buildContext<DialogActionType, DialogState>()


export function DialogStateProvider(props: { children: any }) {
	return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useDialogContext(): IStateHookResultReadWrite<DialogState, DialogActionType> {
	return useGlobalStateReadWrite<DialogState, DialogActionType>(stateContext, dispatchContext)
}

function useDialogDispatch(): IStateHookResultWriteOnly<DialogActionType> {
	return useGlobalStateWriteOnly<DialogActionType>(dispatchContext)
}

export function useDispatchAddDialog(): (dialogEntry: DialogEntry) => void {
	const dispatch = useDialogDispatch();
	return (dialogEntry: DialogEntry) => {
		dispatch({
			type: DialogActionType.ADD,
			payload: dialogEntry
		});
	}
}

export function useDispatchRemoveDialog(): (entryId: string) => void {
	const dispatch = useDialogDispatch();
	return (entryId: string) => {
		dispatch({
			type: DialogActionType.REMOVE,
			payload: entryId
		});
	}
}

export function useDialogEntries() {
	const [state] = useDialogContext();
	return state.entries;
}

export function useDispatchOpenDialog() {
	const addDialog = useDispatchAddDialog();
	const removeDialog = useDispatchRemoveDialog();
	return useOpenDialog(
		(entry: DialogEntry) => addDialog(entry),
		(id: string) => removeDialog(id)
	).openGeneric;
}

export function useDispatchOpenConfirmationDialog() {
	const addDialog = useDispatchAddDialog();
	const removeDialog = useDispatchRemoveDialog();
	return useOpenDialog(
		(entry: DialogEntry) => addDialog(entry),
		(id: string) => removeDialog(id)
	).openConfirmation;

}

export function useDispatchCloseDialog() {
	const removeDialog = useDispatchRemoveDialog();
	return useCloseDialog((id: string) => removeDialog(id));
}
