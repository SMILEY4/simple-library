import * as React from 'react';
import {ReactElement} from 'react';
import "./box.css";
import {BaseProps, Size} from "../../common";
import {concatClasses, map, mapOrDefault} from "../../../components/common/common";

interface BoxProps extends BaseProps {
    dir?: "up" | "down" | "left" | "right"
    alignMain?: "start" | "end" | "center" | "space-between" | "spaced",
    alignCross?: "start" | "end" | "center" | "stretch"
    spacing?: Size,
    padding?: Size,
    margin?: Size,
}

export function Box(props: React.PropsWithChildren<BoxProps>): ReactElement {

    return (
        <div
            className={getClassNames()}
            style={props.style}
            ref={props.forwardRef}
        >
            {props.children}
        </div>
    );

    function getClassNames(): string {
        return concatClasses(
            props.className,
            "box",
            map(props.dir, (dir) => "box-" + dir),
            mapOrDefault(props.alignMain, "center", (align) => "box-main-" + align),
            mapOrDefault(props.alignCross, "center", (align) => "box-cross-" + align),
            map(props.spacing, (spacing) => "gap-" + spacing),
            map(props.padding, (padding) => "padding-" + padding),
            map(props.margin, (margin) => "margin-" + margin),
        );
    }
}


interface VBoxProps extends Omit<BoxProps, 'dir'> {

}

export function VBox(props: React.PropsWithChildren<VBoxProps>): ReactElement {
    const baseProps: BoxProps = {
        dir: "down",
        ...props,
    };
    return (
        <Box {...baseProps} />
    );
}


interface HBoxProps extends Omit<BoxProps, 'dir'> {

}

export function HBox(props: React.PropsWithChildren<HBoxProps>): ReactElement {
    const baseProps: BoxProps = {
        dir: "right",
        ...props,
    };
    return (
        <Box {...baseProps} />
    );
}
