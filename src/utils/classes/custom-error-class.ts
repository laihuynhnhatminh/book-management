export class CustomError extends Error {
	private errorCode: number | undefined;
	constructor(message: string, errorCode?: number) {
		super(message);
		this.errorCode = errorCode;
	}
}
