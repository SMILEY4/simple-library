import * as React from "react";
import { ReactElement } from "react";
import * as ReactDOM from 'react-dom';
import "./modalBase.css";
import { classNameOrEmpty, concatClasses } from '../../common/common';

export enum ModalPosition {
    CENTER = "center",
    BOTTOM = "bottom"
}

export interface ModalBaseProps {
    show: boolean,
    position?: ModalPosition,
    withOverlay?: boolean,
    withShadow?: boolean,
    modalRootId?: string,
    className?: string
}

type ModalBaseReactProps = React.PropsWithChildren<ModalBaseProps>;


export function ModalBase(props: ModalBaseReactProps) {

    function getClassNamesOverlay(props: ModalBaseReactProps): string {
        return concatClasses(
            (props.withOverlay === true ? "modal-overlay" : "modal-hidden-overlay"),
            (props.position ? " modal-overlay-" + props.position : " modal-overlay-" + ModalPosition.CENTER),
        );
    }

    function getClassNames(props: ModalBaseReactProps): string {
        return concatClasses(
            "modal",
            (props.withShadow === true ? " with-shadow-2" : ""),
            props.className,
        );
    }

    function renderElement(props: ModalBaseReactProps): ReactElement {
        return (
            <div className={getClassNamesOverlay(props)}>
                <div className={getClassNames(props)}>
                    {props.children}
                </div>
            </div>
        );
    }

    if (!props.show) {
        return null;
    } else {
        if (props.modalRootId) {
            if (!document.getElementById(props.modalRootId)) {
                setTimeout(() => {
                    // if the id is not yet available, we need to wait for react to finish rendering and try again
                    this.forceUpdate();
                }, 0);
            }
            const modalRootElement = document.getElementById(props.modalRootId);
            return modalRootElement ? ReactDOM.createPortal(renderElement(props), modalRootElement) : null;
        } else {
            return renderElement(props);
        }
    }

}