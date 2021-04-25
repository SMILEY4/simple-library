import * as React from 'react';
import { ReactElement } from 'react';
import { BaseProps, concatClasses, getIf, map, Type } from '../../common/common';
import './text.css';

export enum TextVariant {
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
    H4 = 'h4',
    H5 = 'h5',
    BODY = 'body',
    CAPTION = 'caption'
}


interface TextProps extends BaseProps {
    variant: TextVariant,
    bold?: boolean,
    italic?: boolean,
    type?: Type,
    onType?: boolean,
    disabled?: boolean,
}

interface GenericTextProps extends Omit<TextProps, 'variant'> {
}


export function Text(props: React.PropsWithChildren<TextProps>): ReactElement | null {
    const className = concatClasses(
        props.variant,
        props.className,
        getIf(props.bold, "text-bold"),
        getIf(props.italic, "text-italic"),
        getIf(props.disabled, "text-disabled"),
        map(props.type, (type) => {
            return props.onType === true
                ? "text-on-type-" + type
                : "text-type-" + type;
        }),
    );
    switch (props.variant) {
        case TextVariant.H1:
            return <h1 className={className} style={props.style}>{props.children}</h1>;
        case TextVariant.H2:
            return <h2 className={className} style={props.style}>{props.children}</h2>;
        case TextVariant.H3:
            return <h3 className={className} style={props.style}>{props.children}</h3>;
        case TextVariant.H4:
            return <h4 className={className} style={props.style}>{props.children}</h4>;
        case TextVariant.H5:
            return <h5 className={className} style={props.style}>{props.children}</h5>;
        case TextVariant.BODY:
            return <div className={className} style={props.style}>{props.children}</div>;
        case TextVariant.CAPTION:
            return <div className={className} style={props.style}>{props.children}</div>;
        default: {
            return null;
        }
    }
}

export function H1Text(props: React.PropsWithChildren<GenericTextProps>): ReactElement | null {
    return <Text {...{ variant: TextVariant.H1, ...props }} />;
}

export function H2Text(props: React.PropsWithChildren<GenericTextProps>): ReactElement | null {
    return <Text {...{ variant: TextVariant.H2, ...props }} />;
}

export function H3Text(props: React.PropsWithChildren<GenericTextProps>): ReactElement | null {
    return <Text {...{ variant: TextVariant.H3, ...props }} />;
}

export function H4Text(props: React.PropsWithChildren<GenericTextProps>): ReactElement | null {
    return <Text {...{ variant: TextVariant.H4, ...props }} />;
}

export function H5Text(props: React.PropsWithChildren<GenericTextProps>): ReactElement | null {
    return <Text {...{ variant: TextVariant.H5, ...props }} />;
}

export function BodyText(props: React.PropsWithChildren<GenericTextProps>): ReactElement | null {
    return <Text {...{ variant: TextVariant.BODY, ...props }} />;
}

export function CaptionText(props: React.PropsWithChildren<GenericTextProps>): ReactElement | null {
    return <Text {...{ variant: TextVariant.CAPTION, ...props }} />;
}