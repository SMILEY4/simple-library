import * as React from 'react';
import {ReactElement, ReactNode} from 'react';
import {getReactElements} from "../../../components/common/common";
import {ReferenceChildrenProps, ReferenceProps} from "react-popper";
import {Slot} from "./Slot";

export interface DynamicSlotProps {
    name: string,
    children: (props: any) => ReactElement;
}

export class DynamicSlot extends React.Component<DynamicSlotProps, {}> {}

export function getAllDynamicSlots(children: ReactNode | ReactNode[], slotName: string): ReactElement[] {
    return getReactElements(children)
        .filter(child => child.type === DynamicSlot)
        .filter(child => child.props.name === slotName);
}

export function getFirstDynamicSlot(children: ReactNode | ReactNode[], slotName: string): ReactElement | undefined {
    return getReactElements(children)
        .filter(child => child.type === DynamicSlot)
        .find(child => child.props.name === slotName);
}

export function getChildOfDynamicSlot(children: ReactNode | ReactNode[], slotName: string, props: any): ReactElement | undefined {
    const slot: ReactElement | undefined  =  getFirstDynamicSlot(children, slotName);
    if(slot) {
        return slot.props.children(props)
    } else {
        return undefined;
    }
}
