import * as React from "react";
import {BaseProps, concatClasses} from '../../common/common';
import {ModalBase, ModalPosition} from "../modalbase/ModalBase";
import {Card} from "../../base/card/Card";
import {IconType} from "../../base/icon/Icon";
import "./dialog.css"

export interface DialogProps extends BaseProps {
    show?: boolean,
    modalRootId?: string,
    withOverlay?: boolean,
    title?: string,
    icon?: IconType,
    noBodyPadding?: boolean,
    closable?: boolean,
    onClose?: () => void
    onEnter?: () => void,
    onEscape?: () => void,
}

export function Dialog(props: React.PropsWithChildren<DialogProps>) {

    return (
        <ModalBase
            show={props.show}
            withOverlay={props.withOverlay}
            modalRootId={props.modalRootId}
            position={ModalPosition.CENTER}
            className={"dialog-modal"}
            withShadow
        >
            <Card
                title={props.title}
                icon={props.icon}
                noBodyPadding={props.noBodyPadding}
                closable={props.closable}
                onClose={props.onClose}
                onEnter={props.onEnter}
                onEscape={props.onEscape}
                className={concatClasses("dialog", props.className)}
                style={props.style}
                forwardRef={props.forwardRef}
                fitHeight
            >
                {props.children}
            </Card>
        </ModalBase>
    );

}