import {AbstractMsgHandler} from "./core/abstractMsgHandler";
import {IpcWrapper} from "./core/msgUtils";

export module ApplicationMsgConstants {
	export const PREFIX: string = "app";
	export const OPEN_CONFIG: string = "open-config";
	export const GET_EXIFTOOL: string = "get-exiftool";
	export const GET_THEME: string = "get-theme";
	export const SET_THEME: string = "set-theme";

}


export interface GetExiftoolDataPayload {
	location: string | null;
	defined: boolean;
}


export abstract class AbstractApplicationMsgHandler extends AbstractMsgHandler {

	protected constructor(ipcWrapper: IpcWrapper) {
		super(ApplicationMsgConstants.PREFIX, ipcWrapper);
		this.register(ApplicationMsgConstants.OPEN_CONFIG, () => this.openConfig());
		this.register(ApplicationMsgConstants.GET_EXIFTOOL, () => this.getExiftoolData());
		this.register(ApplicationMsgConstants.GET_THEME, () => this.getTheme());
		this.register(ApplicationMsgConstants.SET_THEME, (payload: any) => this.setTheme(payload.theme));
	}

	protected abstract openConfig(): Promise<void>;

	protected abstract getExiftoolData(): Promise<GetExiftoolDataPayload>;

	protected abstract getTheme(): Promise<"dark" | "light">;

	protected abstract setTheme(theme: "dark" | "light"): Promise<void>;

}

