import DomainError from './domain-error';

export default class BadRequestError extends DomainError {
  public statusCode = 400;
  constructor(message?: string) {
    super(message);
  }
}
