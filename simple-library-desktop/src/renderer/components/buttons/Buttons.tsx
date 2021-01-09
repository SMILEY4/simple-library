import * as React from "react";
import {ReactElement} from "react";
import {GradientBorderWrapper} from "_renderer/components/gradientborder/GradientBorderWrapper";
import {classNameOrEmpty, HighlightType, StyleType, toStringOrDefault} from "_renderer/components/Common";
import "./buttons.css"


interface ButtonProps {
    style: StyleType,
    children: any
    highlight?: HighlightType,
    small?: boolean,
    disabled?: boolean,
    onClick?: () => void,
    className?: string,
    innerClassName?: string
}

interface GenericButtonProps extends Omit<ButtonProps, 'style'> {
}

interface GhostButtonProps extends Omit<ButtonProps, 'style'> {
    bg: string
}

export function Button(props: React.PropsWithChildren<ButtonProps>): ReactElement {

    const handleClick = () => {
        if (!props.disabled && props.onClick) {
            props.onClick()
        }
    }

    function getWrapperClassNames() {
        return "button-wrapper"
            + " button-wrapper-" + toStringOrDefault(props.highlight, HighlightType.DEFAULT)
            + " button-wrapper-" + props.style
            + (props.disabled ? " button-wrapper-disabled" : "")
            + classNameOrEmpty(props.className)
    }

    function getInnerClassNames(): string {
        return "button"
            + " button-" + props.style
            + (props.small ? " button-small" : "")
            + (props.disabled ? " button-disabled" : "")
            + classNameOrEmpty(props.innerClassName)
    }

    return (
        <GradientBorderWrapper className={getWrapperClassNames()}>
            <div onClick={handleClick} className={getInnerClassNames()}>
                {props.children}
            </div>
        </GradientBorderWrapper>
    )

}


export function ButtonFilled(props: React.PropsWithChildren<GenericButtonProps>): ReactElement {
    const baseProps: ButtonProps = {
        style: StyleType.FILLED,
        ...props
    }
    return <Button {...baseProps}/>
}


export function ButtonGhost(props: React.PropsWithChildren<GhostButtonProps>): ReactElement {
    const baseProps: ButtonProps = {
        style: props.bg === "0" ? StyleType.GHOST_BG0 : StyleType.GHOST_BG1,
        ...props
    }
    return <Button {...baseProps}/>
}

export function ButtonText(props: React.PropsWithChildren<GenericButtonProps>): ReactElement {
    const baseProps: ButtonProps = {
        style: StyleType.TEXT,
        ...props
    }
    return <Button {...baseProps}/>
}