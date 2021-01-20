import * as React from "react";
import "./dialog.css"
import {CgClose} from "react-icons/all";
import { callSafe, HighlightType } from '../common';
import { ButtonText } from '../buttons/Buttons';
import { ModalBase } from './ModalBase';
import { GradientBorderBox } from '../gradientborder/GradientBorderBox';

interface DialogProps {
    show: boolean,

    title: string,
    icon?: any,

    footerActions?: any,

    withCloseButton?: boolean,
    onClose?: () => void,

    highlight?: HighlightType

    modalRootId?: string
}

function DialogHeader(props: React.PropsWithChildren<DialogProps>): React.ReactElement {
    return (
        <div className={"dialog-header"}>
            {
                props.icon
                    ? <div className={"dialog-icon"}>{props.icon}</div>
                    : null
            }
            <h4 className={"dialog-title"}>
                {props.title}
            </h4>
            {
                props.withCloseButton
                    ? <ButtonText onClick={() => callSafe(props.onClose)}><CgClose/></ButtonText>
                    : null
            }
        </div>
    )
}

function DialogBody(props: React.PropsWithChildren<DialogProps>): React.ReactElement {
    return (
        <div className={"dialog-body"}>
            {props.children}
        </div>
    )
}


function DialogFooter(props: React.PropsWithChildren<DialogProps>): React.ReactElement {
    return (
        <div className={"dialog-footer"}>
            {props.footerActions}
        </div>
    )
}


export function Dialog(props: React.PropsWithChildren<DialogProps>): React.ReactElement | null {
    if (!props.show) {
        return null;
    } else {
        return (
            <ModalBase show={props.show} withOverlay={true} withShadow={true} modalRootId={props.modalRootId}>
                <GradientBorderBox gradient={props.highlight ? props.highlight : HighlightType.NONE} innerClassName={"dialog-base"}>
                    <DialogHeader {...props}/>
                    <DialogBody {...props}/>
                    <DialogFooter {...props}/>
                </GradientBorderBox>
            </ModalBase>
        )
    }
}


