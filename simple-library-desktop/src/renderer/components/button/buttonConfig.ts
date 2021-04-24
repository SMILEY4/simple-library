import { ColorType } from '../common';

export const BUTTON_PANE_CONFIG: any = {
    default: {
        link: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: undefined,
            typeActive: undefined,
        },
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
        solid: {
            typeOutline: ColorType.BASE_4,
            typeDefault: ColorType.BASE_1,
            typeReady: ColorType.BASE_2,
            typeActive: ColorType.BASE_3,
        },
    },
    primary: {
        link: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: undefined,
            typeActive: undefined,
        },
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
        solid: {
            typeOutline: ColorType.PRIMARY_2,
            typeDefault: ColorType.PRIMARY_2,
            typeReady: ColorType.PRIMARY_3,
            typeActive: ColorType.PRIMARY_4,
        },
    },
    success: {
        link: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: undefined,
            typeActive: undefined,
        },
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
        solid: {
            typeOutline: ColorType.SUCCESS_2,
            typeDefault: ColorType.SUCCESS_2,
            typeReady: ColorType.SUCCESS_3,
            typeActive: ColorType.SUCCESS_4,
        },
    },
    error: {
        link: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: undefined,
            typeActive: undefined,
        },
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
        solid: {
            typeOutline: ColorType.ERROR_2,
            typeDefault: ColorType.ERROR_2,
            typeReady: ColorType.ERROR_3,
            typeActive: ColorType.ERROR_4,
        },
    },
    warn: {
        link: {
            typeOutline: undefined,
            typeDefault: undefined,
            typeReady: undefined,
            typeActive: undefined,
        },
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
        solid: {
            typeOutline: ColorType.WARN_2,
            typeDefault: ColorType.WARN_2,
            typeReady: ColorType.WARN_3,
            typeActive: ColorType.WARN_4,
        },
    },
};

