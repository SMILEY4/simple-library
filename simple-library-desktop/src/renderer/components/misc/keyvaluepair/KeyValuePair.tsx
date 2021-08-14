import React from "react";
import "./keyValuePair.css"
import {Badge} from "../badge/Badge";
import {Label} from "../../base/label/Label";
import {orDefault} from "../../utils/common";

interface KeyValuePairProps {
    keyValue: string,
    keySize?: number,
    keyDisabled?: boolean,
    modified?: boolean,
}

export function KeyValuePair(props: React.PropsWithChildren<KeyValuePairProps>): React.ReactElement {

    return (
        <div className="kv-pair">

            <div className="kv-pair-key" style={{minWidth: orDefault(props.keySize, 50) + "%"}}>
                {props.modified === true
                    ? (
                        <Badge variant={"info"}>
                            <Label bold className={"kv-pair-key-label"} disabled={props.keyDisabled}>
                                {props.keyValue}
                            </Label>
                        </Badge>
                    )
                    : (
                        <Label bold className={"kv-pair-key-label"} disabled={props.keyDisabled}>
                            {props.keyValue}
                        </Label>
                    )}
            </div>

            <div className="kv-pair-value" style={{minWidth: orDefault(100-props.keySize, 50) + "%"}}>
                {props.children}
            </div>

        </div>
    );
}
