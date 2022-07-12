import { createError } from 'apollo-errors';

export const ChangeUserError = createError('TEST ERROR', {
  message: 'There is no such ID BLYAT!!!'
});

export const CreateUserError = createError('TEST ERROR', {
  message: 'This user aready exists BLYAT!!!'
});

export const InternalServerError = createError('TEST ERROR', {
  message: 'Internal Server error :-('
});
