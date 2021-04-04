import * as React from 'react';
import { useState } from 'react';
import { SidebarMenu } from '../../../../components/sidebarmenu/SidebarMenu';
import { SidebarMenuSection } from '../../../../components/sidebarmenu/SidebarMenuSection';
import { MenuActionClose, MenuActionImport } from './sidebarEntries';
import { DialogImportFiles } from './dialogs/import/DialogImportFiles';
import { useCreateGroup, useDeleteGroup, useGroups, useRenameGroup } from '../../../hooks/groupHooks';
import { requestCloseLibrary } from '../../../common/messaging/messagingInterface';
import { CollectionSectionAction } from './CollectionSectionAction';
import { compareCollections, compareGroups } from '../../../common/utils/utils';
import { CollectionSidebarItem } from './CollectionSidebarItem';
import { GroupSidebarItem } from './GroupSidebarItem';
import { CollectionContextMenu } from './contextmenues/CollectionContextMenu';
import { GroupContextMenu } from './contextmenues/GroupContextMenu';
import { CreateCollectionDialog } from './dialogs/CreateCollectionDialog';
import { CreateGroupDialog } from './dialogs/CreateGroupDialog';
import {
    useCollections,
    useCreateCollection,
    useDeleteCollection,
    useEditCollection,
} from '../../../hooks/collectionHooks';
import { useImport } from '../../../hooks/miscHooks';
import { EditCollectionDialog } from './dialogs/EditCollectionDialog';
import { DeleteCollectionDialog } from './dialogs/DeleteCollectionDialog';
import { RenameGroupDialog } from './dialogs/RenameGroupDialog';
import { DeleteGroupDialog } from './dialogs/DeleteGroupDialog';

interface MenuSidebarProps {
    onActionClose: () => void
}

export function MenuSidebar(props: React.PropsWithChildren<MenuSidebarProps>): React.ReactElement {

    const [minimized, setMinimized] = useState(false);

    const { rootGroup, findCollection, moveGroup } = useGroups();

    const { moveCollection } = useCollections();

    const {
        showImportDialog,
        openImportDialog,
        closeImportDialog,
        startImportProcess,
    } = useImport();

    const {
        showCreateCollection,
        createCollectionParentGroup,
        openCreateCollection,
        cancelCreateCollection,
        createCollection,
    } = useCreateCollection();

    const {
        showEditCollection,
        editCollectionId,
        openEditCollection,
        cancelEditCollection,
        editCollection,
    } = useEditCollection();

    const {
        showDeleteCollection,
        deleteCollectionId,
        openDeleteCollection,
        cancelDeleteCollection,
        deleteCollection,
    } = useDeleteCollection();

    const {
        showCreateGroup,
        createGroupParentGroup,
        openCreateGroup,
        cancelCreateGroup,
        createGroup,
    } = useCreateGroup();

    const {
        showRenameGroup,
        groupToRename,
        openRenameGroup,
        cancelRenameGroup,
        renameGroup,
    } = useRenameGroup();

    const {
        showDeleteGroup,
        groupToDelete,
        openDeleteGroup,
        cancelDeleteGroup,
        deleteGroup,
    } = useDeleteGroup();

    return (
        <>
            <SidebarMenu fillHeight
                         minimizable={true}
                         minimized={minimized}
                         onToggleMinimized={setMinimized}
                         style={{ width: 'var(--s-12)' }}>

                <SidebarMenuSection title='Actions'>
                    <MenuActionImport onAction={openImportDialog} />
                    <MenuActionClose onAction={handleCloseLibrary} />
                </SidebarMenuSection>
                <SidebarMenuSection title='Collections' actionButton={
                    <CollectionSectionAction onCreateCollection={openCreateCollection} onCreateGroup={openCreateGroup} />}
                >
                    {rootGroup && [
                        ...rootGroup.collections
                            .sort(compareCollections)
                            .map(collection => <CollectionSidebarItem collection={collection} />),
                        ...rootGroup.children
                            .sort(compareGroups)
                            .map(group => <GroupSidebarItem group={group} />),
                    ]}
                </SidebarMenuSection>
            </SidebarMenu>

            <CollectionContextMenu
                rootGroup={rootGroup}
                onActionEdit={openEditCollection}
                onActionDelete={openDeleteCollection}
                onActionMove={moveCollection}
            />

            <GroupContextMenu
                rootGroup={rootGroup}
                onActionRename={openRenameGroup}
                onActionDelete={openDeleteGroup}
                onActionMove={moveGroup}
                onActionCreateCollection={openCreateCollection}
                onActionCreateGroup={openCreateGroup}
            />

            {showImportDialog && (
                <DialogImportFiles
                    onClose={closeImportDialog}
                    onImport={startImportProcess}
                />
            )}

            {showCreateCollection && (
                <CreateCollectionDialog
                    rootGroup={rootGroup}
                    parentGroup={createCollectionParentGroup}
                    onCancel={cancelCreateCollection}
                    onCreate={createCollection}
                />
            )}

            {showEditCollection && (
                <EditCollectionDialog
                    collection={findCollection(editCollectionId)}
                    onCancel={cancelEditCollection}
                    onEdit={editCollection}
                />
            )}

            {showDeleteCollection && (
                <DeleteCollectionDialog
                    collection={findCollection(deleteCollectionId)}
                    onCancel={cancelDeleteCollection}
                    onDelete={deleteCollection}
                />
            )}

            {showCreateGroup && (
                <CreateGroupDialog
                    rootGroup={rootGroup}
                    parentGroup={createGroupParentGroup}
                    onCancel={cancelCreateGroup}
                    onCreate={createGroup}
                />
            )}

            {showRenameGroup && (
                <RenameGroupDialog
                    group={groupToRename}
                    onCancel={cancelRenameGroup}
                    onRename={renameGroup}
                />
            )}

            {showDeleteGroup && (
                <DeleteGroupDialog
                    group={groupToDelete}
                    onCancel={cancelDeleteGroup}
                    onDelete={deleteGroup}
                />
            )}
        </>
    );

    function handleCloseLibrary() {
        requestCloseLibrary()
            .then(() => props.onActionClose());
    }

}
