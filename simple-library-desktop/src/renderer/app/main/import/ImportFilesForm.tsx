import * as React from 'react';
import { ReactElement } from 'react';
import { HBox, VBox } from '../../../components/layout/Box';
import { AlignCross, AlignMain, Fill, Size, Variant } from '../../../components/common';
import { BodyText } from '../../../components/text/Text';
import { FileSelectionField } from '../../../components/inputfield/FileSelectionField';
import { Checkbox } from '../../../components/checkbox/Checkbox';
import { InputField } from '../../../components/inputfield/InputField';
import { DirectorySelectionField } from '../../../components/inputfield/DirectorySelectionField';
import { Grid } from '../../../components/layout/Grid';
import { ChoiceBox } from '../../../components/choicebox/ChoiceBox';
import { Separator, SeparatorDirection } from '../../../components/separator/Separator';
import { FileAction, FILENAME_PART_TYPES, ImportFilesData } from './DialogImportFiles';

export interface ImportFilesFormProps {
    data: ImportFilesData,
    onSelectFiles?: () => void,
    onEnableCopyOrMove: (enabled: boolean) => void,
    onSelectCopyOrMoveAction: (action: FileAction) => void,
    onSelectTargetDirectory: () => void,
    onToggleRenameFiles: (enabled: boolean) => void,
    onSetFilenamePartType: (name: string, type: string) => void
    onSetFilenamePartValue: (name: string, value: string) => void

}


type ImportFilesFormReactProps = React.PropsWithChildren<ImportFilesFormProps>;


export function ImportFilesForm(props: ImportFilesFormReactProps): ReactElement {


    return (
        <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75}>
            {renderFileSelection(props)}
            <Separator noBorder dir={SeparatorDirection.HORIZONTAL} spacing={Size.S_0_5} />
            {renderCopyOrMove(props)}
            <Separator noBorder dir={SeparatorDirection.HORIZONTAL} spacing={Size.S_0_5} />
            {renderRenameFiles(props)}
        </VBox>
    );


    function renderFileSelection(props: ImportFilesFormReactProps) {

        function getFilesSelectionString(files: string[]): string | undefined {
            if (files.length === 0) {
                return undefined;
            } else if (files.length === 1) {
                return files[0];
            } else {
                return files.length + " files selected.";
            }
        }

        return (
            <>
                <BodyText>Select files to import</BodyText>
                <FileSelectionField
                    value={getFilesSelectionString(props.data.selectionData.files)}
                    onAction={props.onSelectFiles}
                />
            </>
        );
    }


    function renderCopyOrMove(props: ImportFilesFormReactProps) {
        return (
            <>
                <Checkbox variant={Variant.OUTLINE}
                          selected={props.data.copyOrMoveData.enabled}
                          onToggle={props.onEnableCopyOrMove}>
                    Copy or move files
                </Checkbox>
                <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75} padding={Size.S_1} withBorder>
                    <Checkbox variant={Variant.OUTLINE}
                              selected={props.data.copyOrMoveData.action === FileAction.MOVE}
                              onToggle={selected => props.onSelectCopyOrMoveAction(selected ? FileAction.MOVE : FileAction.COPY)}
                              disabled={!props.data.copyOrMoveData.enabled}>
                        Move files
                    </Checkbox>
                    <Checkbox variant={Variant.OUTLINE}
                              selected={props.data.copyOrMoveData.action === FileAction.COPY}
                              onToggle={selected => props.onSelectCopyOrMoveAction(selected ? FileAction.COPY : FileAction.MOVE)}
                              disabled={!props.data.copyOrMoveData.enabled}>
                        Copy files
                    </Checkbox>
                    <DirectorySelectionField
                        value={props.data.copyOrMoveData.targetDirectory}
                        onAction={props.onSelectTargetDirectory}
                        disabled={!props.data.copyOrMoveData.enabled}
                    />
                </VBox>
            </>
        );
    }


    function renderRenameFiles(props: ImportFilesFormReactProps) {

        function renderNamePart(name: string, selection: string, value: string) {
            return (
                <VBox spacing={Size.S_0_25}>
                    <BodyText>{name}</BodyText>
                    <ChoiceBox
                        variant={Variant.OUTLINE}
                        items={FILENAME_PART_TYPES}
                        selected={selection}
                        onSelect={selected => props.onSetFilenamePartType(name, selected)}
                        maxVisibleItems={5}
                        disabled={!props.data.renameData.enabled}
                        autoWidth
                        onTopSide
                    />
                    <InputField
                        value={value}
                        onAccept={value => props.onSetFilenamePartValue(name, value)}
                        disabled={!props.data.renameData.enabled}
                    />
                </VBox>
            );
        }

        function filenamePreview(): string {
            return "1803d0001.jpg";
        }

        return (
            <>
                <Checkbox variant={Variant.OUTLINE}
                          selected={props.data.renameData.enabled}
                          onToggle={props.onToggleRenameFiles}>
                    Rename files
                </Checkbox>
                <VBox alignMain={AlignMain.CENTER} alignCross={AlignCross.STRETCH} spacing={Size.S_0_75} padding={Size.S_1} withBorder>
                    <Grid columns={['1fr', '1fr', '1fr']} rows={['1fr']} fill={Fill.TRUE} gap={Size.S_0_5}>
                        {
                            props.data.renameData.parts.map(filenamePart => {
                                return renderNamePart(filenamePart.name, filenamePart.type, filenamePart.value);
                            })
                        }
                    </Grid>
                    <HBox spacing={Size.S_0_15}>
                        <BodyText>Preview: </BodyText>
                        <BodyText italic>{filenamePreview()}</BodyText>
                    </HBox>
                </VBox>
            </>
        );
    }

}