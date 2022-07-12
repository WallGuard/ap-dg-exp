import { Op } from 'sequelize';
import { StatusCodes } from 'http-status-codes';

// const db = require('../models');
import db from '../db';
// console.log('DB', db);
// const SearchBuilder = require('../../utils/SearchBuilder');
import hash from'../../utils/hash';
import {
  createError,
  createValidationErrorBody,
} from'../../utils/createError';

const fieldsForExclude = [
  'password',
  'resetPasswordToken',
  'resetPasswordExpires',
];
const excludeFields = (user) => {
  const filtered = user.toJSON();

  fieldsForExclude.forEach((fieldName) => {
    delete filtered[fieldName];
  });

  return filtered;
};

const signUp = async ({ email, phone, password }) => {
  // console.log(db);
  const userWithSameEmail = await db.user.findOne({ where: { email } });
  if (userWithSameEmail) {
    throw createError(
      createValidationErrorBody([{ path: 'email', message: 'Email занят' }]),
    );
  };

  // const userWithSameLogin = await db.user.findOne({ where: { login } });
  // if (userWithSameLogin) {
  //   throw createError(
  //     createValidationErrorBody([{ path: 'login', message: 'Логин занят' }]),
  //   );
  // };

  const newUser = await db.user.create({
    email,
    phone,
    password: hash(password),
  });

  return excludeFields(newUser);
};

const signIn = async ({ email = '', password = '' }) => {
  const user = await db.user.findOne({
    where: {
      [Op.or]: [{ email }],
    },
    attributes: {
      include: ['password'],
    },
  });

  if (!user) {
    throw createError(
      createValidationErrorBody([
        { path: 'username', message: 'Пользователь не найден' },
      ]),
      { code: StatusCodes.NOT_FOUND },
    );
  }

  if (user.password !== hash(password)) {
    throw createError(
      createValidationErrorBody([
        { path: 'password', message: 'Не верный пароль' },
      ]),
    );
  }

  return excludeFields(user);
};

const getOne = async (id) => {
  const user = await db.user.findByPk(id);

  return user;
};

const getList = async (params) => {
  const formattedFilter = {};

  Object.keys(params.filter || {}).forEach((key) => {
    const value = params.filter[key];

    if (['role', 'tech_role', 'status'].includes(key)) {
      formattedFilter[key] = {
        type: '$or',
        value,
      };
    } else if (key === 'search') {
      formattedFilter.search = {
        type: '$search',
        value,
        fields: [
          'email',
          'firstName',
          'firstName_ru',
          'lastName',
          'lastName_ru',
          'slack_name',
        ],
      };
    } else {
      formattedFilter[key] = value;
    }
  });

  // const query = new SearchBuilder({
  //   pagination: params.pagination,
  //   sort: params.sort,
  //   filter: formattedFilter,
  // }).buildQuery();
  const users = await db.user.findAll(query);

  return users;
};

const updateUserFromAdmin = async (id, data) => {
  const [updatedItemsCount, [user]] = await db.user.update(data, {
    where: { id },
    returning: true,
  });

  if (!updatedItemsCount) {
    throw createError(
      createValidationErrorBody([
        { path: 'id', message: 'Пользователь не найден' },
      ]),
      { code: StatusCodes.NOT_FOUND },
    );
  }

  return user;
};

const update = async (id, data) => {
  const [updatedItemsCount, [user]] = await db.user.update(data, {
    where: { id },
    returning: true,
  });

  if (!updatedItemsCount) {
    throw createError(
      createValidationErrorBody([
        { path: 'id', message: 'Пользователь не найден' },
      ]),
      { code: StatusCodes.NOT_FOUND },
    );
  }

  return user;
};

const changePassword = async (id, data) => {
  const user = await db.user.findOne({
    where: { id },
    attributes: { include: ['password'] },
  });

  if (user.password !== hash(data.oldPassword)) {
    throw createError(
      createValidationErrorBody([
        { path: 'oldPassword', message: 'Не верный пароль' },
      ]),
    );
  }

  await user.update({ password: data.password });
};

export default {
  excludeFields,
  signUp,
  signIn,
  getOne,
  getList,
  update,
  changePassword,
  updateUserFromAdmin,
};
