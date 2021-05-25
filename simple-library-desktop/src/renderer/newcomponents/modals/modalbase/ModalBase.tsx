import * as React from "react";
import {MutableRefObject, ReactElement} from "react";
import * as ReactDOM from 'react-dom';
import "./modalBase.css";
import {BaseProps} from "../../common";
import {useClickOutside, useEventListener} from "../../../components/common/commonHooks";
import {concatClasses, mapOrDefault, mergeRefs} from "../../../components/common/common";

export interface ModalBaseProps extends BaseProps {
    show?: boolean,
    modalRootId?: string,
    position?: "center" | "bottom",
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
                        pointerEvents: props.ignorePointerEvents ? "none" : undefined,
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
            mapOrDefault(props.position, "center", position => "modal-overlay-" + position)
        );
    }

    function getClassNames(): string {
        return concatClasses(
            props.className,
            "modal",
            (props.withShadow === true ? " with-shadow-2" : ""),
        );
    }

    function handleClickOutside(): void {
        props.onClickOutside && props.onClickOutside();
    }

}
