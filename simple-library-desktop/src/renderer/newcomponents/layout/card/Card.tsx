import * as React from "react";
import {ReactElement} from "react";
import "./card.css"
import {BaseProps} from "../../common";
import {Icon, IconType} from "../../base/icon/Icon";
import {concatClasses} from "../../../components/common/common";
import {HBox, VBox} from "../box/Box";
import {getChildrenOfSlot} from "../../base/slot/Slot";
import {Label} from "../../base/label/Label";
import {Button} from "../../buttons/button/Button";
import {useKeyListener} from "../../../components/common/commonHooks";


export interface CardProps extends BaseProps {
    title?: string,
    icon?: IconType,
    noBodyPadding?: boolean,
    fitHeight?: boolean,
    closable?: boolean,
    onClose?: () => void
    onEnter?: () => void,
    onEscape?: () => void,
}

export function Card(props: React.PropsWithChildren<CardProps>) {

    useKeyListener("Enter", (event: KeyboardEvent) => {
        // @ts-ignore
        if (props.onEnter && event.target.tagName === "BODY") {
            event.preventDefault();
            props.onEnter();
        }
    })

    useKeyListener("Escape", (event: KeyboardEvent) => {
        // @ts-ignore
        if (props.onEscape && event.target.tagName === "BODY") {
            event.preventDefault();
            props.onEscape();
        }
    })

    return (
        <div
            className={concatClasses("card", props.className)}
            style={props.style}
            ref={props.forwardRef}
        >
            <VBox alignCross="stretch">
                {renderHeader()}
                {renderBody()}
                {renderFooter()}
            </VBox>
        </div>
    );


    function renderHeader(): ReactElement {
        if (props.title) {
            return (
                <HBox
                    className={"card-header"}
                    alignMain="space-between"
                    alignCross="center"
                    spacing="1-5"
                    padding="0-75"
                >
                    <Label type="header-3">
                        {props.icon && (<Icon type={props.icon}/>)}
                        {props.title}
                    </Label>
                    {props.closable === true
                        ? (
                            <Button square ghost onAction={props.onClose}>
                                <Icon type={IconType.CLOSE}/>
                            </Button>
                        ) : null}
                </HBox>
            );
        } else {
            return null;
        }
    }


    function renderBody(): ReactElement {
        const elements: ReactElement[] = getBodyElements();
        if (elements && elements.length > 0) {
            return (
                <div
                    className={"card-body"}
                    style={{
                        padding: props.noBodyPadding === true ? undefined : "var(--s-0-75)",
                        flexShrink: props.fitHeight ? 1 : undefined,
                        overflowY: props.fitHeight ? "auto" : undefined,
                    }}
                >
                    {elements}
                </div>
            );
        } else {
            return null;
        }
    }


    function renderFooter(): ReactElement {
        const elements: ReactElement[] = getFooterElements();
        if (elements && elements.length > 0) {
            return (
                <HBox
                    className={"card-footer"}
                    alignMain="end"
                    alignCross="center"
                    spacing="0-5"
                    padding="0-75"
                >
                    {elements}
                </HBox>
            );
        } else {
            return null;
        }
    }


    function getBodyElements(): ReactElement[] {
        return getChildrenOfSlot(props.children, "body");
    }


    function getFooterElements(): ReactElement[] {
        return getChildrenOfSlot(props.children, "footer");
    }

}