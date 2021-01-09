import * as React from "react";
import {GradientBorderBox} from "_renderer/components/gradientborder/GradientBorderBox";
import {HighlightType} from "_renderer/components/Common";
import {CgClose} from "react-icons/all";
import "./notification.css"

export interface NotificationProps {
    gradient: HighlightType,
    icon?: any,
    title?: string,
    caption?: string
    withCloseButton?: boolean,
    onClose?: () => {}
}

export function Notification(props: React.PropsWithChildren<NotificationProps>): React.ReactElement {

    function renderIcon(): React.ReactElement | null {
        return props.icon
            ? <div className="notification-icon">{props.icon}</div>
            : null
    }


    function renderTitle(): React.ReactElement | null {
        return props.title
            ? <h4 className="notification-title">{props.title}</h4>
            : null
    }


    function renderContent(): React.ReactElement | null {
        return <div className={"notification-content"}>{props.children}</div>
    }


    function renderCaption(): React.ReactElement | null {
        return props.caption
            ? <div className="notification-caption">{props.caption}</div>
            : null
    }

    function renderCloseButton() {
        if (props.withCloseButton) { // TODO: make real/generic icon-button
            return <CgClose className="notification-close" onClick={() => props.onClose ? props.onClose() : null}/>
        } else {
            return null
        }
    }

    return (
        <GradientBorderBox gradient={props.gradient}
                           className={"notification-wrapper with-shadow-1"}
                           innerClassName={"notification-wrapper-content"}>
            <div className={"notification"}>
                {renderIcon()}
                <div className={"notification-body"}>
                    {renderTitle()}
                    {renderContent()}
                    {renderCaption()}
                </div>
                {renderCloseButton()}
            </div>

        </GradientBorderBox>
    )
}
