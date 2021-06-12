import {concatClasses, mapOrDefault,} from "../../utils/common";
import * as React from "react";
import {ReactElement} from "react";
import {BaseProps} from "../../utils/common";
import {Icon, IconType} from "../../base/icon/Icon";
import {HBox, VBox} from "../../layout/box/Box";
import {Label} from "../../base/label/Label";
import {Button} from "../../buttons/button/Button";
import "./notification.css"

export interface NotificationProps extends BaseProps {
	type?: "info" | "success" | "warn" | "error",
	icon?: IconType
	title?: string,
	caption?: string,
	closable?: boolean,
	onClose?: () => void
}


export function Notification(props: React.PropsWithChildren<NotificationProps>): ReactElement {

	return (
		<div
			className={concatClasses(
				props.className,
				"notification",
				mapOrDefault(props.type, "info", type => "notification-" + type)
			)}
			style={props.style}
			ref={props.forwardRef}
		>
			<HBox padding={props.title ? "0-75" : "0-5"} spacing="0-75" alignCross="center">
				{props.title ? null : renderIcon()}
				<VBox spacing="0-5" alignCross="start">
					{renderTitle()}
					{renderContent()}
					{renderCaption()}
				</VBox>
				{renderCloseButton()}
			</HBox>
		</div>
	);

	function renderIcon(): ReactElement | null {
		return props.icon
			? <Icon type={props.icon} size="1" className={"notification-icon"}/>
			: null;
	}

	function renderTitle(): React.ReactElement | null {
		return props.title
			? (
				<Label type="header-3" className="notification-title">
					{props.icon ? <Icon type={props.icon} size="1" className={"notification-icon"}/> : null}
					{props.title}
				</Label>
			) : null;
	}

	function renderContent(): React.ReactElement | null {
		return <div className={"notification-content"}>{props.children}</div>;
	}

	function renderCaption(): React.ReactElement | null {
		return props.caption
			? <Label type="caption" italic className="notification-caption">{props.caption}</Label>
			: null;
	}

	function renderCloseButton() {
		if (props.closable) {
			return (
				<Button square ghost onAction={props.onClose} className="notification-close">
					<Icon type={IconType.CLOSE}/>
				</Button>
			);
		} else {
			return null;
		}
	}

}
