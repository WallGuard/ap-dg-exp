import { StatusCodes } from 'http-status-codes';

import userService from '../../db/services/user';
import { createTokensPair } from '../../utils/token';

import { createError, createValidationErrorBody } from '../../utils/createError';

const signIn = async (req, res, next) => {
  try {
    console.log('EMAIL:', req.body.email);
    console.log('BODY', req.body);
    const {
      email,
      password,
    } = req.body;

    const user = await userService.signIn({
      email,
      password,
    });

    if (user.status === 'disabled') {
      throw createError(
        createValidationErrorBody([
          { path: 'username', message: 'Пользователь отключён' },
        ]),
        { code: StatusCodes.FORBIDDEN },
      );
    }

    res.json({
      ...createTokensPair(user.id),
      user,
    });
  } catch (err) {
    if (err.type === 'custom') {
      return res.status(err.code).json(err.message);
    }

    err.functionName = signIn.name;
    err.fileName = __filename;
    next(err);
  };
};

export default signIn;
