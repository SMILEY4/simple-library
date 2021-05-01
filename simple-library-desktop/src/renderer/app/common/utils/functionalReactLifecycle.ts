import { useEffect } from 'react';

export function componentDidMount(action: () => void): void {
    useEffect(() => {
        action();
    }, []);
}

export function componentWillUnmount(action: () => void): void {
    useEffect(() => {
        return () => {
            action();
        };
    }, []);
}

export function componentLifecycle(onMount: () => void, onUnmount: () => void): void {
    useEffect(() => {
        onMount();
        return () => {
            onUnmount();
        };
    }, []);
}