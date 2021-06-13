import {useContext} from 'react';
import {GlobalAppStateContext} from "../../store/globalAppState";


export function useGlobalState() {
    const {state, dispatch} = useContext(GlobalAppStateContext);
    if (state) {
        return {state, dispatch};
    } else {
        console.error("Error: No global state found.");
    }
}