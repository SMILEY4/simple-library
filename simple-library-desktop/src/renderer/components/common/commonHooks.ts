import { Dispatch, MutableRefObject, SetStateAction, useEffect, useRef, useState } from 'react';
import { componentLifecycle } from '../../app/common/utils/functionalReactLifecycle';

export function useStateRef<S>(initialValue: S): [S, Dispatch<SetStateAction<S>>, MutableRefObject<S>] {
    const [value, setValue] = useState(initialValue);
    const ref = useRef(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return [value, setValue, ref];
}


export function useClickOutside(action: () => void): MutableRefObject<any> {
    const targetRef: MutableRefObject<any> = useRef(null);
    componentLifecycle(
        () => document.addEventListener('mousedown', handleClick),
        () => document.removeEventListener('mousedown', handleClick),
    );
    function handleClick(event: any) {
        if (targetRef && targetRef.current && !targetRef.current.contains(event.target)) {
            action();
        }
    }
    return targetRef;
}
