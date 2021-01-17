import * as React from "react";
import * as ReactDOM from 'react-dom';
import "./modalbase.css"
import { classNameOrEmpty } from '../common';

export enum ModalPosition {
    CENTER = "center",
    BOTTOM = "bottom"
}

interface ModalBaseProps {
    show: boolean,
    position?: ModalPosition,
    withOverlay?: boolean,
    withShadow?: boolean,
    modalRootId?: string,
    className?: string
}

export class ModalBase extends React.Component<React.PropsWithChildren<ModalBaseProps>> {
    render() {
        if (!this.props.show) {
            return null;
        } else {
            const modal = (
                <div className={(this.props.withOverlay === true ? "modal-overlay" : "modal-hidden-overlay") + (this.props.position ? " modal-overlay-" + this.props.position : " modal-overlay-" + ModalPosition.CENTER)}>
                    <div className={"modal" + (this.props.withShadow === true ? " with-shadow-2" : "") + classNameOrEmpty(this.props.className)}>
                        {this.props.children}
                    </div>
                </div>
            )
            if (this.props.modalRootId) {
                if (!document.getElementById(this.props.modalRootId)) {
                    setTimeout(() => {
                        // if the id is not yet available, we need to wait for react to finish rendering and try again
                        this.forceUpdate()
                    }, 0)
                }
                const modalRootElement = document.getElementById(this.props.modalRootId)
                return modalRootElement ? ReactDOM.createPortal(modal, modalRootElement) : null;
            }
            return modal
        }
    }
}
