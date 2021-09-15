import * as React from "react";
import "./dialog.css"
import {BaseProps} from "../../utils/common";
import {IconType} from "../../base/icon/Icon";
import {ModalBase} from "../modalbase/ModalBase";
import {Card} from "../../layout/card/Card";
import {concatClasses} from "../../utils/common";

export interface DialogProps extends BaseProps {
    show?: boolean,
    modalRootId?: string,
    withOverlay?: boolean,
    title?: string,
    icon?: IconType,
    subtitle?: string,
    noBodyPadding?: boolean,
    closable?: boolean,
    closeOnClickOutside?: boolean,
    onClose?: () => void
}

export function Dialog(props: React.PropsWithChildren<DialogProps>) {

    return (
        <ModalBase
            show={props.show}
            withOverlay={props.withOverlay}
            modalRootId={props.modalRootId}
            position="center"
            className="dialog-modal"
            withShadow
            onClickOutside={handleClickOutside}
        >
            <Card
                title={props.title}
                icon={props.icon}
                subtitle={props.subtitle}
                noBodyPadding={props.noBodyPadding}
                closable={props.closable}
                onClose={props.onClose}
                className={concatClasses(props.className, "dialog")}
                style={props.style}
                forwardRef={props.forwardRef}
                fitHeight
            >
                {props.children}
            </Card>
        </ModalBase>
    );

    function handleClickOutside() {
        if(props.closeOnClickOutside && props.onClose) {
            props.onClose();
        }
    }

}
