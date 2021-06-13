import {useContext} from 'react';
import {GlobalStateContext} from '../../store/provider';


export function useGlobalState() {
    const {state, dispatch} = useContext(GlobalStateContext);
    if (state) {
        return {state, dispatch};
    } else {
        console.error("Error: No global state found.");
    }
}