

# Slots / Slot-System

Slots are used to group and label children of a component. Slots are identified by the name property.

```jsx
<MyComponent>
    <Slot name={"main"}>
        Main
    </Slot>
    <Slot name={"body"}>
        Body 1
    </Slot>
    <Slot name={"body"}>
        Body 2
    </Slot>
</MyComponent>
```

Inside the component, they can then be filtered by slot-name via the provided utility methods:

```jsx
import { getFirstSlot, getAllSlots } from '../../base/slot/Slot';

export function MyComponent(...): ReactElement {
	//...
	return (
    	//...
        <div>{getChildOfSlot("main")}</div>
        <div>{getChildrenOfSlots(props.children, "body")}</div>
    );
}
```

#### Utility-Methods for Slots

- `getAllSlots(children, slotname): ReactElement[]`

  - get all slot-elements with the given name

- `getFirstSlot(children, slotname): ReactElement`

  - get the first slot-element with the given name

- `getChildrenOfSlots(children, slotname): ReactElement[]`

  - get all child-elements of all slots with the given name

- `getChildrenOfSlot(children, slotname): ReactElement[]`

  - get all child-elements of the first slot with the given name

- `getChildOfSlot(children, slotname): ReactElement`

  - get the first child-element of the first slot with the given name

    



# Base



## Text

*Text, H1Text, H2Text, H3Text, H4Text, H5Text, BodyText, CaptionText*

A simple element that displays only text.

#### Examples

```jsx
<H2Text>
    Heading 2
</H2Text>

<BodyText bold>
    Bold Text
</BodyText>

<BodyText bold type={Type.ERROR}>
    Error Text
</BodyText>

<BodyText type={Type.ERROR} onType>
    Text on Error-Element
</BodyText>

<CaptionText disabled>
    Disabled Text
</CaptionText>
```

#### Properties

- variant: TextVariant
  - only available on base "Text"-elements
  - the text variant, i.e. h1, h2, body, ...
- bold?: boolean
  - whether the text is bold
- italics?: boolean
  - whether the text is in italics
- type?: Type
  - the type, e.g. error, success, ...
  - defines the color of the text
- onType?: boolean
  - whether the text is on an (colored) element of the type specified by the "type"-property 
- disabled?: boolean
  - whether the text should be displayed as disabled (grayed-out)
- editable?: boolean
  - whether the text can be edited like a text field
  - the "disabled"-property also disables editing.



## Icon

Displays a simple svg-icon from a selection of available icons

#### Examples

```jsx
<Icon
    type={IconType.FOLDER}
    color={ColorType.BASE_4}
/>

<Icon
    type={IconType.FOLDER}
    color={ColorType.BASE_4}
    size={Size.S_2}
/>
```

#### Properties

- type: IconType
  - the type of the icon. E.g. PLUS, HOME, FOLDER, ...
- color?: ColorType
  - the color of the icon
- size?: Size
  - the size of the icon



## Label

Usually displays a small piece of text, sometimes with additional icon(s) 

#### Examples

```jsx
<Label>
    Label
</Label>

<Label color={ColorType.PRIMARY_2}>
    <Icon type={IconType.HOME} />
    Colored Label with Icon
</Label>
```

#### Properties

- color?: ColorType
  - the color of the text and child-icons
- spacing?: Size
  - the custom spacing between the elements in the label
  - Default: 0.5



## LabelBox

Displays a label in a box.

#### Examples

```jsx
<LabelBox variant={Variant.OUTLINE} type={Type.DEFAULT}>
    LabelBox
</LabelBox>

<LabelBox variant={Variant.SOLID} type={Type.PRIMARY}>
    <Icon type={IconType.HOME} />
    LabelBox with Icon
</LabelBox>
```

#### Poperties

- variant?: Variant
  - default: OUTLINE
  - the overall style of the Labelbox. SOLID, OUTLINE, ...
- type?: Type
  - default: DEFAULT
  - the (color-) style of the Labelbox. DEFAULT, PRIMARY, ERROR, ...
- groupPos?: GroupPosition
  
  - the group position. Defines the overall shape of the pane to seamlessly fit together with other elements
- error?: boolean
  
- whether the Labelbox is in an error state, forcing an error-outline
  
- disabled?: boolean
  - displays the labelbox as "grayed-out" / disabled

  

## Pane

An element that provides a unified style for background and border. Can be interactive, i.e. react to mouse-over and mouse-click.

#### Examples

```jsx
<Pane
    outline={ColorType.BASE_4}
    fillDefault={ColorType.BASE_1}
>
    Pane
</Pane>

<Pane
    outline={ColorType.PRIMARY_4}
    fillDefault={undefined}
    fillReady={ColorType.PRIMARY_0}
    fillActive={ColorType.PRIMARY_1}
>
    Interactive Pane
</Pane>
```

#### Properties

- padding?: Size
  - the padding for all sides
- margin?: Size
  - the margin for all sides
- groupPos?: GroupPosition
  - the group position. Defines the overall shape of the pane to seamlessly fit together with other elements
- outline?: ColorType
  - the color for the border
- fillDefault?: ColorType
  - the background color
- fillReady?: ColorType
  - the background color when the pane is in the "ready"-state / when the mouse hovers over the pane
- fillActive?: ColorType
  - the background color when the pane is in the "active"-state / when the clicks on the pane
- forcedState?: PaneState
  - force the pane background color to be the color of the given state, ignoring all user interaction





## Card

#### Examples

```jsx
<Card icon={IconType.HOME} title={"My Card Title"}>
    <Slot name={"body"}>
        The main content of the card 
    </Slot>
    <Slot name={"footer"}>
        <Checkbox variant={Variant.OUTLINE}>Don't show again</Checkbox>
        <Button type={Type.DEFAULT} variant={Variant.OUTLINE}>Cancel</Button>
        <Button type={Type.PRIMARY} variant={Variant.SOLID}>Accept</Button>
    </Slot>
</Card>


<Card title={"Card without Footer"} closable>
    <Slot name={"body"}>
        This is the actual content of the card <br/>
        Usually, this goes over multiple lines and can be anything from
        <li>text</li>
        <li>tables</li>
        <li>forms</li>
        <li>...and more</li>
    </Slot>
</Card>

<Card>
    <Slot name={"body"}>
        This card does not have a title/header <br/>
    </Slot>
    <Slot name={"footer"}>
        <Button type={Type.DEFAULT} variant={Variant.OUTLINE}>Cancel</Button>
        <Button type={Type.PRIMARY} variant={Variant.SOLID}>Accept</Button>
    </Slot>
</Card>
```

#### Slots

- body
  - provides the main content for the card
  - optional 
- footer
  - provides the elements for the card-footer
  - optional

#### Properties

- title?: string
  - the title of the card
  - if no title is given, no header will be added
- icon?: IconType
  - the card-icon next to the title
- noBodyPadding?: boolean
  - whether to add padding around the main content
  - default = true
- closable?: boolean
  - whether to add a "close"-button in the top-right corner
- onClose?: () => void
  - the action when the user clicks the "close"-button (added with the "closable" property)
- onEnter?: () => void
  - the action triggered when the user presses the enter-key
- onEscape?: () => void
  - the action triggered when the user presses the escape-key





# Layout



## Box

*Box, HBox, VBox*

#### Examples

```jsx
<HBox spacing={Size.S_1}>
	<div>Left</div>
    <div>Middle</div>
    <div>Right</div>
</HBox>

<VBox spacing={Size.S_0_5} alignCross={AlignCross.STRETCH}>
	<div>Top</div>
    <div>Middle</div>
    <div>Bottom</div>
</VBox>
```

#### Properties

- dir?: Dir
  - the direction in which to align the items
- alignMain?: AlignMain
  - how the items are aligned along the main-axis
  - e.g.: dir=DOWN, alignMain={AlignMain.END} => items are ordered top to bottom, but grouped at the bottom of the box 
- alignCross?: AlignCross
  - how the items are aligned along the cross-axis
  - e.g.: dir=DOWN, alignCross={AlignMain.END} => items are ordered top to bottom and grouped to the right side of the box 
- spacing?: Size
  - the spacing between the elements
- padding?: Size
  - the padding of the box
- margin?: Size
  - the margin of the box
- fill?: Fill
  - whether/how to fill the parent container of the box



## Grid

#### Examples

```jsx
<Grid columns={['auto', '1fr']} rows={['100vh']}>
    <div>Left</div>
    <div>Right</div>
</Grid>
```

#### Properties

- columns?: string[]

  - the sizes of the available columns

- rows?: string[]

  - the sizes of the available rows

- gap?: Size

  - the size of the gap between elements

- fill?: Fill

  - whether/how to fill the parent container of the box
  
  


## SplitPane

*SplitPane, HSplitPane, VSplitPane, SplitPanePanel, Divider*

Has two sides split by a divider which can be dragged by the user, resizing the sides. A "SplitPane "must have exactly two children of type "SplitPanePanel". 

#### Examples

```jsx
 <VSplitPane>
     <SplitPanePanel initialSize={"100px"} minSize={"50%"} maxSize={"500px"}>
         <div style={{backgroundColor: "#ff8585", width: "100%", height: "100%"}}/>
     </SplitPanePanel>
     <SplitPanePanel initialSize={"100%"} minSize={"100px"}>
         <div style={{backgroundColor: "#91ff85", width: "100%", height: "100%"}}/>
     </SplitPanePanel>
 </VSplitPane>

<VSplitPane>
    <SplitPanePanel initialSize={"60px"} minSize={"40px"}>
        <div style={{backgroundColor: "#ff8585", width: "100%", height: "100%"}}/>
    </SplitPanePanel>
    <SplitPanePanel initialSize={"100%"} minSize={"40px"}>
        <VSplitPane style={{width: "100%", height: "100%"}}>
            <SplitPanePanel initialSize={"100%"}>
                <div style={{backgroundColor: "#85bcff", width: "100%", height: "100%"}}/>
            </SplitPanePanel>
            <SplitPanePanel initialSize={"60px"} minSize={"40px"} primary>
                <div style={{backgroundColor: "#91ff85", width: "100%", height: "100%"}}/>
            </SplitPanePanel>
        </VSplitPane>
    </SplitPanePanel>
</VSplitPane>

<VSplitPane>
    <Slot name={SLOT_DIVIDER}>
        <Divider style={{
            minWidth: "10px",
            maxWidth: "10px",
            backgroundColor: "lightgray",
            border: "1px solid black"
        }}/>
    </Slot>
    <SplitPanePanel initialSize={"100px"} minSize={"40px"}>
        <div style={{backgroundColor: "#ff8585", width: "100%", height: "100%"}}/>
    </SplitPanePanel>
    <SplitPanePanel initialSize={"100%"} minSize={"40px"}>
        <div style={{backgroundColor: "#91ff85", width: "100%", height: "100%"}}/>
    </SplitPanePanel>
</VSplitPane>
```

#### Slots

- divider
  - used to provide a custom "Divider"-element

#### Properties

**SplitPane-Properties**

- mode: "vertical" | "horizontal"
  - whether the layout of the split-pane is vertical or horizontal 
- primaryCollapsed?: boolean
  - whether the panel chosen as primary is collapsed (set to its min-size)
- primaryAsPercentage?: boolean
  - whether the size of the panel chosen as primary uses "px" or "%", resulting in slightly different behavior when resizing the split-pane

**SplitPanePanel-Properties**

- initialSize: string
  - the starting size (flex-basis) of the panel 
- minSize?: string
  - the min size of the panel
- maxSize?: boolean
  - the max size of the panel
- primary?: boolean
  - whether the panel is the primary panel. By default, the first one is chosen as the primary. The primary panel has the computed fixed size while the secondary just fills the remaining space. The primary panel is also the only one that can be collapsed/expanded via the "SplitPane#primaryCollapsed"-property





# Input



## Button

An element used to trigger an action on click.

#### Examples

```jsx
<Button>
    Button
</Button>

<Button variant={Variant.SOLID}>
    Solid Button
</Button>

<Button type={Type.PRIMARY} variant={Variant.OUTLINE}>
    <BodyText onType type={Type.PRIMARY}>
        Solid Primary
    </BodyText>
</Button>

<Button type={Type.PRIMARY} variant={Variant.OUTLINE} disabled>
    <BodyText onType type={Type.PRIMARY} disabled>
        Disabled Solid Primary
    </BodyText>
</Button>

<Button square type={Type.WARN} variant={Variant.GHOST}>
    <Icon type={IconType.HOME} />
</Button>

<div style={{ display: 'flex' }}>
    <Button groupPos={GroupPosition.START}>
        Start
    </Button>
    <Button groupPos={GroupPosition.MIDDLE}>
        Middle
    </Button>
    <Button groupPos={GroupPosition.END}>
        End
    </Button>
</div>
```

#### Properties

- variant?: Variant
  - default: OUTLINE
  - the overall style of the button. SOLID, OUTLINE, ...
- type?: Type
  - default: DEFAULT
  - the (color-) style of the button. DEFAULT, PRIMARY, ERROR, ...
- groupPos?: GroupPosition
  - the group position. Defines the overall shape of the pane to seamlessly fit together with other elements
- square?: boolean
  - whether the button is perfectly square
- error?: boolean
  - whether the button is in an error state, forcing an error-outline
- disabled?: boolean
  - whether the button can be interacted with
  - displays the button as "grayed-out" / disabled
- onAction?: () => void
  - event triggered when the button is clicked (and not disabled)



## ToggleButton

An element/button to switch between two states

#### Examples

```jsx
<ToggleButton selected>
    Toggle Button
</ToggleButton>

<ToggleButton switchContent>
    <BodyText>Switch to selected</BodyText>
    <BodyText>Switch to not selected</BodyText>
</ToggleButton>

...see "Button"
```

#### Properties

- all Properties of "Button"
- selected?: boolean
  - default: false
  - whether the button is initially selected.
  - controls only the initial state. To always force the state of the buttonto be this value, see "forceState"
- forceState?: boolean
  - default: false
  - the "selected"-value always controls the state of the button, not only the initial state
- switchContent?: boolean
  - enables displaying different content depending on the state
  - when true, the toggle-button must have exactly two child-elements
- keepSize?: boolean
  - used in combination with "switchContent"
  - true = the button does not  change width when switching between the two child-elements
- onToggle?: (selected:boolean) => void
  - triggered when the state of the buttonchanges (and the button is not disabled).
  - the parameter "selected" represents the new/next state



## Checkbox

An element to switch between "selected" and "not selected"

#### Examples

```jsx
<Checkbox variant={Variant.SOLID}>
    Solid Checkbox
</Checkbox>

<Checkbox variant={Variant.SOLID} disabled>
    Disabled Checkbox
</Checkbox>

<Checkbox variant={Variant.OUTLINE}>
    <Icon type={IconType.HOME} />
    Checkbox with Icon
</Checkbox>

<Checkbox variant={Variant.OUTLINE} error>
    Error Checkbox
</Checkbox>

<Checkbox variant={Variant.OUTLINE} selected forceState>
    Checkbox Force State
</Checkbox>
```

#### Properties

- variant: Variant
  - The overall style of the checkbox. Solid, Outline, Ghost
- selected?: boolean
  - default: false
  - whether the checkbox is initially selected.
  - controls only the initial state. To always force the state of the checkbox to be this value, see "forceState"
- forceState?: boolean
  - default: false
  - the "selected"-value always controls the state of the checkbox, not only the initial state
- disabled?: boolean
  - default: false
  - whether the checkbox is interactive
  - displays the checkbox as "grayed-out" / disabled
- error?: boolean
  - default: false
  - whether the checkbox is in an error state
- onToggle?: (selected:boolean) => void
  - triggered when the state of the checkbox changes (and the checkbox is not disabled).
  - the parameter "selected" represents the new/next state



## TextField

A field to enter a single line of text

#### Examples

```jsx
<TextField variant={Variant.SOLID} type={Type.DEFAULT} placeholder={"Placeholder"}/>

<TextField variant={Variant.OUTLINE} type={Type.PRIMARY} placeholder={"Placeholder"} />

<TextField variant={Variant.SOLID} type={Type.DEFAULT} value={"Init Value"}/>

<TextField variant={Variant.SOLID} type={Type.DEFAULT} value={"Forced Value"} forceState/>

<TextField variant={Variant.SOLID} type={Type.DEFAULT} iconLeft={IconType.HOME} iconRight={IconType.FOLDER}/>
```

#### Properties

- value?: string
  - the initial value of the textfield
- placeholder?: string
  - the text to display when the textfield is empty
- forceState?: boolean
  - default: false
  - the "selected"-value always controls the state of the textfield, not only the initial state
- variant?: Variant
  - The overall style of the textfield. Solid, Outline, Ghost
- type?: Type
  - default: DEFAULT
  - the (color-) style of the textfield. DEFAULT, PRIMARY, ERROR, ...
- error?: boolean
  - default: false
  - whether the textfield is in an error state
- groupPos?: GroupPosition
  - the group position. Defines the overall shape of the textfield to seamlessly fit together with other elements
- disabled?: boolean
  - default: false
  - whether the textfield is interactive
  - displays the textfield as "grayed-out" / disabled
- autoFocus?: boolean
  - default: false
  - whether to automatically focus the textfield
- iconLeft?: IconType
  - the icon to show on the left side inside the text field 
- iconRight?: IconType
  - the icon to show on the right side inside the text field 
- onChange?:  (value:string) => void
  - function called when the value of the textfield changes.
- onAccept?:  (value:string) => void
  - function called when the user presses enter or unfocuses the textfield





### TextArea

#### Examples

```jsx
<TextArea variant={Variant.SOLID} type={Type.DEFAULT} placeholder={"Placeholder"}/>

<TextArea variant={Variant.OUTLINE} type={Type.PRIMARY} placeholder={"Placeholder"} />

<TextArea variant={Variant.SOLID} type={Type.DEFAULT} value={"Init Value"}/>

<TextArea variant={Variant.SOLID} type={Type.DEFAULT} value={"Forced Value"} forceState/>
```

#### Properties

- value?: string
  - the initial value of the textarea
- placeholder?: string
  - the text to display when the textarea is empty
- cols?: number
  - the number of initially visible columns (not a hard limit)
- rows?: number
  - the number of initially visible rows (not a hard limit)
- wrap?: string
  - "hard", "soft"
  - specifies how the text is wrapped
- resize:? string
  - "none", "horizontal", "vertical"
  - defines in what way the text area can be resized
  - resizable in all directions by default
- forceState?: boolean
  - default: false
  - the "selected"-value always controls the state of the textarea, not only the initial state
- variant?: Variant
  - The overall style of the textarea. Solid, Outline, Ghost
- type?: Type
  - default: DEFAULT
  - the (color-) style of the textarea. DEFAULT, PRIMARY, ERROR, ...
- error?: boolean
  - default: false
  - whether the textarea is in an error state
- disabled?: boolean
  - default: false
  - whether the textarea is interactive
  - displays the textarea as "grayed-out" / disabled
- autoFocus?: boolean
  - default: false
  - whether to automatically focus the textarea
- onChange?:  (value:string) => void
  - function called when the value of the textfield changes.
- onAccept?:  (value:string) => void
  - function called when the user presses enter or unfocuses the textfield







# Menu



## MenuButton

An element/button that opens a menu

#### Examples

```jsx
<MenuButton onAction={(itemId: string) => console.log("MENU_BUTTON: " + itemId)}>
    <Slot name={"button"}>
        <Icon type={IconType.HOME} />
        Menu Button
    </Slot>
    <Slot name={"menu"}>
        <Menu>
            <MenuItem itemId={"item-1"}>Item 1</MenuItem>
            <MenuItem itemId={"item-2"}>Item 2</MenuItem>
        </Menu>
    </Slot>
</MenuButton>
```

#### Slots

- button
  - used as the content/children for the button
- menu
  - used as the menu to show. Child should be of type "Menu" 

#### Properties

- onAction?: (itemId: string) => void
  - called when any menu item (in any submenu) is clicked. The itemId is the itemId of the menu item.  

- switchContent?: boolean
  - see ToggleButton#switchContent
  - whether to switch between the two child elements in the "button"-slot based on whether the menu is open
- keepSize?: boolean
  - see ToggleButton#keepSize
  - true= the button does not  change width when switching between the two child-elements



## ContextMenuWrapper

A wrapper around an element that, when right-clicked, opens the provided menu as a context-menu.

#### Examples

```jsx
<ContextMenuWrapper onAction={(itemId: string) => console.log("Clicked " + itemId)}>
    <Slot name={"target"}>
        <LabelBox style={{width: "300px", height: "300px"}}>
            Right-Click here to open menu
        </LabelBox>
    </Slot>
    <Slot name={"menu"}>
        <Menu>
            <MenuItem itemId={"item-1"}>Item 1</MenuItem>
            <MenuItem itemId={"item-2"}>Item 2</MenuItem>
        </Menu>
    </Slot>
</ContextMenuWrapper>
```

#### Slots

- target
  - provides the target element that, when right-clicked, opens the menu
- menu
  - provided the menu that is opened on interaction with the target-element

#### Properties

- onAction?: (itemId: string) => void
  - called when any menu item (in any submenu) is clicked. The itemId is the itemId of the clicked menu item



## ContextMenu

A menu that can be opened when right-clicking the element of the provided reference  

#### Examples

```jsx
const refTarget = useRef(null);

<div ref={refTarget}>
    Right-Click Me!
</div>

<ContextMenu refTarget={refTarget} onAction={itemId => console.log(itemId)}>
    <Menu>
        <MenuItem itemId={"item-1"}>Item 1</MenuItem>
        <MenuItem itemId={"item-2"}>Item 2</MenuItem>
    </Menu>
</ContextMenu>
```

#### Properties

- refTarget: MutableRefObject
  - the reference to the target object, that should open the menu on a right-click on it
- onAction?: (itemId: string) => void
  - called when any menu item (in any submenu) is clicked. The itemId is the itemId of the clicked menu item



## Menu

A menu holding a list of menu items

#### Examples

```jsx
<Menu onAction={(itemId:string) => console.log(itemId) }>
    <MenuItem itemId={"item-1"}>Item 1</MenuItem>
    <MenuItem itemId={"item-2"}>Item 2</MenuItem>
    <SubMenuItem itemId={"item-3"}>
        <Slot name={"item"}>
            Submenu
        </Slot>
        <Slot name={"menu"}>
            <MenuItem itemId={"item-3a"}>Item 3a</MenuItem>
            <MenuItem itemId={"item-3b"}>Item 3b</MenuItem>
        </Slot>
    </SubMenuItem>
</Menu>
```

#### Properties

- onAction?: (itemId:string) => void
  - called when any menu item (in any submenu) is clicked. The itemId is the itemId of the clicked menu item.  



## Menu Item

A single menu item in a menu

#### Examples

```jsx
<MenuItem itemId={"item"}>
    Menu Item
</MenuItem>

<MenuItem itemId={"item"}>
    <Icon type={IconType.HOME} />
    Menu Item
</MenuItem>

<MenuItem itemId={"item"} icon={IconType.CHECKMARK}>
    Selected Item
</MenuItem>
```

#### Properties

- itemId?: string
  - unique id of the item in the menu and submenues
  - also used as keys for the react-elements
- icon?: IconType
  - an icon shown on the right side of the menu item
- onAction?: () => void
  - called when the menu item is clicked.



## SubMenuItem

A menu item that, when hovered over, opens another sub-menu next to it

#### Examples

```jsx
<SubMenuItem itemId={"submenu"}>
    <Slot name={"item"}>
        <Icon type={IconType.HOME} />
        Submenu
    </Slot>
    <Slot name={"menu"}>
         <MenuItem itemId={"item-1"}>Item 1</MenuItem>
         <MenuItem itemId={"item-2"}>Item 2</MenuItem>
        <MenuItem itemId={"item-2"}>Item 2</MenuItem>
    </Slot>
</SubMenuItem>
```

#### Slots

- item

  - used as the content/children for themenu-item

- menu

  - used as the content/children of the menu. 

#### Properties

- itemId?: string
  - unique id of the item in the menu and submenues
  - also used as keys for the react-elements

- onAction?: (itemId:string) => void
  - called when any menu item (in any submenu) is clicked. The itemId is the itemId of the clicked menu item.  



## SeparatorMenuItem

Adds a thin line to the menu as separation between items/sections.

#### Example

```jsx
<Menu>
	<MenuItem itemId={"item-1a"}>Item 1a</MenuItem>
    <MenuItem itemId={"item-1b"}>Item 1b</MenuItem>
    <SeparatorMenuItem/>
    <MenuItem itemId={"item-2a"}>Item 2a</MenuItem>
    <MenuItem itemId={"item-2b"}>Item 2b</MenuItem>
</Menu>
```



## TitleMenuItem

Adds a title to the menu as headline of a group of items or a sections.

#### Example

```jsx
<Menu>
    <TitleMenuItem title={"Items 1"}/>
	<MenuItem itemId={"item-1a"}>Item 1a</MenuItem>
    <MenuItem itemId={"item-1b"}>Item 1b</MenuItem>
    <TitleMenuItem title={"Items 2"}/>
    <MenuItem itemId={"item-2a"}>Item 2a</MenuItem>
    <MenuItem itemId={"item-2b"}>Item 2b</MenuItem>
</Menu>
```

#### Properties

- title: string
  - the text to display





# Dialogs



## ModalBase

The base-component for Modals/Dialogs

#### Example

```jsx
<ModalBase modalRootId={"app"} position={ModalPosition.CENTER} show withOverlay withShadow >
	Content
</ModalBase>
```

#### Properties

- show?: boolean
  - whether to render the modal
  - defaults to true 
- modalRootId?: string
  - the id of the root id of the modal. Used for the creating the portal
- position?: ModalPosition
  - the position of the modal on the screen
- withOverlay?: boolean
  - whether show an overlay over the background/elements "behind" the modal 
- withShadow?: boolean
  - whether to add a shadow to the element(s) of the modal
- onClickOutside?: () => void
  - an action performed when the user clicks outside of the modal



## Notification

A simple notification element.

#### Example

```jsx
<Notification type={Type.PRIMARY} icon={IconType.HOME} title={"My Title"} caption={"My Caption"}>
    Test Notification with text as its content.
 </Notification>
```

#### Properties

- type: Type
  - the type of the notification, i.e. success, error, warn, ...
- icon?: IconType
  - the (optional) icon to display
- title?: string
  - the title of the message
- caption?: string
  - a smaller text below the message content for additional (meta-) information 
- closable?: boolean
  - whether to display a "close"-button
- onClose?: () => void
  - action when the "close"-button is clicked 



## NotificationStack

#### Example

```jsx
<NotificationStack modalRootId={"app"}>
    <Notification type={Type.PRIMARY} title={"First Notification"}>
        Test Notification.
     </Notification>
     <Notification type={Type.PRIMARY} title={"Second Notification"}>
        Test Notification.
     </Notification>
</NotificationStack>
```

#### Properties

- modalRootId?: boolean
  - the id of the root id of the modal. Used for the creating the portal



## Dialog

#### Example

```jsx
<Dialog
    show={show}
    icon={IconType.HOME}
    title={"My Dialog Title"}
    onClose={() => setShow(false)}
    onEscape={() => setShow(false)}
    closable
    withOverlay
>
    <Slot name={"body"}>
		The actual content of the dialog.
    </Slot>
    <Slot name={"footer"}>
        <Button type={Type.DEFAULT} variant={Variant.OUTLINE} onAction={() => setShow(false)}>Cancel</Button>
        <Button type={Type.PRIMARY} variant={Variant.SOLID} onAction={() => setShow(false)}>Accept</Button>
    </Slot>
</Dialog>
```

- #### Slots

  - body
    - provides the main content for the dialog
    - optional 
  - footer
    - provides the elements for the dialog-footer
    - optional

  #### Properties

  - show?: boolean
    - whether to render the dialog
    - defaults to true 
  - modalRootId?: string
    - the id of the root id of the dialog. Used for the creating the portal
  - withOverlay?: boolean
    - whether show an overlay over the background/elements "behind" the dialog

  - title?: string
    - the title of the dialog
    - if no title is given, no header will be added
  - icon?: IconType
    - the dialog-icon next to the title
  - noBodyPadding?: boolean
    - whether to add padding around the main content
    - default = true
  - closable?: boolean
    - whether to add a "close"-button in the top-right corner
  - onClose?: () => void
    - the action when the user clicks the "close"-button (added with the "closable" property)
  - onEnter?: () => void
    - the action triggered when the user presses the enter-key
  - onEscape?: () => void
    - the action triggered when the user presses the escape-key

  



## Image

#### Examples

```jsx
<Image url="path/to/image.png" mode={ImageMode.CONTAIN}>
    Overlay Text
</Image>

<Image url="path/to/image.png" mode={ImageMode.CONTAIN} posX={"50%"} posY={"20px"}/>
```

#### Properties

- url: string
  - the path the to the image file/source
- mode?: ImageMode
  - specifies the size/coverage behaviour of the image inside the element
    - auto: display in original size
    - cover: cover the entire element, can cut of parts of the image
    - contain: cover the entire element without cutting of the image
- posX?: string
  - specifies the x-position of the image inside the element
  - see https://www.w3schools.com/cssref/pr_background-position.asp
- posY?: string
  - specifies the y-position of the image inside the element
  - see https://www.w3schools.com/cssref/pr_background-position.asp
- color?: string
  - defines the background color when the image does not cover the entire element