import React from "react";
import {ToggleTextField} from "../../../../../components/input/textfield/ToggleTextField";
import {AttributeDTO} from "../../../../../../common/events/dtoModels";
import {KeyValuePair} from "../../../../../components/misc/keyvaluepair/KeyValuePair";

interface MetadataListEntryProps {
    entry: AttributeDTO,
    shortName: string,
    onUpdateValue: (prev: string, next: string) => void
}


export function MetadataListEntry(props: React.PropsWithChildren<MetadataListEntryProps>): React.ReactElement {

    return (
        <KeyValuePair keyValue={props.shortName} styleType="focus-key">
            <ToggleTextField
                fillWidth
                value={props.entry.value}
                onAccept={handleUpdateValue}
            />
        </KeyValuePair>
    );

    function handleUpdateValue(value: string): void {
        props.onUpdateValue(props.entry.value, value)
    }

}
