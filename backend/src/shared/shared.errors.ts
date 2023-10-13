export class CustomError extends Error {
  type: string;

  constructor(message: string, type: string) {
    super(message);
    this.type = type;

    // Set the prototype explicitly, necessary for custom errors in TypeScript
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
