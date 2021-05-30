import {BaseProps} from "../../common";
import React, {ReactElement, useState} from "react";
import {Icon, IconType} from "../../base/icon/Icon";
import {Label} from "../../base/label/Label";
import "./treeNode.css"
import {addPropsToChildren, orDefault} from "../../../components/common/common";
import {TreeLeaf} from "./TreeLeaf";

export interface TreeNodeProps extends BaseProps {
    title: string,
    icon?: IconType,
    root?: boolean,
    __depth?: number
}

export function TreeNode(props: React.PropsWithChildren<TreeNodeProps>): ReactElement {

    const [show, setShow] = useState(false);

    if (props.root) {
        return (
            <div className="tree-node-wrapper">
                {renderNode()}
                {show && getModifiedChildren()}
            </div>
        )
    } else {
        return (
            <>
                {renderNode()}
                {show && getModifiedChildren()}
            </>
        )
    }

    function renderNode(): ReactElement {
        return (
            <div
                className={"tree-node"}
                onClick={onToggle}
                style={{
                    paddingLeft: "calc(var(--s-1) * " + props.__depth + ")"
                }}
            >
                <div className={"tree-node-icon-wrapper"}>
                    {hasContent() && (
                        <Icon type={show ? IconType.CHEVRON_DOWN : IconType.CHEVRON_RIGHT} size="0-75"/>
                    )}
                </div>
                <Label noSelect overflow="nowrap-hidden">
                    {props.icon && <Icon type={props.icon}/>}
                    {props.title}
                </Label>
            </div>
        );
    }

    function hasContent(): boolean {
        return !!props.children;
    }

    function getModifiedChildren(): ReactElement[] {
        const depthChildren = orDefault(props.__depth, 0) + 1
        return addPropsToChildren(
            props.children,
            prevProps => ({...prevProps, __depth: depthChildren}),
            child => child.type === TreeNode || child.type === TreeLeaf
        )
    }

    function onToggle() {
        if (hasContent()) {
            setShow(!show);
        }
    }

}
