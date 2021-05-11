import {AlignCross, BaseProps, concatClasses, Size, Type, Variant} from "../../common/common";
import * as React from "react";
import {ReactElement} from "react";
import {Pane} from "../../base/pane/Pane";
import {getFillDefault, getOutline, STATIC_PANE_CONFIG} from "../../base/pane/paneConfig";
import {HBox, VBox} from "../../layout/box/Box";
import {Icon, IconType} from "../../base/icon/Icon";
import {CaptionText, H4Text} from "../../base/text/Text";
import "./notification.css"
import {Button} from "../../input/button/Button";

export interface NotificationProps extends BaseProps {
    type: Type,
    icon?: IconType
    title?: string,
    caption?: string,
    closable?: boolean,
    onClose?: () => void
}


export function Notification(props: React.PropsWithChildren<NotificationProps>): ReactElement {
    return (
        <Pane
            outline={getOutline(STATIC_PANE_CONFIG, Variant.SOLID, props.type, false)}
            fillDefault={getFillDefault(STATIC_PANE_CONFIG, Variant.GHOST, props.type)}
            style={props.style}
            className={getClassName()}
            forwardRef={props.forwardRef}
        >
            <HBox padding={Size.S_0_75} spacing={Size.S_0_5} alignCross={AlignCross.START}>
                {renderIcon()}
                <VBox spacing={Size.S_0_25} alignCross={AlignCross.START}>
                    {renderTitle()}
                    {renderContent()}
                    {renderCaption()}
                </VBox>
                {renderCloseButton()}
            </HBox>
        </Pane>
    );

    function renderIcon(): React.ReactElement | null {
        return props.icon
            ? <Icon type={props.icon} size={Size.S_1} className={"notification-icon"}/>
            : null;
    }

    function renderTitle(): React.ReactElement | null {
        return props.title
            ? <H4Text className="notification-title">{props.title}</H4Text>
            : null;
    }

    function renderContent(): React.ReactElement | null {
        return <div className={"notification-content"}>{props.children}</div>;
    }

    function renderCaption(): React.ReactElement | null {
        return props.caption
            ? <CaptionText italic className="notification-caption">{props.caption}</CaptionText>
            : null;
    }

    function renderCloseButton() {
        if (props.closable) {
            return (
                <Button type={props.type} variant={Variant.GHOST} square onAction={props.onClose}>
                    <Icon type={IconType.CLOSE}/>
                </Button>
            );
        } else {
            return null;
        }
    }

    function getClassName(): string {
        return concatClasses(
            "notification",
            props.className
        )
    }

}
