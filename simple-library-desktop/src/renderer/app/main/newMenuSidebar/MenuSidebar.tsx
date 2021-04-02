import * as React from 'react';
import { useState } from 'react';
import { SidebarMenu } from '../../../components/sidebarmenu/SidebarMenu';
import { SidebarMenuSection } from '../../../components/sidebarmenu/SidebarMenuSection';
import { MenuActionClose, MenuActionImport } from '../menuSidebar/sidebarEntries';
import { DialogImportFiles } from '../menuSidebar/dialogs/import/DialogImportFiles';
import { useCreateCollection, useCreateGroup, useImport, useRootGroup } from '../../common/hooks';
import { requestCloseLibrary } from '../../common/messagingInterface';
import { CollectionSectionAction } from './CollectionSectionAction';
import { DialogCreateCollectionController } from '../menuSidebar/dialogs/DialogCreateCollection';
import { DialogCreateGroupController } from '../menuSidebar/dialogs/DialogCreateGroup';

interface MenuSidebarProps {
    onActionClose: () => void
}

export function MenuSidebar(props: React.PropsWithChildren<MenuSidebarProps>): React.ReactElement {

    const [minimized, setMinimized] = useState(false);

    const { rootGroup } = useRootGroup();

    const {
        showImportDialog,
        openImportDialog,
        closeImportDialog,
        startImportProcess,
    } = useImport();

    const {
        showCreateCollectionDialog,
        openCreateCollectionDialog,
        closeCreateCollectionDialog,
        createCollection,
    } = useCreateCollection();

    const {
        showCreateGroupDialog,
        openCreateGroupDialog,
        closeCreateGroupDialog,
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
                    <MenuActionClose onAction={handleClose} />
                </SidebarMenuSection>
                <SidebarMenuSection title='Collections' actionButton={
                    <CollectionSectionAction onCreateCollection={openCreateCollectionDialog} onCreateGroup={openCreateGroupDialog} />}
                >
                    {/*todo*/}
                </SidebarMenuSection>
            </SidebarMenu>

            {showImportDialog && (
                <DialogImportFiles
                    onClose={closeImportDialog}
                    onImport={startImportProcess}
                />
            )}

            {showCreateCollectionDialog && (
                <DialogCreateCollectionController
                    rootGroup={rootGroup}
                    triggerGroupId={} // todo
                    onClose={closeCreateCollectionDialog}
                />
            )}

            {showCreateGroupDialog && (
                <DialogCreateGroupController
                    rootGroup={rootGroup}
                    triggerGroupId={} // todo
                    onClose={closeCreateGroupDialog}
                />
            )}

        </>
    );

    function handleClose() {
        requestCloseLibrary().then(() => props.onActionClose());
    }

}
