/* istanbul ignore file */
export default class StandardError extends Error {
  private statusCode: number;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
