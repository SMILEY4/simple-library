import React from "react";
import "./simpleMetadataEntry.css"
import {Label} from "../../../../../components/base/label/Label";
import {Badge} from "../../../../../components/misc/badge/Badge";

interface SimpleMetadataEntryProps {
    entryKey: string,
    modified?: boolean,
}


export function SimpleMetadataEntry(props: React.PropsWithChildren<SimpleMetadataEntryProps>): React.ReactElement {

    return (
        <div className="metadata-entry">

            <div className="metadata-key">
                {props.modified === true
                    ? (
                        <Badge variant={"info"}>
                            <Label bold className={"metadata-key-label"}>
                                {props.entryKey}
                            </Label>
                        </Badge>
                    )
                    : (
                        <Label bold className={"metadata-key-label"}>
                            {props.entryKey}
                        </Label>
                    )}
            </div>

            <div className="metadata-value">
                {props.children}
            </div>

        </div>
    );
}
