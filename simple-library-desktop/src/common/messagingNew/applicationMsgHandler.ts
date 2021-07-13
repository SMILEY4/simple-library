import {AbstractMsgHandler} from "./core/abstractMsgHandler";
import {IpcWrapper, mainIpcWrapper} from "./core/msgUtils";
import {ApplicationService} from "../../main/service/applicationService";
import {WindowService} from "../../main/service/windowService";

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


abstract class AbstractApplicationMsgHandler extends AbstractMsgHandler {

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


export class MainApplicationMsgHandler extends AbstractApplicationMsgHandler {

	private readonly appService: ApplicationService;
	private readonly windowService: WindowService;

	constructor(appService: ApplicationService, windowService: WindowService) {
		super(mainIpcWrapper());
		this.appService = appService;
		this.windowService = windowService;
	}

	protected openConfig(): Promise<void> {
		return this.appService.openConfigFile();
	}

	protected getExiftoolData(): Promise<GetExiftoolDataPayload> {
		return Promise.resolve(this.appService.getExiftoolLocation())
			.then((location: string | null) => ({
				location: location,
				defined: location !== null
			}));
	}

	protected getTheme(): Promise<"dark" | "light"> {
		return Promise.resolve(this.appService.getApplicationTheme());
	}

	protected setTheme(theme: "dark" | "light"): Promise<void> {
		this.windowService.setApplicationTheme(theme);
		this.appService.setApplicationTheme(theme);
		return Promise.resolve();
	}

}
