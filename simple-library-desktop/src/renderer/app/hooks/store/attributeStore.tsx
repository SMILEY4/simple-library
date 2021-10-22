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
import {AttributeDTO, AttributeKeyDTO, attributeKeysDtoEquals} from "../../../../common/events/dtoModels";


// STATE

export interface AttributeState {
	itemId: number | null;
	attributes: AttributeDTO[];
}

const initialState: AttributeState = {
	itemId: null,
	attributes: []
};


// REDUCER

enum AttributeActionType {
	SET = "attributes.set",
	ADD = "attributes.add",
	REMOVE = "attributes.remove",
	UPDATE = "attributes.update",
	CLEAR_MODIFIED_FLAGS = "attributes.set-modified-flag"
}

const reducerConfigMap: ReducerConfigMap<AttributeActionType, AttributeState> = new ReducerConfigMap([
	[AttributeActionType.SET, (state, payload) => ({
		...state,
		itemId: payload.itemId,
		attributes: payload.attributes
	})],
	[AttributeActionType.ADD, (state, payload) => ({
		...state,
		attributes: [state.attributes, payload]
	})],
	[AttributeActionType.REMOVE, (state, payload) => ({
		...state,
		attributes: state.attributes.filter(att => attributeKeysDtoEquals(att.key, payload))
	})],
	[AttributeActionType.UPDATE, (state, payload) => ({
		...state,
		attributes: state.attributes.map(att => {
			if (attributeKeysDtoEquals(att.key, payload.key)) {
				return {
					...att,
					value: payload.value,
					modified: payload.modified
				};
			} else {
				return att;
			}
		})
	})],
	[AttributeActionType.CLEAR_MODIFIED_FLAGS, (state) => ({
		...state,
		attributes: state.attributes.map(att => ({
			...att,
			modified: false
		}))
	})]
]);


// CONTEXT

const [
	stateContext,
	dispatchContext
] = buildContext<AttributeActionType, AttributeState>();


export function AttributeStateProvider(props: { children: any }) {
	return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useAttributeContext(): IStateHookResultReadWrite<AttributeState, AttributeActionType> {
	return useGlobalStateReadWrite<AttributeState, AttributeActionType>(stateContext, dispatchContext);
}

function useAttributeDispatch(): IStateHookResultWriteOnly<AttributeActionType> {
	return useGlobalStateWriteOnly<AttributeActionType>(dispatchContext);
}

export function useStateAttributes() {
	const [state] = useAttributeContext();
	return state.attributes;
}

export function useStateAttributeStoreItemId() {
	const [state] = useAttributeContext();
	return state.itemId;
}

export function useDispatchSetAttributes() {
	const dispatch = useAttributeDispatch();
	return (itemId: number | null, attributes: AttributeDTO[]) => {
		dispatch({
			type: AttributeActionType.SET,
			payload: {
				itemId: itemId,
				attributes: attributes
			}
		});
	};
}

export function useDispatchAddAttribute() {
	const dispatch = useAttributeDispatch();
	return (attribute: AttributeDTO) => {
		dispatch({
			type: AttributeActionType.ADD,
			payload: attribute
		});
	};
}

export function useDispatchRemoveAttribute() {
	const dispatch = useAttributeDispatch();
	return (key: AttributeKeyDTO) => {
		dispatch({
			type: AttributeActionType.REMOVE,
			payload: key
		});
	};
}

export function useDispatchUpdateAttribute() {
	const dispatch = useAttributeDispatch();
	return (attribute: AttributeDTO) => {
		dispatch({
			type: AttributeActionType.UPDATE,
			payload: {
				key: attribute.key,
				value: attribute.value,
				modified: attribute.modified
			}
		});
	};
}

export function useDispatchAttributesClearModifiedFlags() {
	const dispatch = useAttributeDispatch();
	return () => {
		dispatch({
			type: AttributeActionType.CLEAR_MODIFIED_FLAGS,
			payload: undefined
		});
	};
}

