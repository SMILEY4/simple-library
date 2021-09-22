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
import {AttributeDTO, AttributeValueDTO} from "../../../../common/events/dtoModels";


// STATE

export interface AttributeState {
	attributes: AttributeDTO[]
}

const initialState: AttributeState = {
	attributes: []
};


// REDUCER

enum AttributeActionType {
	SET = "attributes.set",
	ADD = "attributes.add",
	REMOVE = "attributes.remove",
	UPDATE = "attributes.update",
}

const reducerConfigMap: ReducerConfigMap<AttributeActionType, AttributeState> = new ReducerConfigMap([
	[AttributeActionType.SET, (state, payload) => ({
		...state,
		attributes: payload
	})],
	[AttributeActionType.ADD, (state, payload) => ({
		...state,
		attributes: [state.attributes, payload]
	})],
	[AttributeActionType.REMOVE, (state, payload) => ({
		...state,
		attributes: state.attributes.filter(att => att.key !== payload)
	})],
	[AttributeActionType.UPDATE, (state, payload) => ({
		...state,
		attributes: state.attributes.map(att => {
			if (att.key === payload.key) {
				return {
					key: att.key,
					type: att.type,
					value: payload.value,
				};
			} else {
				return att;
			}
		})
	})],
])


// CONTEXT

const [
	stateContext,
	dispatchContext
] = buildContext<AttributeActionType, AttributeState>()


export function AttributeStateProvider(props: { children: any }) {
	return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useAttributeContext(): IStateHookResultReadWrite<AttributeState, AttributeActionType> {
	return useGlobalStateReadWrite<AttributeState, AttributeActionType>(stateContext, dispatchContext)
}

function useAttributeDispatch(): IStateHookResultWriteOnly<AttributeActionType> {
	return useGlobalStateWriteOnly<AttributeActionType>(dispatchContext)
}

export function useStateAttributes() {
	const [state] = useAttributeContext();
	return state.attributes;
}

export function useDispatchSetAttributes() {
	const dispatch = useAttributeDispatch();
	return (attributes: AttributeDTO[]) => {
		dispatch({
			type: AttributeActionType.SET,
			payload: attributes,
		});
	}
}

export function useDispatchAddAttribute() {
	const dispatch = useAttributeDispatch();
	return (attribute: AttributeDTO) => {
		dispatch({
			type: AttributeActionType.ADD,
			payload: attribute,
		});
	}
}

export function useDispatchRemoveAttribute() {
	const dispatch = useAttributeDispatch();
	return (key: string) => {
		dispatch({
			type: AttributeActionType.REMOVE,
			payload: key,
		});
	}
}

export function useDispatchUpdateAttribute() {
	const dispatch = useAttributeDispatch();
	return (key: string, value: AttributeValueDTO) => {
		dispatch({
			type: AttributeActionType.UPDATE,
			payload: {
				key: key,
				value: value
			},
		});
	}
}
