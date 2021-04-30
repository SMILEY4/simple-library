import * as React from 'react';
import { ReactElement, useState } from 'react';
import "./showcase.css";
import { BodyText, H2Text, Text, TextVariant } from '../base/text/Text';
import { ColorType, GroupPosition, Size, Type, Variant } from '../common/common';
import { Button } from '../input/button/Button';
import { Pane, PaneState } from '../base/pane/Pane';
import { Icon, IconType } from "../base/icon/Icon";
import { Label } from '../base/label/Label';
import { Checkbox } from '../input/checkbox/Checkbox';
import { ToggleButton } from '../input/togglebutton/ToggleButton';
import { TextField } from '../input/textfield/TextField';
import { LabelBox } from '../base/labelbox/LabelBox';
import { ChoiceBox } from '../input/choicebox/Choicebox';

export function ComponentShowcaseView(): any {
    const [theme, setTheme] = useState("light-0");
    const themeName = (theme === "light-0" || theme === "light-1") ? "light" : "dark";
    const bgNr = (theme === "light-0" || theme === "dark-0") ? "0" : "1";
    return (
        <div className={
            "showcase-view"
            + " theme-" + themeName
            + " background-" + bgNr
        }>
            <div className='showcase-controls'>
                <div onClick={() => setTheme("light-0")}>Light-0</div>
                <div onClick={() => setTheme("light-1")}>Light-1</div>
                <div onClick={() => setTheme("dark-0")}>Dark-0</div>
                <div onClick={() => setTheme("dark-1")}>Dark-1</div>
            </div>
            <div className='showcase-content' id='showcase-content'>
                {renderContent()}
            </div>
        </div>
    );

    function renderContent() {
        return (
            <>
                {renderChoiceBox()}
                {renderTextFields()}
                {renderCheckboxes()}
                {renderLabels()}
                {renderIcons()}
                {renderToggleButtons()}
                {renderButtons()}
                {renderPanesInteractive()}
                {renderText()}
            </>
        );
    }


    function renderChoiceBox() {
        return (
            <>
                <h3>ChoiceBox</h3>
                <ChoiceBox/>
            </>
        );
    }


    function renderTextFields() {
        return (
            <>
                <h3>TextFields</h3>
                <ShowcaseRow>
                    <TextField variant={Variant.SOLID} type={Type.DEFAULT} placeholder={"Textfield"}/>
                    <TextField variant={Variant.OUTLINE} type={Type.DEFAULT} placeholder={"Textfield"} />
                    <TextField variant={Variant.GHOST} type={Type.DEFAULT} placeholder={"Textfield"} />
                    <TextField variant={Variant.LINK} type={Type.DEFAULT} placeholder={"Textfield"} />
                </ShowcaseRow>
                <ShowcaseRow>
                    <TextField disabled variant={Variant.SOLID} type={Type.DEFAULT} placeholder={"Disabled"}/>
                    <TextField disabled variant={Variant.OUTLINE} type={Type.DEFAULT} placeholder={"Disabled"} />
                    <TextField disabled variant={Variant.GHOST} type={Type.DEFAULT} placeholder={"Disabled"} />
                    <TextField disabled variant={Variant.LINK} type={Type.DEFAULT} placeholder={"Disabled"} />
                </ShowcaseRow>
                <ShowcaseRow>
                    <TextField variant={Variant.SOLID} type={Type.PRIMARY} placeholder={"Textfield"} />
                    <TextField variant={Variant.OUTLINE} type={Type.PRIMARY} placeholder={"Textfield"} />
                    <TextField variant={Variant.GHOST} type={Type.PRIMARY} placeholder={"Textfield"} />
                    <TextField variant={Variant.LINK} type={Type.PRIMARY} placeholder={"Textfield"} />
                </ShowcaseRow>
                <ShowcaseRow>
                    <TextField error variant={Variant.SOLID} type={Type.DEFAULT} placeholder={"Textfield"}/>
                    <TextField error variant={Variant.OUTLINE} type={Type.DEFAULT} placeholder={"Textfield"} />
                    <TextField error variant={Variant.GHOST} type={Type.DEFAULT} placeholder={"Textfield"} />
                    <TextField error variant={Variant.LINK} type={Type.DEFAULT} placeholder={"Textfield"} />
                </ShowcaseRow>
                <TextField variant={Variant.SOLID} type={Type.DEFAULT} value={"Init Value"}/>
                <TextField variant={Variant.SOLID} type={Type.DEFAULT} value={"Forced Value"} forceState/>

                <ShowcaseRow>
                    <TextField variant={Variant.SOLID} type={Type.PRIMARY} iconLeft={IconType.HOME} iconRight={IconType.FOLDER}/>
                    <TextField variant={Variant.OUTLINE} type={Type.PRIMARY} iconLeft={IconType.HOME} iconRight={IconType.FOLDER}/>
                    <TextField variant={Variant.GHOST} type={Type.PRIMARY} iconLeft={IconType.HOME} iconRight={IconType.FOLDER}/>
                    <TextField variant={Variant.LINK} type={Type.PRIMARY} iconLeft={IconType.HOME} iconRight={IconType.FOLDER}/>
                </ShowcaseRow>

                <div style={{ display: 'flex' }}>
                    <LabelBox type={Type.DEFAULT} variant={Variant.OUTLINE} groupPos={GroupPosition.START}>
                        https://
                    </LabelBox>
                    <TextField variant={Variant.OUTLINE} placeholder={"example.com"} groupPos={GroupPosition.MIDDLE}/>
                    <Button type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.END}>
                        Search
                    </Button>
                </div>

            </>
        );
    }


    function renderCheckboxes() {
        return (
            <>
                <h3>Checkboxes</h3>

                <ShowcaseRow>
                    <Checkbox variant={Variant.SOLID} selected>
                        Solid Checkbox
                    </Checkbox>
                    <Checkbox variant={Variant.OUTLINE} selected>
                        Outline Checkbox
                    </Checkbox>
                    <Checkbox variant={Variant.GHOST} selected>
                        Ghost Checkbox
                    </Checkbox>
                </ShowcaseRow>

                <ShowcaseRow>
                    <Checkbox variant={Variant.SOLID} selected disabled>
                        Solid Checkbox Disabled
                    </Checkbox>
                    <Checkbox variant={Variant.OUTLINE} selected disabled>
                        Outline Checkbox Disabled
                    </Checkbox>
                    <Checkbox variant={Variant.GHOST} selected disabled>
                        Ghost Checkbox Disabled
                    </Checkbox>
                </ShowcaseRow>

                <Checkbox variant={Variant.OUTLINE} error selected>
                    Error Checkbox
                </Checkbox>

                <Checkbox variant={Variant.OUTLINE}>
                    <Icon type={IconType.HOME} />
                    With Icon
                </Checkbox>

                <Checkbox variant={Variant.OUTLINE} selected forceState>
                    Checkbox Force State
                </Checkbox>
            </>
        )
            ;
    }


    function renderLabels() {
        return (
            <>

                <h3>Label Box</h3>

                <LabelBox variant={Variant.OUTLINE} type={Type.DEFAULT}>
                    Label Box
                </LabelBox>
                <LabelBox variant={Variant.OUTLINE} type={Type.PRIMARY}>
                    <Icon type={IconType.HOME} />
                    Label Box
                </LabelBox>
                <LabelBox variant={Variant.SOLID} type={Type.PRIMARY}>
                    <Icon type={IconType.HOME} />
                    Label Box
                </LabelBox>
                <LabelBox variant={Variant.OUTLINE} type={Type.DEFAULT} error>
                    Label Box
                </LabelBox>

                <h3>Labels</h3>
                <Label>
                    Label
                </Label>
                <Label color={ColorType.PRIMARY_2}>
                    <Icon type={IconType.HOME} />
                    Label
                </Label>
                <Label>
                    Label
                    <Icon type={IconType.HOME} />
                </Label>
                <Label>
                    <Icon type={IconType.HOME} />
                    Label
                    <Icon type={IconType.HOME} />
                </Label>
                <Label>
                    Before
                    <Icon type={IconType.HOME} />
                    After
                </Label>
                <Label>
                    <Icon type={IconType.HOME} size={Size.S_1} />
                    <H2Text bold>Header 2</H2Text>
                </Label>
            </>
        );
    }

    function renderIcons() {
        return (
            <>
                <h3>Icons</h3>
                <ShowcaseRow>
                    <Icon type={IconType.FOLDER} color={ColorType.BASE_4} />
                    <Icon type={IconType.FOLDER} color={ColorType.PRIMARY_2} />
                    <Icon type={IconType.FOLDER} color={ColorType.SUCCESS_2} />
                    <Icon type={IconType.FOLDER} color={ColorType.ERROR_2} />
                    <Icon type={IconType.FOLDER} color={ColorType.WARN_2} />
                </ShowcaseRow>
                <ShowcaseRow>
                    <Icon type={IconType.FOLDER} size={Size.S_0_5} />
                    <Icon type={IconType.FOLDER} size={Size.S_0_75} />
                    <Icon type={IconType.FOLDER} size={Size.S_1} />
                    <Icon type={IconType.FOLDER} size={Size.S_1_5} />
                    <Icon type={IconType.FOLDER} size={Size.S_2} />
                    <Icon type={IconType.FOLDER} size={Size.S_3} />
                </ShowcaseRow>
            </>
        );
    }


    function renderToggleButtons() {
        return (
            <>
                <h3>ToggleButtons</h3>
                {renderToggleButtonRow(Type.DEFAULT)}
                {renderToggleButtonRow(Type.PRIMARY)}
                {renderToggleButtonRow(Type.SUCCESS)}
                {renderToggleButtonRow(Type.ERROR)}
                {renderToggleButtonRow(Type.WARN)}

                <ShowcaseRow>
                    <ToggleButton type={Type.PRIMARY} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                        <BodyText onType type={Type.PRIMARY}>With Icon</BodyText>
                    </ToggleButton>
                    <ToggleButton type={Type.DEFAULT} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                        <BodyText>With Icon</BodyText>
                    </ToggleButton>
                    <ToggleButton type={Type.DEFAULT} variant={Variant.OUTLINE}>
                        <Icon type={IconType.HOME} />
                        <BodyText>With Icon</BodyText>
                    </ToggleButton>
                    <ToggleButton type={Type.DEFAULT} variant={Variant.GHOST}>
                        <Icon type={IconType.HOME} />
                        <BodyText>With Icon</BodyText>
                    </ToggleButton>
                    <ToggleButton type={Type.DEFAULT} variant={Variant.LINK}>
                        <Icon type={IconType.HOME} />
                        <BodyText>With Icon</BodyText>
                    </ToggleButton>
                </ShowcaseRow>

                <ShowcaseRow>
                    <ToggleButton type={Type.PRIMARY} variant={Variant.SOLID} disabled>
                        <Icon type={IconType.HOME} />
                        <BodyText onType type={Type.PRIMARY} disabled>With Icon</BodyText>
                    </ToggleButton>
                    <ToggleButton type={Type.DEFAULT} variant={Variant.SOLID} disabled>
                        <Icon type={IconType.HOME} />
                        <BodyText disabled>With Icon</BodyText>
                    </ToggleButton>
                    <ToggleButton type={Type.DEFAULT} variant={Variant.OUTLINE} disabled>
                        <Icon type={IconType.HOME} />
                        <BodyText disabled>With Icon</BodyText>
                    </ToggleButton>
                    <ToggleButton type={Type.DEFAULT} variant={Variant.GHOST} disabled>
                        <Icon type={IconType.HOME} />
                        <BodyText disabled>With Icon</BodyText>
                    </ToggleButton>
                    <ToggleButton type={Type.DEFAULT} variant={Variant.LINK} disabled>
                        <Icon type={IconType.HOME} />
                        <BodyText disabled>With Icon</BodyText>
                    </ToggleButton>
                </ShowcaseRow>

                <ToggleButton type={Type.DEFAULT} variant={Variant.SOLID}>
                    <Icon type={IconType.HOME} />
                    <BodyText>Two Icons</BodyText>
                    <Icon type={IconType.HOME} />
                </ToggleButton>

                <ShowcaseRow>
                    <ToggleButton type={Type.PRIMARY} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                    </ToggleButton>
                    <ToggleButton type={Type.DEFAULT} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                    </ToggleButton>
                    <ToggleButton type={Type.DEFAULT} variant={Variant.OUTLINE}>
                        <Icon type={IconType.HOME} />
                    </ToggleButton>
                    <ToggleButton type={Type.DEFAULT} variant={Variant.GHOST}>
                        <Icon type={IconType.HOME} />
                    </ToggleButton>
                    <ToggleButton type={Type.DEFAULT} variant={Variant.LINK}>
                        <Icon type={IconType.HOME} />
                    </ToggleButton>
                </ShowcaseRow>

                <ShowcaseRow>
                    <ToggleButton square type={Type.PRIMARY} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                    </ToggleButton>
                    <ToggleButton square type={Type.DEFAULT} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                    </ToggleButton>
                    <ToggleButton square type={Type.DEFAULT} variant={Variant.OUTLINE}>
                        <Icon type={IconType.HOME} />
                    </ToggleButton>
                    <ToggleButton square type={Type.DEFAULT} variant={Variant.GHOST}>
                        <Icon type={IconType.HOME} />
                    </ToggleButton>
                    <ToggleButton square type={Type.DEFAULT} variant={Variant.LINK}>
                        <Icon type={IconType.HOME} />
                    </ToggleButton>
                </ShowcaseRow>

                <ShowcaseRow>

                    <div style={{ display: 'flex' }}>
                        <ToggleButton type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.START}>
                            Start
                        </ToggleButton>
                        <ToggleButton type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE}>
                            Middle
                        </ToggleButton>
                        <ToggleButton type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE}>
                            Middle
                        </ToggleButton>
                        <ToggleButton type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.END}>
                            End
                        </ToggleButton>
                    </div>

                    <div style={{ display: 'flex' }}>
                        <ToggleButton type={Type.DEFAULT} variant={Variant.OUTLINE} groupPos={GroupPosition.START}>
                            Start
                        </ToggleButton>
                        <ToggleButton type={Type.DEFAULT} variant={Variant.OUTLINE} groupPos={GroupPosition.MIDDLE}>
                            Middle
                        </ToggleButton>
                        <ToggleButton type={Type.DEFAULT} variant={Variant.OUTLINE} groupPos={GroupPosition.MIDDLE}>
                            Middle
                        </ToggleButton>
                        <ToggleButton type={Type.DEFAULT} variant={Variant.OUTLINE} groupPos={GroupPosition.END}>
                            End
                        </ToggleButton>
                    </div>
                </ShowcaseRow>

                <ToggleButton switchContent keepSize>
                    <BodyText>Switch to selected</BodyText>
                    <BodyText>Switch to not selected</BodyText>
                </ToggleButton>

            </>
        );

        function renderToggleButtonRow(type: Type) {
            return (
                <ShowcaseRow>

                    <ToggleButton type={type} variant={Variant.SOLID}>
                        <BodyText onType type={type}>
                            Solid
                        </BodyText>
                    </ToggleButton>

                    <ToggleButton type={type} variant={Variant.OUTLINE}>
                        <BodyText>
                            Outline
                        </BodyText>
                    </ToggleButton>

                    <ToggleButton type={type} variant={Variant.GHOST}>
                        <BodyText>
                            Ghost
                        </BodyText>
                    </ToggleButton>

                    <ToggleButton type={type} variant={Variant.LINK}>
                        <BodyText>
                            Link
                        </BodyText>
                    </ToggleButton>

                    <ToggleButton type={type} disabled variant={Variant.SOLID}>
                        <BodyText onType type={type} disabled>
                            Solid
                        </BodyText>
                    </ToggleButton>

                    <ToggleButton type={type} disabled variant={Variant.OUTLINE}>
                        <BodyText disabled>
                            Outline
                        </BodyText>
                    </ToggleButton>

                    <ToggleButton type={type} disabled variant={Variant.GHOST}>
                        <BodyText disabled>
                            Ghost
                        </BodyText>
                    </ToggleButton>

                    <ToggleButton type={type} disabled variant={Variant.LINK}>
                        <BodyText disabled>
                            Link
                        </BodyText>
                    </ToggleButton>

                </ShowcaseRow>
            );
        }
    }


    function renderButtons() {
        return (
            <>
                <h3>Buttons</h3>
                {renderButtonRow(Type.DEFAULT)}
                {renderButtonRow(Type.PRIMARY)}
                {renderButtonRow(Type.SUCCESS)}
                {renderButtonRow(Type.ERROR)}
                {renderButtonRow(Type.WARN)}

                <ShowcaseRow>
                    <Button type={Type.PRIMARY} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                        <BodyText onType type={Type.PRIMARY}>With Icon</BodyText>
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                        <BodyText>With Icon</BodyText>
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.OUTLINE}>
                        <Icon type={IconType.HOME} />
                        <BodyText>With Icon</BodyText>
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.GHOST}>
                        <Icon type={IconType.HOME} />
                        <BodyText>With Icon</BodyText>
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.LINK}>
                        <Icon type={IconType.HOME} />
                        <BodyText>With Icon</BodyText>
                    </Button>
                </ShowcaseRow>

                <ShowcaseRow>
                    <Button type={Type.PRIMARY} variant={Variant.SOLID} disabled>
                        <Icon type={IconType.HOME} />
                        <BodyText onType type={Type.PRIMARY} disabled>With Icon</BodyText>
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.SOLID} disabled>
                        <Icon type={IconType.HOME} />
                        <BodyText disabled>With Icon</BodyText>
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.OUTLINE} disabled>
                        <Icon type={IconType.HOME} />
                        <BodyText disabled>With Icon</BodyText>
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.GHOST} disabled>
                        <Icon type={IconType.HOME} />
                        <BodyText disabled>With Icon</BodyText>
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.LINK} disabled>
                        <Icon type={IconType.HOME} />
                        <BodyText disabled>With Icon</BodyText>
                    </Button>
                </ShowcaseRow>

                <Button type={Type.DEFAULT} variant={Variant.SOLID}>
                    <Icon type={IconType.HOME} />
                    <BodyText>Two Icons</BodyText>
                    <Icon type={IconType.HOME} />
                </Button>

                <ShowcaseRow>
                    <Button type={Type.PRIMARY} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.OUTLINE}>
                        <Icon type={IconType.HOME} />
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.GHOST}>
                        <Icon type={IconType.HOME} />
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.LINK}>
                        <Icon type={IconType.HOME} />
                    </Button>
                </ShowcaseRow>

                <ShowcaseRow>
                    <Button square type={Type.PRIMARY} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                    </Button>
                    <Button square type={Type.DEFAULT} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                    </Button>
                    <Button square type={Type.DEFAULT} variant={Variant.OUTLINE}>
                        <Icon type={IconType.HOME} />
                    </Button>
                    <Button square type={Type.DEFAULT} variant={Variant.GHOST}>
                        <Icon type={IconType.HOME} />
                    </Button>
                    <Button square type={Type.DEFAULT} variant={Variant.LINK}>
                        <Icon type={IconType.HOME} />
                    </Button>
                </ShowcaseRow>

                <ShowcaseRow>
                    <div style={{ display: 'flex' }}>
                        <Button type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.START}>
                            Start
                        </Button>
                        <Button type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE}>
                            Middle
                        </Button>
                        <Button type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.MIDDLE}>
                            Middle
                        </Button>
                        <Button type={Type.DEFAULT} variant={Variant.SOLID} groupPos={GroupPosition.END}>
                            End
                        </Button>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Button type={Type.DEFAULT} variant={Variant.OUTLINE} groupPos={GroupPosition.START}>
                            Start
                        </Button>
                        <Button type={Type.DEFAULT} variant={Variant.OUTLINE} groupPos={GroupPosition.MIDDLE}>
                            Middle
                        </Button>
                        <Button type={Type.DEFAULT} variant={Variant.OUTLINE} groupPos={GroupPosition.MIDDLE}>
                            Middle
                        </Button>
                        <Button type={Type.DEFAULT} variant={Variant.OUTLINE} groupPos={GroupPosition.END}>
                            End
                        </Button>
                    </div>
                </ShowcaseRow>

                <ShowcaseRow>
                    <Button variant={Variant.SOLID} error>
                        Error State
                    </Button>
                    <Button variant={Variant.OUTLINE} error>
                        Error State
                    </Button>
                    <Button variant={Variant.GHOST} error>
                        Error State
                    </Button>
                    <Button variant={Variant.LINK} error>
                        Error State
                    </Button>
                </ShowcaseRow>

            </>
        );

        function renderButtonRow(type: Type) {
            return (
                <ShowcaseRow>

                    <Button type={type} variant={Variant.SOLID}>
                        <BodyText onType type={type}>
                            Solid
                        </BodyText>
                    </Button>

                    <Button type={type} variant={Variant.OUTLINE}>
                        <BodyText>
                            Outline
                        </BodyText>
                    </Button>

                    <Button type={type} variant={Variant.GHOST}>
                        <BodyText>
                            Ghost
                        </BodyText>
                    </Button>

                    <Button type={type} variant={Variant.LINK}>
                        <BodyText>
                            Link
                        </BodyText>
                    </Button>

                    <Button type={type} disabled variant={Variant.SOLID}>
                        <BodyText onType type={type} disabled>
                            Solid
                        </BodyText>
                    </Button>

                    <Button type={type} disabled variant={Variant.OUTLINE}>
                        <BodyText disabled>
                            Outline
                        </BodyText>
                    </Button>

                    <Button type={type} disabled variant={Variant.GHOST}>
                        <BodyText disabled>
                            Ghost
                        </BodyText>
                    </Button>

                    <Button type={type} disabled variant={Variant.LINK}>
                        <BodyText disabled>
                            Link
                        </BodyText>
                    </Button>

                </ShowcaseRow>
            );
        }
    }


    function renderPanesInteractive() {
        const settingBase: any = {
            ghost: {
                typeOutline: undefined,
                typeDefault: undefined,
                typeReady: ColorType.BASE_0,
                typeActive: ColorType.BASE_1,
            },
            outline: {
                typeOutline: ColorType.BASE_4,
                typeDefault: undefined,
                typeReady: ColorType.BASE_0,
                typeActive: ColorType.BASE_1,
            },
            filled: {
                typeOutline: ColorType.BASE_4,
                typeDefault: ColorType.BASE_1,
                typeReady: ColorType.BASE_2,
                typeActive: ColorType.BASE_3,
            },
        };
        const settingPrimary: any = {
            ghost: {
                typeOutline: undefined,
                typeDefault: undefined,
                typeReady: ColorType.PRIMARY_0,
                typeActive: ColorType.PRIMARY_1,
            },
            outline: {
                typeOutline: ColorType.PRIMARY_4,
                typeDefault: undefined,
                typeReady: ColorType.PRIMARY_0,
                typeActive: ColorType.PRIMARY_1,
            },
            filled: {
                typeOutline: ColorType.PRIMARY_2,
                typeDefault: ColorType.PRIMARY_2,
                typeReady: ColorType.PRIMARY_3,
                typeActive: ColorType.PRIMARY_4,
            },
        };
        const settingSuccess: any = {
            ghost: {
                typeOutline: undefined,
                typeDefault: undefined,
                typeReady: ColorType.SUCCESS_0,
                typeActive: ColorType.SUCCESS_1,
            },
            outline: {
                typeOutline: ColorType.SUCCESS_4,
                typeDefault: undefined,
                typeReady: ColorType.SUCCESS_0,
                typeActive: ColorType.SUCCESS_1,
            },
            filled: {
                typeOutline: ColorType.SUCCESS_2,
                typeDefault: ColorType.SUCCESS_2,
                typeReady: ColorType.SUCCESS_3,
                typeActive: ColorType.SUCCESS_4,
            },
        };
        const settingError: any = {
            ghost: {
                typeOutline: undefined,
                typeDefault: undefined,
                typeReady: ColorType.ERROR_0,
                typeActive: ColorType.ERROR_1,
            },
            outline: {
                typeOutline: ColorType.ERROR_4,
                typeDefault: undefined,
                typeReady: ColorType.ERROR_0,
                typeActive: ColorType.ERROR_1,
            },
            filled: {
                typeOutline: ColorType.ERROR_2,
                typeDefault: ColorType.ERROR_2,
                typeReady: ColorType.ERROR_3,
                typeActive: ColorType.ERROR_4,
            },
        };
        const settingWarn: any = {
            ghost: {
                typeOutline: undefined,
                typeDefault: undefined,
                typeReady: ColorType.WARN_0,
                typeActive: ColorType.WARN_1,
            },
            outline: {
                typeOutline: ColorType.WARN_4,
                typeDefault: undefined,
                typeReady: ColorType.WARN_0,
                typeActive: ColorType.WARN_1,
            },
            filled: {
                typeOutline: ColorType.WARN_2,
                typeDefault: ColorType.WARN_2,
                typeReady: ColorType.WARN_3,
                typeActive: ColorType.WARN_4,
            },
        };

        function paneRow(settings: any): ReactElement {
            return (
                <ShowcaseRow>
                    {[
                        pane(settings.ghost),
                        pane(settings.outline),
                        pane(settings.filled),
                    ]}
                </ShowcaseRow>
            );
        }

        function pane(variantSettings: any): ReactElement {
            return paneForcedState(variantSettings, undefined);
        }

        function paneForcedState(variantSettings: any, state: PaneState): ReactElement {
            return <Pane
                outline={variantSettings.typeOutline}
                fillDefault={variantSettings.typeDefault}
                fillReady={variantSettings.typeReady}
                fillActive={variantSettings.typeActive}
                forcedState={state}
                className='behaviour-no-select'
                style={{
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                P
            </Pane>;
        }

        return (
            <>
                <h3>Panes</h3>
                {
                    [settingBase, settingPrimary, settingSuccess, settingWarn, settingError].map((settings: any) => {
                        return paneRow(settings);
                    })
                }
                <ShowcaseRow>
                    {paneForcedState(settingBase.outline, undefined)}
                    {paneForcedState(settingBase.outline, PaneState.DEFAULT)}
                    {paneForcedState(settingBase.outline, PaneState.READY)}
                    {paneForcedState(settingBase.outline, PaneState.ACTIVE)}
                </ShowcaseRow>
            </>
        );

    }


    function renderText() {
        return (
            <>
                <h3>Text</h3>
                <Text variant={TextVariant.H1}>Heading 1</Text>
                <Text variant={TextVariant.H2}>Heading 2</Text>
                <Text variant={TextVariant.H3}>Heading 3</Text>
                <Text variant={TextVariant.H4}>Heading 4</Text>
                <Text variant={TextVariant.H5}>Heading 5</Text>
                <Text variant={TextVariant.BODY}>Body</Text>
                <Text variant={TextVariant.CAPTION}>Caption</Text>
                <Text variant={TextVariant.BODY} type={Type.PRIMARY}>Primary</Text>
                <Text variant={TextVariant.BODY} type={Type.SUCCESS}>Success</Text>
                <Text variant={TextVariant.BODY} type={Type.WARN}>Warn</Text>
                <Text variant={TextVariant.BODY} type={Type.ERROR}>Error</Text>
            </>
        );
    }


}


function ShowcaseRow(props: React.PropsWithChildren<any>): any {
    return (
        <div className={'showcase-row' + (props.fullWidth ? ' showcase-row-full-width' : '')}>
            {props.children}
        </div>
    );
}


function ToggleableShowcase(props: React.PropsWithChildren<any>): any {
    const [show, setShow] = useState(false);
    return (
        <div>
            <button onClick={() => setShow(!show)}>{props.text}</button>
            {
                show
                    ? props.children
                    : null
            }
        </div>
    );
}


function StatefulComponent(props: React.PropsWithChildren<any>): any {
    const [data, setData] = useState(props.initialState);
    return (
        <div>
            <button onClick={() => setData(props.onAction(data))}>{props.title}</button>
            {props.renderContent(data)}
        </div>
    );
}
