import * as React from "react";
import {ReactElement} from "react";
import "./container.css"
import { AlignmentCross, AlignmentMain, classNameOrEmpty, Direction } from '../common';

interface ContainerProps {
    padded?: boolean,
    spacing?: string,
    dir?: Direction,
    alignMain?: AlignmentMain,
    alignCross?: AlignmentCross
    className?: string
}

interface ContainerCenterAlignProps extends Omit<ContainerProps, 'alignMain' | 'alignCross'> {
}


export function Container(props: React.PropsWithChildren<ContainerProps>): ReactElement {

    function getClassNames(): string {
        return "container"
            + (props.padded === true ? " container-padded" : "")
            + (props.dir ? " container-dir-" + props.dir : "")
            + (props.alignMain ? " container-align-main-" + props.alignMain : "")
            + (props.alignCross ? " container-align-cross-" + props.alignCross : "")
            + classNameOrEmpty(props.className)
    }

    function getStyle(): any {
        return props.spacing
            ? {gap: props.spacing}
            : undefined
    }

    return (
        <div className={getClassNames()} style={getStyle()}>
            {props.children}
        </div>
    )
}


export function ContainerCenterAlign(props: React.PropsWithChildren<ContainerCenterAlignProps>): ReactElement {
    const baseProps: ContainerProps = {
        alignMain: AlignmentMain.CENTER,
        alignCross: AlignmentCross.CENTER,
        ...props
    }
    return (
        <Container {...baseProps} />
    )
}