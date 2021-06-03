import "./splitpane.css";
import * as React from 'react';
import {MutableRefObject, ReactElement, useEffect, useRef} from 'react';
import {Divider} from './Divider';
import {useSplitPane} from './useSplitPane';
import {SplitPanePanel} from "./SplitPanePanel";
import {BaseProps} from "../../utils/common";
import {concatClasses, getIf, getReactElements, map} from "../../../components/common/common";
import {getChildOfSlot} from "../../../components/base/slot/Slot";

export const SLOT_DIVIDER = "divider";

interface SplitPaneProps extends BaseProps {
	mode: "vertical" | "horizontal",
	primaryCollapsed?: boolean,
	primaryAsPercentage?: boolean,
	onResize?: (size: number) => void;
	fill?: boolean,
}

interface SplitPaneContentData {
	children: ReactElement[],
	refFirstPanel: MutableRefObject<any>,
	refSecondPanel: MutableRefObject<any>,
	firstIsPrimary: boolean
}

export function SplitPane(props: React.PropsWithChildren<SplitPaneProps>): ReactElement {

	const splitPaneRef: MutableRefObject<any> = useRef(null);
	const content: SplitPaneContentData = buildContent();
	const {
		resize,
		expandOrCollapse
	} = useSplitPane(props.mode, props.primaryAsPercentage, content.refFirstPanel, content.refSecondPanel, content.firstIsPrimary);

	useEffect(() => handleResize(0, true))
	useEffect(() => expandOrCollapse(props.primaryCollapsed), [props.primaryCollapsed])

	return (
		<div
			{...props}
			className={concatClasses(
				props.className,
				'split-pane',
				map(props.mode, mode => "split-pane-" + mode),
				getIf(props.fill, "fill-parent")
			)}
			ref={splitPaneRef}
		>
			{content.children}
		</div>
	);


	function buildContent(): SplitPaneContentData {

		const content: ReactElement[] = [];
		const refFirstPanel: MutableRefObject<any> = useRef(null);
		const refSecondPanel: MutableRefObject<any> = useRef(null);

		const childrenPanels: ReactElement[] = getPanelChildren();
		const firstIsPrimary: boolean = childrenPanels[1].props.primary !== true;

		content.push(enrichPanel(childrenPanels[0], refFirstPanel, firstIsPrimary));
		content.push(buildDivider());
		content.push(enrichPanel(childrenPanels[1], refSecondPanel, !firstIsPrimary));

		return {
			children: content,
			refFirstPanel: refFirstPanel,
			refSecondPanel: refSecondPanel,
			firstIsPrimary: firstIsPrimary
		};
	}

	function getPanelChildren() {
		const childrenPanels: ReactElement[] = getReactElements(props.children)
			.filter(child => child.type === SplitPanePanel);
		if (childrenPanels.length !== 2) {
			throw("SplitPane must have exactly two children!");
		} else {
			return childrenPanels;
		}
	}


	function enrichPanel(panel: ReactElement, ref: MutableRefObject<any>, isPrimary: boolean) {
		return React.cloneElement(panel, {
			...panel.props,
			forwardRef: ref,
			primary: isPrimary,
			__mode: props.mode
		});
	}

	function buildDivider() {
		const dividerTemplate: ReactElement | undefined = getChildOfSlot(props.children, SLOT_DIVIDER)
		if (dividerTemplate) {
			return React.cloneElement(dividerTemplate, {
				...dividerTemplate.props,
				__mode: props.mode,
				__onDrag: handleResize,
				__parentRef: splitPaneRef
			})
		} else {
			return (
				<Divider __parentRef={splitPaneRef} __mode={props.mode} __onDrag={handleResize}/>
			);
		}
	}

	function handleResize(diff: number, muteListeners?: boolean): void {
		const newSizePrimary: number = resize(diff);
		if (muteListeners !== true) {
			props.onResize && props.onResize(newSizePrimary)
		}
	}

}


interface VSplitPaneProps extends Omit<SplitPaneProps, 'mode'> {

}

export function VSplitPane(props: React.PropsWithChildren<VSplitPaneProps>): ReactElement {
	const baseProps: SplitPaneProps = {
		mode: "vertical",
		...props,
	};
	return (
		<SplitPane {...baseProps} />
	);
}

interface HSplitPaneProps extends Omit<SplitPaneProps, 'mode'> {

}

export function HSplitPane(props: React.PropsWithChildren<HSplitPaneProps>): ReactElement {
	const baseProps: SplitPaneProps = {
		mode: "horizontal",
		...props,
	};
	return (
		<SplitPane {...baseProps} />
	);
}
