import {AlignCross, AlignMain, BaseProps, ColorType, concatClasses, Size, Type, Variant} from "../../common/common";
import * as React from "react";
import {ReactElement} from "react";
import {Pane} from "../pane/Pane";
import {HBox, VBox} from "../../layout/box/Box";
import {H3Text} from "../text/Text";
import "./card.css"
import {Button} from "../../input/button/Button";
import {Icon, IconType} from "../icon/Icon";
import {getChildrenOfSlot} from "../slot/Slot";
import {Label} from "../label/Label";
import {useKeyListener} from "../../common/commonHooks";


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
        <Pane
            className={concatClasses("card", props.className)}
            outline={ColorType.BASE_0}
            fillDefault={ColorType.BACKGROUND_1}
            forwardRef={props.forwardRef}
            style={props.style}
        >
            <VBox alignCross={AlignCross.STRETCH}>
                {renderHeader()}
                {renderBody()}
                {renderFooter()}
            </VBox>
        </Pane>
    );


    function renderHeader(): ReactElement {
        if (props.title) {
            return (
                <HBox
                    className={"card-header"}
                    alignMain={AlignMain.SPACE_BETWEEN}
                    alignCross={AlignCross.CENTER}
                    spacing={Size.S_1_5}
                    padding={Size.S_0_75}
                >
                    <Label spacing={Size.S_0_5}>
                        {props.icon && (<Icon type={props.icon} size={Size.S_1}/>)}
                        <H3Text>{props.title}</H3Text>
                    </Label>
                    {props.closable === true
                        ? (
                            <Button type={Type.DEFAULT} variant={Variant.GHOST} square onAction={props.onClose}>
                                <Icon type={IconType.CLOSE}/>
                            </Button>
                        )
                        : null}
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
                        overflowY: props.fitHeight ? "auto" : undefined
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
                    alignMain={AlignMain.END}
                    alignCross={AlignCross.CENTER}
                    spacing={Size.S_0_5}
                    padding={Size.S_0_75}
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
