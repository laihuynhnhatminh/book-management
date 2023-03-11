export default abstract class DomainError extends Error {
  abstract statusCode: number;
  constructor(message?: string) {
    super(message);
  }
}
