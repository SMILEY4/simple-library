import {Dispatch, MutableRefObject, SetStateAction, useEffect} from "react";
import {useStateRef} from "../../components/utils/commonHooks";

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
			const valid: boolean = validate(refValue.current)
			refValid.current = valid;
			setValid(valid)
			return valid;
		},
		refValue,
		refValid,
	];
}



export function useComplexValidatedState<S,V>(
	initialState: S | (() => S),
	initialValid: V,
	validate: (value: S) => V
): [
	S,
	Dispatch<SetStateAction<S>>,
	V,
	() => V,
	MutableRefObject<S>,
	MutableRefObject<V>
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
			const valid: V = validate(refValue.current)
			refValid.current = valid;
			setValid(valid)
			return valid;
		},
		refValue,
		refValid,
	];
}