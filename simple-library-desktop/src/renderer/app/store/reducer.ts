import { GlobalApplicationState } from './state';

export enum ActionType {
    INCREMENT = "increment",
    SET = "set"
}

export type Action = {
    type: ActionType
    payload: any
}

export function Reducer(state: GlobalApplicationState, action: Action): GlobalApplicationState {
    switch (action.type) {
        case ActionType.INCREMENT:
            return {
                ...state,
                counter: state.counter + 1,
            };
        case ActionType.SET:
            return {
                ...state,
                counter: action.payload,
            };
        default:
            console.error("Unknown ActionType: '" + action.type + "'");
            return state;
    }
}