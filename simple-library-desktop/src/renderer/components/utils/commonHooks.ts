import {Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState} from 'react';

export function useEventListener(type: string, action: (e: any) => void) {
	useLifecycle(
		() => document.addEventListener(type, action),
		() => document.removeEventListener(type, action),
	)
}


export function useEventListeners(types: string[], action: (e: any) => void) {
	types.forEach((type: string) => useEventListener(type, action));
}


export function useKeyListener(key: string, action: (event: KeyboardEvent) => void) {
	useEventListener("keydown", (e) => {
		if (e.key === key) {
			action(e);
		}
	})
}


export function useClickOutside(action: (target: any) => void, targetRef?: MutableRefObject<any>): MutableRefObject<any> {
	const targetElementRef: MutableRefObject<any> = useRef(targetRef ? targetRef : null);

	useEventListener("mousedown", handleClick)

	function handleClick(event: Event) {
		if (targetElementRef && targetElementRef.current && !targetElementRef.current.contains(event.target)) {
			action(event.target);
		}
	}

	return targetElementRef;
}


export function useDraggable(onStart: () => void, onDrag: (dx: number, dy: number) => void, onStop: () => void, onlyInsideRef?: MutableRefObject<any>) {

	const refTarget = useRef(null);
	const [isDragging, setDragging, refDragging] = useStateRef(false);

	useEventListener("mouseup", handleMouseUp)
	useEventListener("mousemove", handleMouseMove)

	function handleMouseDown() {
		if (!refDragging.current) {
			setDragging(true);
			refDragging.current = true;
			onStart();
		}
	}

	function handleMouseUp() {
		if (refDragging.current) {
			setDragging(false);
			refDragging.current = false;
			onStop();
		}
	}

	function handleMouseMove(event: any) {
		if (refDragging.current) {
			if (onlyInsideRef && !onlyInsideRef.current.contains(event.target)) {
				setDragging(false);
				refDragging.current = false;
				onStop();
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			const targetPageX = refTarget.current.getBoundingClientRect().x + window.scrollX;
			const targetPageY = refTarget.current.getBoundingClientRect().y + window.scrollY;
			const mousePageX = event.pageX;
			const mousePageY = event.pageY;
			const dx = mousePageX - targetPageX;
			const dy = mousePageY - targetPageY;
			onDrag(dx, dy);
		}
	}

	return {
		refTarget: refTarget,
		mouseDownHandler: handleMouseDown,
	};
}

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

export function useStateRef<S>(initialValue: S | (() => S),): [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>] {
	const [value, setValue] = useState(initialValue);

	const ref = useRef(value);

	useEffect(
		() => {
			ref.current = value;
		},
		[value]);

	return [value, setValue, ref];
}


export function useValidatedStateOLD<S>(
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


export function useValidatedState<S>(
	initialState: S | (() => S),
	initialValid: boolean,
	validate: (value: S) => boolean,
	registerAtForm?: (triggerValidation: () => boolean, isValid: () => boolean) => void
): [
	() => S,
	Dispatch<SetStateAction<S>>,
	() => boolean,
	() => boolean,
] {

	const [value, setValue, refValue] = useStateRef(initialState)
	const [valid, setValid, refValid] = useStateRef(initialValid)

	function getValue(): S {
		return refValue.current;
	}

	function isValid(): boolean {
		return refValid.current
	}

	function setValueAndValidate(value: S): void {
		const valid: boolean = validate(value);
		refValue.current = value
		setValue(value);
		refValid.current = valid
		setValid(valid)
	}

	function triggerValidation(): boolean {
		const valid: boolean = validate(getValue())
		refValid.current = valid;
		setValid(valid)
		return valid;
	}

	registerAtForm && registerAtForm(triggerValidation, isValid);

	return [
		getValue,
		setValueAndValidate,
		isValid,
		triggerValidation
	];
}


export function useComplexValidatedState<S, V>(
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

export function useValidatedForm() {

	const triggerFunctions: (() => boolean)[] = []
	const getterFunctions: (() => boolean)[] = []

	function register(triggerValidation: () => boolean, isValid: () => boolean): void {
		triggerFunctions.push(triggerValidation)
		getterFunctions.push(isValid)
	}

	function triggerValidation(): boolean {
		const results: boolean[] = triggerFunctions.map(f => f())
		return results.every((valid: boolean) => valid)
	}

	function isValid(): boolean {
		const results: boolean[] = getterFunctions.map(f => f())
		return results.every((valid: boolean) => valid)
	}

	return {
		registerAtForm: register,
		isFormValid: isValid,
		triggerFormValidation: triggerValidation,
	}

}
