import * as React from 'react';
import { ReactElement, useState } from 'react';
import "./showcase.css";
import { Text, TextVariant } from '../base/text/Text';
import { ColorType, GroupPosition, Size, Type, Variant } from '../common/common';
import { Button } from '../input/button/Button';
import { Pane } from '../base/pane/Pane';
import { Icon, IconType } from "../base/icon/Icon";
import { Label } from '../base/label/Label';
import { Checkbox } from '../input/checkbox/Checkbox';

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
                {renderCheckboxes()}
                {renderLabels()}
                {renderIcons()}
                {renderButtons()}
                {renderPanesInteractive()}
                {renderText()}
            </>
        );
    }


    function renderCheckboxes() {
        return (
            <>
                <h3>Checboxes</h3>

                <ShowcaseRow>
                    <Checkbox variant={Variant.SOLID} selected={true}>
                        Solid Checkbox
                    </Checkbox>
                    <Checkbox variant={Variant.OUTLINE} selected={true}>
                        Outline Checkbox
                    </Checkbox>
                    <Checkbox variant={Variant.GHOST} selected={true}>
                        Ghost Checkbox
                    </Checkbox>
                </ShowcaseRow>


                <ShowcaseRow>
                    <Checkbox variant={Variant.SOLID} selected={true} disabled>
                        Solid Checkbox Disabled
                    </Checkbox>
                    <Checkbox variant={Variant.OUTLINE} selected={true} disabled>
                        Outline Checkbox Disabled
                    </Checkbox>
                    <Checkbox variant={Variant.GHOST} selected={true} disabled>
                        Ghost Checkbox Disabled
                    </Checkbox>
                </ShowcaseRow>

                <Checkbox variant={Variant.OUTLINE}>
                    <Icon type={IconType.HOME} />
                    With Icon
                </Checkbox>

            </>
        );
    }


    function renderLabels() {
        return (
            <>
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
                        With Icon
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                        With Icon
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.OUTLINE}>
                        <Icon type={IconType.HOME} />
                        With Icon
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.GHOST}>
                        <Icon type={IconType.HOME} />
                        With Icon
                    </Button>
                    <Button type={Type.DEFAULT} variant={Variant.LINK}>
                        <Icon type={IconType.HOME} />
                        With Icon
                    </Button>
                </ShowcaseRow>

                <ShowcaseRow>
                    <Button disabled={true} type={Type.PRIMARY} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                        With Icon
                    </Button>
                    <Button type={Type.DEFAULT} disabled={true} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                        With Icon
                    </Button>
                    <Button type={Type.DEFAULT} disabled={true} variant={Variant.OUTLINE}>
                        <Icon type={IconType.HOME} />
                        With Icon
                    </Button>
                    <Button type={Type.DEFAULT} disabled={true} variant={Variant.GHOST}>
                        <Icon type={IconType.HOME} />
                        With Icon
                    </Button>
                    <Button type={Type.DEFAULT} disabled={true} variant={Variant.LINK}>
                        <Icon type={IconType.HOME} />
                        With Icon
                    </Button>
                </ShowcaseRow>

                <Button type={Type.DEFAULT} variant={Variant.SOLID}>
                    <Icon type={IconType.HOME} />
                    Two Icons
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
                    <Button square={true} type={Type.PRIMARY} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                    </Button>
                    <Button square={true} type={Type.DEFAULT} variant={Variant.SOLID}>
                        <Icon type={IconType.HOME} />
                    </Button>
                    <Button square={true} type={Type.DEFAULT} variant={Variant.OUTLINE}>
                        <Icon type={IconType.HOME} />
                    </Button>
                    <Button square={true} type={Type.DEFAULT} variant={Variant.GHOST}>
                        <Icon type={IconType.HOME} />
                    </Button>
                    <Button square={true} type={Type.DEFAULT} variant={Variant.LINK}>
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

            </>
        );

        function renderButtonRow(type: Type) {
            return (
                <ShowcaseRow>
                    <Button type={type} variant={Variant.SOLID}>Solid</Button>
                    <Button type={type} variant={Variant.OUTLINE}>Outline</Button>
                    <Button type={type} variant={Variant.GHOST}>Ghost</Button>
                    <Button type={type} variant={Variant.LINK}>Link</Button>
                    <Button type={type} disabled={true} variant={Variant.SOLID}>Solid</Button>
                    <Button type={type} disabled={true} variant={Variant.OUTLINE}>Outline</Button>
                    <Button type={type} disabled={true} variant={Variant.GHOST}>Ghost</Button>
                    <Button type={type} disabled={true} variant={Variant.LINK}>Link</Button>
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
            return <Pane
                outline={variantSettings.typeOutline}
                fillDefault={variantSettings.typeDefault}
                fillReady={variantSettings.typeReady}
                fillActive={variantSettings.typeActive}
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
