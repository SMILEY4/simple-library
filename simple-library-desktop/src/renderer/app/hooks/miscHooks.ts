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