import * as React from 'react';
import { ReactElement, ReactNode } from 'react';

export interface SlotProps {
    name: string,
}


export function Slot(props: React.PropsWithChildren<SlotProps>): ReactElement {
    return <>{props.children}</>;
}


export function getAllSlots(children: ReactNode | ReactNode[], slotName: string): ReactElement[] {
    return getReactElements(children)
        .filter(child => child.props.name === slotName);
}

export function getFirstSlot(children: ReactNode | ReactNode[], slotName: string): ReactElement {
    return getReactElements(children)
        .find(child => child.props.name === slotName);
}

export function getChildrenOfSlots(children: ReactNode | ReactNode[], slotName: string): ReactElement[] {
    return getAllSlots(children, slotName)
        .map(childSlot => childSlot.props.children);
}

export function getChildrenOfSlot(children: ReactNode | ReactNode[], slotName: string): ReactElement[] {
    const slot: ReactElement | undefined = getFirstSlot(children, slotName);
    if (slot) {
        return slot.props.children;
    } else {
        return [];
    }
}

function getReactElements(children: ReactNode | ReactNode[]): ReactElement[] {
    return React.Children
        .toArray(children)
        .filter(child => React.isValidElement(child))
        .map(child => child as React.ReactElement);
}
