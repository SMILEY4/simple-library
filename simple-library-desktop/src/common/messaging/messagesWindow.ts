import {ErrorResponse, handleRequest, sendRequest} from "./messages";

export module SetApplicationTheme {

	export interface RequestPayload {
		theme: "dark" | "light"
	}

	export interface ResponsePayload {
	}

	const CHANNEL: string = 'window.set.theme';

	export function request(ipc: Electron.IpcRenderer, theme: "dark" | "light"): Promise<ResponsePayload> {
		return sendRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, {theme: theme})
	}

	export function handle(ipc: Electron.IpcMain, action: (payload: RequestPayload) => Promise<ResponsePayload | ErrorResponse>) {
		handleRequest<RequestPayload, ResponsePayload>(ipc, CHANNEL, action);
	}

}