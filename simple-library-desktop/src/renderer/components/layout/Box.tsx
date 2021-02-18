import * as React from 'react';
import {ReactElement} from 'react';
import './box.css';
import {AlignCross, AlignMain, concatClasses, Dir, Fill, map, Size} from '../common';


interface BoxProps {
    dir?: Dir
    alignMain?: AlignMain,
    alignCross?: AlignCross
    fill?: Fill,
    spacing?: Size,
    padding?: Size,
    style?: React.CSSProperties,
    className?: string
}

interface VBoxProps extends Omit<BoxProps, 'dir'> {

}

interface HBoxProps extends Omit<BoxProps, 'dir'> {

}

interface CBoxProps extends Omit<BoxProps, 'alignMain' | 'alignCross'> {

}

export function Box(props: React.PropsWithChildren<BoxProps>): ReactElement {

    function getClassNames(): string {
        return concatClasses(
            'box',
            map(props.dir, (dir) => 'box-dir-' + dir),
            map(props.alignMain, (align) => 'box-align-main-' + align),
            map(props.alignCross, (align) => 'box-align-cross-' + align),
            map(props.fill, (fill) => 'fill-' + fill),
            map(props.spacing, (spacing) => 'gap-' + spacing),
            map(props.padding, (padding) => 'padding-' + padding),
            props.className,
        );
    }

    return (
        <div className={getClassNames()} style={props.style}>
            {props.children}
        </div>
    );
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


export function HBox(props: React.PropsWithChildren<HBoxProps>): ReactElement {
    const baseProps = {
        dir: Dir.RIGHT,
        ...props,
    };
    return (
        <Box {...baseProps} />
    );
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
