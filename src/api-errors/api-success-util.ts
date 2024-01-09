
export default class ApiSuccess {
  code: number;

  data: unknown;

  constructor(code: number, data: unknown) {
    this.code = code;
    this.data = data;
  }

  // custom success response
  static customSuccessResponse(code:number, data:unknown) {
    return new ApiSuccess(code, data);
  }
}
