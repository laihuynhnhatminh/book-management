import DomainError from './domain-error';

export default class NotFoundError extends DomainError {
  public statusCode = 404;
  constructor(message?: string) {
    super(message);
  }
}
