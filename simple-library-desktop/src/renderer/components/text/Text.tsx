import * as React from "react";
import {ReactElement} from "react";
import {classNameOrEmpty} from "_renderer/components/Common";

export enum TextVariant {
    H1 = "h1",
    H2 = "h2",
    H3 = "h3",
    H4 = "h4",
    H5 = "h5",
    BODY = "body",
    CAPTION = "caption"
}


interface TextProps {
    variant: TextVariant,
    className?: string
}


export function Text(props: React.PropsWithChildren<TextProps>): ReactElement | null {
    const className = props.variant + classNameOrEmpty(props.className)
    switch (props.variant) {
        case TextVariant.H1:
            return <h1 className={className}>{props.children}</h1>
        case TextVariant.H2:
            return <h2 className={className}>{props.children}</h2>
        case TextVariant.H3:
            return <h3 className={className}>{props.children}</h3>
        case TextVariant.H4:
            return <h4 className={className}>{props.children}</h4>
        case TextVariant.H5:
            return <h5 className={className}>{props.children}</h5>
        case TextVariant.BODY:
            return <div className={className}>{props.children}</div>
        case TextVariant.CAPTION:
            return <div className={className}>{props.children}</div>
        default: {
            return null
        }
    }
}