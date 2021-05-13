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
    modalRootId?: string,
    position?: ModalPosition,
    withOverlay?: boolean,
    withShadow?: boolean,
    showOverflow?: boolean,
    ignorePointerEvents?: boolean,
    onClickOutside?: () => void
}

export function ModalBase(props: React.PropsWithChildren<ModalBaseProps>) {

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
            return modalRootElement ? ReactDOM.createPortal(renderElement(), modalRootElement) : null;
        } else {
            return renderElement();
        }
    }

    function renderElement(): ReactElement {
        return (
            <div className={getOverlayClassNames()}>
                <div
                    className={getClassNames()}
                    style={{
                        ...props.style,
                        pointerEvents: props.ignorePointerEvents ? "none": undefined,
                        overflow: props.showOverflow === true ? "visible" : undefined
                    }}
                    ref={mergeRefs(targetRef, props.forwardRef)}
                >
                    {props.children}
                </div>
            </div>
        );
    }

    function getOverlayClassNames(): string {
        return concatClasses(
            (props.withOverlay === true ? "modal-overlay" : "modal-hidden-overlay"),
            (props.position ? " modal-overlay-" + props.position : " modal-overlay-" + ModalPosition.CENTER),
        );
    }

    function getClassNames(): string {
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
