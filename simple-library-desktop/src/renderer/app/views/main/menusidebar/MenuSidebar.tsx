import * as React from 'react';
import { useState } from 'react';
import { SidebarMenu } from '../../../../components/sidebarmenu/SidebarMenu';
import { SidebarMenuSection } from '../../../../components/sidebarmenu/SidebarMenuSection';
import { MenuActionClose, MenuActionImport } from './sidebarEntries';
import { DialogImportFiles } from './dialogs/import/DialogImportFiles';
import { useCreateGroup, useGroups } from '../../../common/hooks/groupHooks';
import { requestCloseLibrary } from '../../../common/messaging/messagingInterface';
import { CollectionSectionAction } from './CollectionSectionAction';
import { compareCollections, compareGroups } from '../../../common/utils/utils';
import { CollectionSidebarItem } from './CollectionSidebarItem';
import { GroupSidebarItem } from './GroupSidebarItem';
import { CollectionContextMenu } from './contextmenues/CollectionContextMenu';
import { GroupContextMenu } from './contextmenues/GroupContextMenu';
import { CreateCollectionDialog } from './dialogs/CreateCollectionDialog';
import { CreateGroupDialog } from './dialogs/CreateGroupDialog';
import { useCreateCollection } from '../../../common/hooks/collectionHooks';
import { useImport } from '../../../common/hooks/miscHooks';

interface MenuSidebarProps {
    onActionClose: () => void
}

export function MenuSidebar(props: React.PropsWithChildren<MenuSidebarProps>): React.ReactElement {

    const [minimized, setMinimized] = useState(false);

    const { rootGroup } = useGroups();

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
        showCreateGroup,
        createGroupParentGroup,
        openCreateGroup,
        cancelCreateGroup,
        createGroup,
    } = useCreateGroup();

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
                onActionEdit={undefined}
                onActionDelete={undefined}
                onActionMove={undefined}
            />

            <GroupContextMenu
                rootGroup={rootGroup}
                onActionRename={undefined}
                onActionDelete={undefined}
                onActionMove={undefined}
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

            {showCreateGroup && (
                <CreateGroupDialog
                    rootGroup={rootGroup}
                    parentGroup={createGroupParentGroup}
                    onCancel={cancelCreateGroup}
                    onCreate={createGroup}
                />
            )}

        </>
    );

    function handleCloseLibrary() {
        requestCloseLibrary()
            .then(() => props.onActionClose());
    }

}
