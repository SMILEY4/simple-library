import {MetadataEntry} from "../../../../../../common/commonModels";
import React from "react";
import {SimpleMetadataEntry} from "./SimpleMetadataEntry";
import {ToggleTextField} from "../../../../../components/input/textfield/ToggleTextField";

interface MetadataListEntryProps {
    entry: MetadataEntry,
    shortName: string,
    onUpdateValue: (prev: string, next: string) => void
}


export function MetadataListEntry(props: React.PropsWithChildren<MetadataListEntryProps>): React.ReactElement {

    return (
        <SimpleMetadataEntry entryKey={props.shortName}>
            <ToggleTextField
                fillWidth
                value={props.entry.value}
                onAccept={handleUpdateValue}
            />
        </SimpleMetadataEntry>
    );

    function handleUpdateValue(value: string): void {
        props.onUpdateValue(props.entry.value, value)
    }

}