# Base



## Icon

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



## LabelBox

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



## Slots / Slot-System

Slots are used to group and label children of a component.

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
        <div>{getFirstSlot("main")}</div>
        <div>{getAllSlots("body")}</div>
    );
}
```





# Input



## Button

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
- onToggle?: (selected:boolean) => void
  - triggered when the state of the buttonchanges (and the button is not disabled).
  - the parameter "selected" represents the new/next state



## Checkbox

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

