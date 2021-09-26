import React, {ReactElement} from "react";
import "./keyValuePair.css";
import {Label} from "../../base/label/Label";
import {orDefault} from "../../utils/common";

interface KeyValuePairProps {
    keyValue: string,
    keySize?: number,
    styleType?: "focus-key" | "focus-value",
    modified?: boolean,
    onContextMenu?: (event: React.MouseEvent) => void,
    showOverflow?: boolean,
}

export function KeyValuePair(props: React.PropsWithChildren<KeyValuePairProps>): React.ReactElement {

    return (
        <div className="kv-pair " onContextMenu={props.onContextMenu}>

            <div className="kv-pair-key" style={{minWidth: orDefault(props.keySize, 50) + "%"}}>
                {renderKeyLabel()}
            </div>

            <div
                className={"kv-pair-value" + (props.showOverflow === true ? " kv-pair-value-show-overflow" : "")}
                style={{minWidth: orDefault(100 - props.keySize, 50) + "%"}}>
                {props.children}
            </div>

        </div>
    );

    function renderKeyLabel(): ReactElement {
        return (
            <Label
                bold
                variant={props.modified === true ? "info" : "primary"}
                className={"kv-pair-key-label"}
                disabled={props.styleType === "focus-value" && !props.modified}
                overflow="nowrap-hidden"
            >
                {props.keyValue}
            </Label>
        );
    }
}
