import * as React from "react";
import * as ReactDOM from 'react-dom';
import "./modalbase.css"

interface ModalBaseProps {
    show: boolean,
    withOverlay?: boolean,
    withShadow?: boolean,
    modalRootId?: string
}

export function ModalBase(props: React.PropsWithChildren<ModalBaseProps>): React.ReactElement | null {
    if (!props.show) {
        return null;
    } else {
        const modal = (
            <div className={props.withOverlay === true ? "modal-overlay" : "modal-hidden-overlay"}>
                <div className={"modal" + (props.withShadow === true ? " with-shadow-2" : "")}>
                    {props.children}
                </div>
            </div>
        )
        if (props.modalRootId) {
            const modalRootElement = document.getElementById(props.modalRootId)
            return modalRootElement ? ReactDOM.createPortal(modal, modalRootElement) : null;
        }
        return modal
    }
}
