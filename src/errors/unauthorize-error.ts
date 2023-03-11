import DomainError from './domain-error';

export default class UnauthorizeError extends DomainError {
  public statusCode = 401;
  constructor(message?: string) {
    super(message);
  }
}
