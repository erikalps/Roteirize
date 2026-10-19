// src/utils/db-errors.ts
export function isUniqueViolation(error: unknown): boolean {
  return (
    !!error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === '23505'
  );
}




export function isInvalidTextRepresentation(error: unknown): boolean {
  return (
    !!error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === '22P02'
  );
}

