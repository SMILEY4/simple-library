import * as React from 'react';
import { ReactElement, ReactNode } from 'react';

export interface SlotProps {
    name: string,
}


export function Slot(props: React.PropsWithChildren<SlotProps>): ReactElement {
    return <>{props.children}</>;
}

export function getAllSlots(children: ReactNode | ReactNode[], slotName: string): any[] {
    return React.Children
        .toArray(children)
        .filter(child => isSlot(child, slotName));
}

export function getFirstSlot(children: ReactNode | ReactNode[], slotName: string): any {
    return React.Children
        .toArray(children)
        .find(child => isSlot(child, slotName));
}

export function isSlot(child: any, slotName: string): boolean {
    return React.isValidElement(child) && (child as React.ReactElement).props.name === slotName;
}

export function ElementWithSlots(props: React.PropsWithChildren<any>): ReactElement {
    print();
    return (
        <div>
            {props.children}
        </div>
    );


    function print() {
        React.Children
            .toArray(props.children)
            .filter(child => React.isValidElement(child) && (child as React.ReactElement).props.name !== undefined)
            .forEach((child, i) => {
                console.log("CHILD " + i + ": " + (child as React.ReactElement).props.name);
            });

    }

}
