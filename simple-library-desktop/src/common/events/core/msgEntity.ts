export const ERROR_RESPONSE_MARKER: string = "error-response";

export type MsgEntity = MsgErrorEntity | MsgDefaultEntity

export interface MsgErrorEntity {
	status: string,
	traceId: string,
	error?: any,
}

export interface MsgDefaultEntity {
	traceId: string,
	body?: any,
}

export module MsgEntity {

	export function error(traceId: string, error?: any): MsgErrorEntity {
		return {
			status: ERROR_RESPONSE_MARKER,
			traceId: traceId,
			error: error
		};
	}

	export function entity(traceId: string, body?: any): MsgEntity {
		return {
			traceId: traceId,
			body: body
		};
	}


	export function isError(entity: MsgEntity) {
		const anyEntity = entity as any;
		return entity && anyEntity.status && anyEntity.status === ERROR_RESPONSE_MARKER;
	}

}


