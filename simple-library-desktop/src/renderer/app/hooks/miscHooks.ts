import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useGlobalState} from "./old/miscAppHooks";
import {ActionType} from "../store/reducer";

export function useMount(action: () => void) {
	useEffect(action, []);
}

export function useUnmount(action: () => void) {
	useEffect(() => action, []);
}

export function useLifecycle(onMount: () => void, onUnmount: () => void) {
	useEffect(() => {
		onMount();
		return () => {
			onUnmount();
		};
	}, []);
}


export function useValidatedState<S>(
	initialState: S | (() => S),
	initialValid: boolean,
	validate: (value: S) => boolean
): [S, Dispatch<SetStateAction<S>>, boolean, () => boolean] {

	const [value, setValue] = useState(initialState);
	const [valid, setValid] = useState(initialValid)

	function setValueAndValidate(value: S): void {
		setValue(value);
		setValid(validate(value))
	}

	return [
		value,
		setValueAndValidate,
		valid,
		() => {
			const valid = validate(value)
			setValid(valid)
			return valid;
		},
	];
}


export function useCollectionSidebar() {

	const { state, dispatch } = useGlobalState();

	function toggleExpandNode(nodeId: string, expanded: boolean) {
		if (expanded) {
			dispatch({
				type: ActionType.COLLECTION_SIDEBAR_SET_EXPANDED,
				payload: [...state.collectionSidebarExpandedNodes, nodeId],
			});
		} else {
			dispatch({
				type: ActionType.COLLECTION_SIDEBAR_SET_EXPANDED,
				payload: state.collectionSidebarExpandedNodes.filter(id => id !== nodeId)
			});
		}
	}

	return {
		collectionSidebarExpandedNodes: state.collectionSidebarExpandedNodes,
		collectionSidebarToggleExpandedNode: toggleExpandNode
	}

}