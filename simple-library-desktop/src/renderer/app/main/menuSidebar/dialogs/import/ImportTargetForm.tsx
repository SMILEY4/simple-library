import * as React from 'react';
import { ReactElement } from 'react';
import { AlignCross, AlignMain, Size, Variant } from '../../../../../components/common';
import { ImportTargetAction } from '../../../../../../common/commonModels';
import { VBox } from '../../../../../components/layout/Box';
import { DirectorySelectionField } from '../../../../../components/inputfield/DirectorySelectionField';
import { ChoiceBox } from '../../../../../components/choicebox/ChoiceBox';

export interface ImportTargetFormProps {
    action: ImportTargetAction,
    onSelectAction: (action: ImportTargetAction) => void,
    targetDir: string,
    onSelectTargetDir: () => void,
    targetDirInvalid: boolean
}

export function ImportTargetForm(props: React.PropsWithChildren<ImportTargetFormProps>): ReactElement {

    function targetActionToDisplayString(action: ImportTargetAction): string {
        switch (action) {
            case ImportTargetAction.KEEP:
                return "Keep in directory";
            case ImportTargetAction.MOVE:
                return "Move to target directory";
            case ImportTargetAction.COPY:
                return "Copy to target directory";
        }
    }

    function displayStringToTargetAction(displayString: string): ImportTargetAction {
        switch (displayString) {
            case "Keep in directory":
                return ImportTargetAction.KEEP;
            case "Move to target directory":
                return ImportTargetAction.MOVE;
            case "Copy to target directory":
                return ImportTargetAction.COPY;
        }

    }

    return (
        <>

            <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75} padding={Size.S_1} withBorder>

                <div style={{
                    display: "flex",
                    justifyContent: "flex-start",
                }}>
                    <ChoiceBox variant={Variant.OUTLINE}
                               autoWidth={true}
                               items={[
                                   targetActionToDisplayString(ImportTargetAction.KEEP),
                                   targetActionToDisplayString(ImportTargetAction.MOVE),
                                   targetActionToDisplayString(ImportTargetAction.COPY),
                               ]}
                               selected={targetActionToDisplayString(props.action)}
                               onSelect={(item: string) => props.onSelectAction(displayStringToTargetAction(item))}
                    />
                </div>

                <DirectorySelectionField
                    value={props.targetDir}
                    onAction={props.onSelectTargetDir}
                    disabled={props.action === ImportTargetAction.KEEP}
                    invalid={props.targetDirInvalid}
                />

            </VBox>

        </>
    );

}