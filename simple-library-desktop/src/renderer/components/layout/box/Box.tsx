import * as React from 'react';
import { ReactElement } from 'react';
import { AlignCross, AlignMain, BaseProps, concatClasses, Dir, Fill, map, orDefault, Size } from '../../common/common';
import "./box.css";

interface BoxProps extends React.HTMLAttributes<HTMLDivElement>, BaseProps {
    dir?: Dir
    alignMain?: AlignMain,
    alignCross?: AlignCross
    fill?: Fill,
    spacing?: Size,
    padding?: Size,
    margin?: Size,

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
            map(orDefault(props.alignMain, AlignMain.CENTER), (align) => 'box-align-main-' + align),
            map(orDefault(props.alignCross, AlignCross.CENTER), (align) => 'box-align-cross-' + align),
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
