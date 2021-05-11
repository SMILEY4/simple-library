import * as React from "react";
import {MutableRefObject, ReactElement} from "react";
import * as ReactDOM from 'react-dom';
import "./modalBase.css";
import {BaseProps, concatClasses, mergeRefs} from '../../common/common';
import {useClickOutside} from "../../common/commonHooks";

export enum ModalPosition {
    CENTER = "center",
    BOTTOM = "bottom"
}

export interface ModalBaseProps extends BaseProps {
    show?: boolean,
    position?: ModalPosition,
    withOverlay?: boolean,
    withShadow?: boolean,
    modalRootId?: string,
    onClickOutside?: () => void
}

type ModalBaseReactProps = React.PropsWithChildren<ModalBaseProps>;


export function ModalBase(props: ModalBaseReactProps) {

    const targetRef: MutableRefObject<any> = useClickOutside(handleClickOutside);

    if (props.show === false) {
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

    function renderElement(props: ModalBaseReactProps): ReactElement {
        return (
            <div className={getOverlayClassNames(props)}>
                <div className={getClassNames(props)} style={props.style} ref={mergeRefs(targetRef, props.forwardRef)}>
                    {props.children}
                </div>
            </div>
        );
    }

    function getOverlayClassNames(props: ModalBaseReactProps): string {
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

    function handleClickOutside(): void {
        props.onClickOutside && props.onClickOutside();
    }

}