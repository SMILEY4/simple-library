export class Deferred<T> {

	private readonly promise: Promise<T>;
	private funResolve: (value?: T | PromiseLike<T>) => void;
	private funReject: (reason?: any) => void;

	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this.funReject = reject
			this.funResolve = resolve
		})
	}


	public getPromise(): Promise<T> {
		return this.promise;
	}

	public resolve(value?: T | PromiseLike<T>): void {
		this.funResolve(value)
	}


	public reject(reason?: any): void {
		this.funReject(reason)
	}

}