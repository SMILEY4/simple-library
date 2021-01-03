import * as React from "react";
import "./buttons.css"
import {GradientBorderWrapper} from "_renderer/components/GradientBorderWrapper";
import {classNameOrEmpty} from "_renderer/components/Utilities";


export enum ButtonType {
    DEFAULT = "default",
    INFO = "info",
    SUCCESS = "success",
    ERROR = "error",
    WARN = "warn"
}


interface ButtonBaseProps {
    type: ButtonType,
    children: any
    disabled?: boolean,
    onClick?: () => void,
    className?: string,
    innerClassName?: string
}

function buildButtonBaseProps(children: any, type: ButtonType, disabled?: boolean, onClick?: () => void): ButtonBaseProps {
    return {
        children: children,
        type: type,
        onClick: onClick,
        disabled: disabled
    }
}

function ButtonBase(props: React.PropsWithChildren<ButtonBaseProps>): any {

    const handleClick = () => {
        if (!props.disabled && props.onClick) {
            props.onClick()
        }
    }

    function getDefaultClassNames(): string {
        return "button"
            + (props.disabled ? " button-disabled" : "")
            + (props.className ? " " + props.className : "")
    }


    function getTypedClassNames(): string {
        return "button"
            + (props.disabled ? " button-disabled" : "")
            + (props.innerClassName ? " " + props.innerClassName : "")
    }


    function getWrapperClassName() {
        return "button-wrapper"
            + " button-wrapper-" + props.type
            + (props.disabled ? " button-wrapper-disabled" : "")
            + (props.className ? " " + props.className : "")
    }


    if (props.type === ButtonType.DEFAULT) {
        return (
            <div className={getDefaultClassNames()} onClick={handleClick}>
                {props.children}
            </div>
        )
    } else {
        return (
            <GradientBorderWrapper className={getWrapperClassName()}>
                <div onClick={handleClick} className={getTypedClassNames()}>
                    {props.children}
                </div>
            </GradientBorderWrapper>
        )
    }

}


interface ButtonFilledProps {
    type: ButtonType,
    children: any
    disabled?: boolean,
    onClick?: () => void,
    className?: string,
}

export function ButtonFilled(props: React.PropsWithChildren<ButtonFilledProps>): any {
    const baseProps: ButtonBaseProps = buildButtonBaseProps(props.children, props.type, props.disabled, props.onClick)
    if (props.type === ButtonType.DEFAULT) {
        baseProps.className = "button-filled" + classNameOrEmpty(props.className)
    } else {
        baseProps.className = props.className
        baseProps.innerClassName = "button-filled"
    }
    return <ButtonBase {...baseProps}/>
}


interface ButtonGhostProps {
    type: ButtonType,
    children: any
    disabled?: boolean,
    bg?: number,
    onClick?: () => void,
    className?: string,
}

export function ButtonGhost(props: React.PropsWithChildren<ButtonGhostProps>): any {
    const baseProps: ButtonBaseProps = buildButtonBaseProps(props.children, props.type, props.disabled, props.onClick)
    if (props.type === ButtonType.DEFAULT) {
        baseProps.className = "button-ghost" + classNameOrEmpty(props.className)
    } else {
        baseProps.className = props.className
        baseProps.innerClassName = "button-ghost button-force-bg-" + props.bg
    }
    return <ButtonBase {...baseProps}/>
}


interface ButtonTextProps {
    children: any
    disabled?: boolean,
    onClick?: () => void,
    className?: string,
}

export function ButtonText(props: React.PropsWithChildren<ButtonTextProps>): any {
    const baseProps: ButtonBaseProps = buildButtonBaseProps(props.children, ButtonType.DEFAULT, props.disabled, props.onClick)
    baseProps.className = "button-text" + classNameOrEmpty(props.className)
    return <ButtonBase {...baseProps}/>
}


interface SmallButtonFilledProps {
    children: any
    type: ButtonType
    disabled?: boolean,
    onClick?: () => void,
    className?: string,
}

export function SmallButtonFilled(props: React.PropsWithChildren<SmallButtonFilledProps>): any {
    const baseProps: ButtonFilledProps = {
        children: props.children,
        disabled: props.disabled,
        onClick: props.onClick,
        type: props.type,
        className: "button-small" + classNameOrEmpty(props.className),
    }
    return <ButtonFilled {...baseProps}/>
}


interface SmallButtonGhostProps {
    children: any
    type: ButtonType,
    bg?: number,
    disabled?: boolean,
    onClick?: () => void,
    className?: string,
}

export function SmallButtonGhost(props: React.PropsWithChildren<SmallButtonGhostProps>): any {
    const baseProps: ButtonGhostProps = {
        children: props.children,
        disabled: props.disabled,
        onClick: props.onClick,
        type: props.type,
        bg: props.bg,
        className: "button-small" + classNameOrEmpty(props.className),
    }
    return <ButtonGhost {...baseProps}/>
}


interface SmallButtonTextProps {
    children: any
    disabled?: boolean,
    onClick?: () => void,
    className?: string,
}

export function SmallButtonText(props: React.PropsWithChildren<SmallButtonTextProps>): any {
    const baseProps: ButtonTextProps = {
        children: props.children,
        disabled: props.disabled,
        onClick: props.onClick,
        className: "button-small" + classNameOrEmpty(props.className),
    }
    return <ButtonText {...baseProps}/>
}
