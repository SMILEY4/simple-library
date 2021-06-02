import {TreeViewNode} from "../misc/tree/TreeView";
import {IconType} from "../base/icon/Icon";

export function getTreeData(): TreeViewNode {
    return {
        id: "root",
        value: "Project",
        icon: IconType.FOLDER,
        children: [
            {
                id: "base",
                value: "Base",
                icon: IconType.FOLDER,
                draggable: true,
                droppable: true,
                children: [
                    {
                        id: "element",
                        value: "Element",
                        icon: IconType.FOLDER,
                        draggable: true,
                        droppable: true,
                        children: [
                            {
                                id: "element.component",
                                value: "component",
                                icon: IconType.FILE,
                                label: "42",
                                draggable: true,
                                droppable: true,
                                isLeaf: true

                            },
                            {
                                id: "element.style",
                                value: "style",
                                icon: IconType.FILE,
                                label: "3152",
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            }
                        ]
                    },
                    {
                        id: "icon",
                        value: "Icon",
                        icon: IconType.FOLDER,
                        draggable: true,
                        droppable: true,
                        children: [
                            {
                                id: "icon.component",
                                value: "component",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            },
                            {
                                id: "icon.style",
                                value: "style",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            }
                        ]
                    },
                    {
                        id: "empty",
                        value: "Empty",
                        icon: IconType.FOLDER,
                        draggable: true,
                        droppable: true,
                    },
                    {
                        id: "label",
                        value: "Label",
                        icon: IconType.FOLDER,
                        draggable: true,
                        droppable: true,
                        children: [
                            {
                                id: "label.component",
                                value: "component",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            },
                            {
                                id: "label.style",
                                value: "style",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            }
                        ]
                    },
                    {
                        id: "slot",
                        value: "Slot",
                        icon: IconType.FOLDER,
                        draggable: true,
                        droppable: true,
                        children: [
                            {
                                id: "slot.component",
                                value: "component",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            },
                            {
                                id: "slot.style",
                                value: "style",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            }
                        ]
                    }
                ]
            },
            {
                id: "buttons",
                value: "Buttons",
                icon: IconType.FOLDER,
                draggable: true,
                droppable: true,
                children: [
                    {
                        id: "button",
                        value: "Button",
                        icon: IconType.FOLDER,
                        draggable: true,
                        droppable: true,
                        children: [
                            {
                                id: "button.component",
                                value: "component",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            },
                            {
                                id: "button.style",
                                value: "style",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            }
                        ]
                    },
                    {
                        id: "checkbox",
                        value: "Checkbox",
                        icon: IconType.FOLDER,
                        draggable: true,
                        droppable: true,
                        children: [
                            {
                                id: "checkbox.component",
                                value: "component",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            },
                            {
                                id: "checkbox.style",
                                value: "style",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            }
                        ]
                    },
                    {
                        id: "menubutton",
                        value: "MenuButton",
                        icon: IconType.FOLDER,
                        draggable: true,
                        droppable: true,
                        children: [
                            {
                                id: "menubutton.component",
                                value: "component",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            },
                            {
                                id: "menubutton.style",
                                value: "style",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            }
                        ]
                    }
                ]
            },
            {
                id: "input",
                value: "Input",
                icon: IconType.FOLDER,
                draggable: true,
                droppable: true,
                children: [
                    {
                        id: "textfield",
                        value: "TextField",
                        icon: IconType.FOLDER,
                        draggable: true,
                        droppable: true,
                        children: [
                            {
                                id: "textfield.component",
                                value: "component",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            },
                            {
                                id: "textfield.style",
                                value: "style",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            }
                        ]
                    },
                    {
                        id: "textarea",
                        value: "TextArea",
                        icon: IconType.FOLDER,
                        draggable: true,
                        droppable: true,
                        children: [
                            {
                                id: "textarea.component",
                                value: "component",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            },
                            {
                                id: "textarea.style",
                                value: "style",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            }
                        ]
                    }
                ]
            },
            {
                id: "layout",
                value: "Layout",
                icon: IconType.FOLDER,
                draggable: true,
                droppable: true,
                children: [
                    {
                        id: "box",
                        value: "Box",
                        icon: IconType.FOLDER,
                        draggable: true,
                        droppable: true,
                        children: [
                            {
                                id: "vbox",
                                value: "VBox",
                                icon: IconType.FOLDER,
                                draggable: true,
                                droppable: true,
                                children: [
                                    {
                                        id: "vbox.component",
                                        value: "component",
                                        icon: IconType.FILE,
                                        draggable: true,
                                        droppable: true,
                                        isLeaf: true
                                    },
                                    {
                                        id: "vbox.style",
                                        value: "style",
                                        icon: IconType.FILE,
                                        draggable: true,
                                        droppable: true,
                                        isLeaf: true
                                    }
                                ]
                            },
                            {
                                id: "hbox",
                                value: "HBox",
                                icon: IconType.FOLDER,
                                draggable: true,
                                droppable: true,
                                children: [
                                    {
                                        id: "hbox.component",
                                        value: "component",
                                        icon: IconType.FILE,
                                        draggable: true,
                                        droppable: true,
                                        isLeaf: true
                                    },
                                    {
                                        id: "hbox.style",
                                        value: "style",
                                        icon: IconType.FILE,
                                        draggable: true,
                                        droppable: true,
                                        isLeaf: true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "grid",
                        value: "Grid",
                        icon: IconType.FOLDER,
                        draggable: true,
                        droppable: true,
                        children: [
                            {
                                id: "grid.component",
                                value: "component",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            },
                            {
                                id: "grid.style",
                                value: "style",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            }
                        ]
                    },
                    {
                        id: "splitpane",
                        value: "SplitPane",
                        icon: IconType.FOLDER,
                        children: [
                            {
                                id: "splitpane.component",
                                value: "component",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            },
                            {
                                id: "splitpane.style",
                                value: "style",
                                icon: IconType.FILE,
                                draggable: true,
                                droppable: true,
                                isLeaf: true
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
