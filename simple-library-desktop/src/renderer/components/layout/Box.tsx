import * as React from 'react';
import { ReactElement } from 'react';
import { AlignCross, AlignMain, concatClasses, Dir, Fill, map, Size } from '../common';
import "./box.css";

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {

    dir?: Dir
    alignMain?: AlignMain,
    alignCross?: AlignCross
    fill?: Fill,

    spacing?: Size,
    padding?: Size,
    margin?: Size,

    style?: React.CSSProperties,
    className?: string,

    outlined?: any, //todo: deprecated -> remove
    type?: any, //todo: deprecated -> remove
}

export function Box(props: React.PropsWithChildren<BoxProps>): ReactElement {

    return (
        <div {...props} className={getClassNames()} style={getStyle()}>
            {props.children}
        </div>
    );

    function getClassNames(): string {
        return concatClasses(
            "box",

            map(props.dir, (dir) => 'box-dir-' + dir),
            map(props.alignMain, (align) => 'box-align-main-' + align),
            map(props.alignCross, (align) => 'box-align-cross-' + align),
            map(props.fill, (fill) => 'fill-' + fill),

            map(props.spacing, (spacing) => 'gap-' + spacing),
            map(props.padding, (padding) => 'padding-' + padding),
            map(props.margin, (margin) => 'margin-' + margin),

            props.className,
        );
    }

    function getStyle(): React.CSSProperties {
        return {
            ...(props.style ? props.style : {}),
        };
    }

}


interface VBoxProps extends Omit<BoxProps, 'dir'> {

}

export function VBox(props: React.PropsWithChildren<VBoxProps>): ReactElement {
    const baseProps = {
        dir: Dir.DOWN,
        ...props,
    };
    return (
        <Box {...baseProps} />
    );
}


interface HBoxProps extends Omit<BoxProps, 'dir'> {

}

export function HBox(props: React.PropsWithChildren<HBoxProps>): ReactElement {
    const baseProps = {
        dir: Dir.RIGHT,
        ...props,
    };
    return (
        <Box {...baseProps} />
    );
}


interface CBoxProps extends Omit<BoxProps, 'alignMain' | 'alignCross'> {

}

export function CBox(props: React.PropsWithChildren<CBoxProps>): ReactElement {
    const baseProps = {
        alignMain: AlignMain.CENTER,
        alignCross: AlignCross.CENTER,
        ...props,
    };
    return (
        <Box {...baseProps} />
    );
}

