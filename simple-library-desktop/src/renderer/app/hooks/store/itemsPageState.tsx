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
export const DEFAULT_PAGE_SIZE = 50;

export interface ItemsPageState {
    index: number,
    size: number,
    total: number
}

const initialState: ItemsPageState = {
    index: 0, size: DEFAULT_PAGE_SIZE, total: 0
};


// REDUCER

enum ItemsPageActionType {
    SET_PAGE = "items.page.set",
}

const reducerConfigMap: ReducerConfigMap<ItemsPageActionType, ItemsPageState> = new ReducerConfigMap([
    [ItemsPageActionType.SET_PAGE, (state, payload) => ({
        ...state,
        ...payload
    })]
]);


// CONTEXT

const [
    stateContext,
    dispatchContext
] = buildContext<ItemsPageActionType, ItemsPageState>();

export function ItemsPageStateProvider(props: { children: any }) {
    return GenericContextProvider(props.children, initialState, reducerConfigMap, stateContext, dispatchContext);
}

export function useItemsContext(): IStateHookResultReadWrite<ItemsPageState, ItemsPageActionType> {
    return useGlobalStateReadWrite<ItemsPageState, ItemsPageActionType>(stateContext, dispatchContext);
}

function useItemsDispatch(): IStateHookResultWriteOnly<ItemsPageActionType> {
    return useGlobalStateWriteOnly<ItemsPageActionType>(dispatchContext);
}


export function useDispatchSetItemPage(): (page: { index: number, size: number, total: number }) => void {
    const dispatch = useItemsDispatch();
    return (page: { index: number, size: number, total: number }) => {
        dispatch({
            type: ItemsPageActionType.SET_PAGE,
            payload: page
        });
    };
}

export function useItemPage() {
    const [state] = useItemsContext();
    return state;
}
