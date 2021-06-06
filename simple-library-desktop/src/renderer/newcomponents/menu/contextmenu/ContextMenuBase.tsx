import * as React from 'react';
import {MutableRefObject, ReactElement} from 'react';
import {BaseProps} from "../../utils/common";
import {addPropsToChildren, concatClasses} from "../../../components/common/common";
import * as ReactDOM from "react-dom";

export interface ContextMenuBaseProps extends BaseProps {
	modalRootId: string,
	show: boolean,
	pageX: number,
	pageY: number,
	menuRef: MutableRefObject<any>,
	onOpenMenu?: () => void,
	onAction?: (itemId: string) => void,
}

export function ContextMenuBase(props: React.PropsWithChildren<ContextMenuBaseProps>): ReactElement {


	if (!props.show) {
		return null;

	} else {
		props.onOpenMenu && props.onOpenMenu();
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
			<div
				className={concatClasses(props.className, "context-menu")}
				style={{
					left: props.pageX + "px",
					top: props.pageY + "px",
					...props.style,
				}}
				ref={props.menuRef}
			>
				{getModifiedChildren()}
			</div>
		);
	}

	function getModifiedChildren(): ReactElement[] {
		return addPropsToChildren(
			props.children,
			(prevProps: any) => ({...prevProps, __onActionInternal: handleMenuItemAction}),
		);
	}

	function handleMenuItemAction(itemId: string) {
		if (props.onAction) {
			props.onAction(itemId);
		}
	}

}