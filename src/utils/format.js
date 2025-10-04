import { json } from 'express';

export const formatValidationError = errors => {
  if (!errors || !errors.issues) return 'Invalid input';

  if (Array.isArray(errors.issues))
    return errors.issues.map(i => i.message).join(', ');

  return json.stringify(errors);
};
