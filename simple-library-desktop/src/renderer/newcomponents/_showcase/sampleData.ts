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
                children: [
                    {
                        id: "element",
                        value: "Element",
                        icon: IconType.FOLDER,
                        children: [
                            {
                                id: "element.component",
                                value: "component",
                                icon: IconType.FILE,
                                label: "42",
                                isLeaf: true
                            },
                            {
                                id: "element.style",
                                value: "style",
                                icon: IconType.FILE,
                                label: "3152",
                                isLeaf: true
                            }
                        ]
                    },
                    {
                        id: "icon",
                        value: "Icon",
                        icon: IconType.FOLDER,
                        children: [
                            {
                                id: "icon.component",
                                value: "component",
                                icon: IconType.FILE,
                                isLeaf: true
                            },
                            {
                                id: "icon.style",
                                value: "style",
                                icon: IconType.FILE,
                                isLeaf: true
                            }
                        ]
                    },
                    {
                        id: "empty",
                        value: "Empty",
                        icon: IconType.FOLDER,
                    },
                    {
                        id: "label",
                        value: "Label",
                        icon: IconType.FOLDER,
                        children: [
                            {
                                id: "label.component",
                                value: "component",
                                icon: IconType.FILE,
                                isLeaf: true
                            },
                            {
                                id: "label.style",
                                value: "style",
                                icon: IconType.FILE,
                                isLeaf: true
                            }
                        ]
                    },
                    {
                        id: "slot",
                        value: "Slot",
                        icon: IconType.FOLDER,
                        children: [
                            {
                                id: "slot.component",
                                value: "component",
                                icon: IconType.FILE,
                                isLeaf: true
                            },
                            {
                                id: "slot.style",
                                value: "style",
                                icon: IconType.FILE,
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
                children: [
                    {
                        id: "button",
                        value: "Button",
                        icon: IconType.FOLDER,
                        children: [
                            {
                                id: "button.component",
                                value: "component",
                                icon: IconType.FILE,
                                isLeaf: true
                            },
                            {
                                id: "button.style",
                                value: "style",
                                icon: IconType.FILE,
                                isLeaf: true
                            }
                        ]
                    },
                    {
                        id: "checkbox",
                        value: "Checkbox",
                        icon: IconType.FOLDER,
                        children: [
                            {
                                id: "checkbox.component",
                                value: "component",
                                icon: IconType.FILE,
                                isLeaf: true
                            },
                            {
                                id: "checkbox.style",
                                value: "style",
                                icon: IconType.FILE,
                                isLeaf: true
                            }
                        ]
                    },
                    {
                        id: "menubutton",
                        value: "MenuButton",
                        icon: IconType.FOLDER,
                        children: [
                            {
                                id: "menubutton.component",
                                value: "component",
                                icon: IconType.FILE,
                                isLeaf: true
                            },
                            {
                                id: "menubutton.style",
                                value: "style",
                                icon: IconType.FILE,
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
                children: [
                    {
                        id: "textfield",
                        value: "TextField",
                        icon: IconType.FOLDER,
                        children: [
                            {
                                id: "textfield.component",
                                value: "component",
                                icon: IconType.FILE,
                                isLeaf: true
                            },
                            {
                                id: "textfield.style",
                                value: "style",
                                icon: IconType.FILE,
                                isLeaf: true
                            }
                        ]
                    },
                    {
                        id: "textarea",
                        value: "TextArea",
                        icon: IconType.FOLDER,
                        children: [
                            {
                                id: "textarea.component",
                                value: "component",
                                icon: IconType.FILE,
                                isLeaf: true
                            },
                            {
                                id: "textarea.style",
                                value: "style",
                                icon: IconType.FILE,
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
                children: [
                    {
                        id: "box",
                        value: "Box",
                        icon: IconType.FOLDER,
                        children: [
                            {
                                id: "vbox",
                                value: "VBox",
                                icon: IconType.FOLDER,
                                children: [
                                    {
                                        id: "vbox.component",
                                        value: "component",
                                        icon: IconType.FILE,
                                        isLeaf: true
                                    },
                                    {
                                        id: "vbox.style",
                                        value: "style",
                                        icon: IconType.FILE,
                                        isLeaf: true
                                    }
                                ]
                            },
                            {
                                id: "hbox",
                                value: "HBox",
                                icon: IconType.FOLDER,
                                children: [
                                    {
                                        id: "hbox.component",
                                        value: "component",
                                        icon: IconType.FILE,
                                        isLeaf: true
                                    },
                                    {
                                        id: "hbox.style",
                                        value: "style",
                                        icon: IconType.FILE,
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
                        children: [
                            {
                                id: "grid.component",
                                value: "component",
                                icon: IconType.FILE,
                                isLeaf: true
                            },
                            {
                                id: "grid.style",
                                value: "style",
                                icon: IconType.FILE,
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
                                isLeaf: true
                            },
                            {
                                id: "splitpane.style",
                                value: "style",
                                icon: IconType.FILE,
                                isLeaf: true
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
