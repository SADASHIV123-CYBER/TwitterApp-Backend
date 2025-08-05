// utils/parseValidationError.js
export function extractValidationMessages(error) {
  return Object.keys(error.errors).map(
    property => error.errors[property].message
  );
}
