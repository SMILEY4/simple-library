import {Dispatch, MutableRefObject, SetStateAction, useEffect} from "react";
import {useStateRef} from "../../components/common/commonHooks";

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
): [
	S,
	Dispatch<SetStateAction<S>>,
	boolean,
	() => boolean,
	MutableRefObject<S>,
	MutableRefObject<boolean>
] {

	const [value, setValue, refValue] = useStateRef(initialState)
	const [valid, setValid, refValid] = useStateRef(initialValid)

	function setValueAndValidate(value: S): void {
		setValue(value);
		setValid(validate(value))
	}

	return [
		value,
		setValueAndValidate,
		valid,
		() => {
			const valid = validate(refValue.current)
			setValid(valid)
			return valid;
		},
		refValue,
		refValid,
	];
}