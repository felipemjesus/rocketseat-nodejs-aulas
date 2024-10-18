export class LateCheckInValidationError extends Error {
  constructor() {
    super('The check-in time is in the past.')
  }
}
